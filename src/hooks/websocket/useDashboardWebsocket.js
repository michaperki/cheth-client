import { useRef, useState, useEffect } from "react";
import useWebSocket from "./useWebsocket";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { toast } from "react-toastify";

const useDashboardWebsocket = ({ ethToUsdRate, userInfo }) => {
  const [searchingForOpponent, setSearchingForOpponent] = useState(false);
  const [opponentFound, setOpponentFound] = useState(false);
  const navigate = useNavigate();
  const timeoutIdRef = useRef(null);

  const handleDashboardPageWebSocketMessage = (message) => {
    console.log("Received message in DashboardPage:", message);
    const messageData = JSON.parse(message);
    console.log("messageData", messageData);

    if (messageData.type === "START_GAME") {
      console.log("Game started:", messageData);
      setOpponentFound(true);
      clearSearchTimeout();
    }

    if (messageData.type === "CONTRACT_READY") {
      console.log("Game contract ready:", messageData);
      clearSearchTimeout();
      setSearchingForOpponent(false);
      navigate(`/game-pending/${messageData.gameId}`);
    }

    if (messageData.type === "FUNDS_TRANSFERRED") {
      const transferredInEth = Web3.utils.fromWei(messageData.amount, "ether");
      const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
      toast.success(`You received $${transferredInUsd}.`);
    }
  };

  const { socket, onlineUsersCount } = useWebSocket(
    handleDashboardPageWebSocketMessage,
    userInfo?.user_id,
    ["ONLINE_USERS_COUNT"],
  );

  const clearSearchTimeout = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  useEffect(() => {
    if (searchingForOpponent && socket) {
      console.log("Setting timeout for search timeout");
      timeoutIdRef.current = setTimeout(() => {
        console.log("Search timed out");
        toast.error("Search timed out.");
        setSearchingForOpponent(false);
        if (socket.readyState === WebSocket.OPEN) {
          console.log("Sending CANCEL_SEARCH due to timeout");
          socket.send(
            JSON.stringify({
              type: "CANCEL_SEARCH",
              userId: userInfo?.user_id,
            }),
          );
        } else {
          console.log("Socket is not open. Cannot send CANCEL_SEARCH");
        }
      }, 30000); // 30 seconds
    }

    return () => clearSearchTimeout();
  }, [searchingForOpponent, socket, userInfo]);

  const cancelSearch = () => {
    console.log("Cancel search initiated");
    clearSearchTimeout();

    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Sending CANCEL_SEARCH message");
      socket.send(
        JSON.stringify({ type: "CANCEL_SEARCH", userId: userInfo?.user_id }),
      );
    } else {
      console.log("Socket is not open or undefined. Cannot send CANCEL_SEARCH");
    }

    setSearchingForOpponent(false);
    // Removed the toast notification for cancelling search
  };

  return {
    searchingForOpponent,
    opponentFound,
    setSearchingForOpponent,
    cancelSearch,
  };
};

export default useDashboardWebsocket;
