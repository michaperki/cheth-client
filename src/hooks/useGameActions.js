const useGameActions = (gameId, userInfo, handleFetchGameInfo, gameUrl) => {
  const handleJoinGame = () => {
    // semd them to the lichess url
    window.open(`https://lichess.org/${gameUrl}`, "_blank").focus();
  };

  const handleReportGameOver = async () => {
    // Logic to report game over
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/game/reportGameOver`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameId }),
        },
      );
      if (response.ok) {
        handleFetchGameInfo();
      } else {
        throw new Error("Failed to report game over");
      }
    } catch (error) {
      console.error("Error reporting game over:", error);
    }
  };

  const handleReportIssue = async () => {
    // Logic to report an issue and lock the game
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/game/reportIssue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameId: gameId }),
        },
      );
      if (response.ok) {
        alert("Issue reported and game locked!");
      } else {
        throw new Error("Failed to report issue");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      alert("Failed to report issue");
    }
  };

  const handleRematch = () => {
    console.log("Rematching...");
    console.log("gameId", gameId);
    console.log("userId", userInfo.user_id);
    try {
      const response = fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/game/requestRematch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userInfo.user_id, gameId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to rematch");
      }

      console.log("Rematch successful!");
    } catch (error) {
      console.error("Error rematching:", error);
    }
  };

  const handleAcceptRematch = () => {
    console.log("Accepting rematch...");

    try {
      const response = fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/game/acceptRematch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userInfo.user_id, gameId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to accept rematch");
      }

      console.log("Rematch accepted!");
    } catch (error) {
      console.error("Error accepting rematch:", error);
    }
  };

  const handleDeclineRematch = () => {
    console.log("Declining rematch...");
    try {
      const response = fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/game/declineRematch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userInfo.user_id, gameId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to decline rematch");
      }

      console.log("Rematch declined!");
    } catch (error) {
      console.error("Error declining rematch:", error);
    }
  };

  const handleCancelRematch = () => {
    console.log("Canceling rematch...");
    try {
      const response = fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/game/cancelRematch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userInfo.user_id, gameId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel rematch");
      }

      console.log("Rematch canceled!");
    } catch (error) {
      console.error("Error canceling rematch:", error);
    }
  };

  return {
    handleJoinGame,
    handleReportGameOver,
    handleReportIssue,
    handleRematch,
    handleAcceptRematch,
    handleDeclineRematch,
    handleCancelRematch,
  };
};

export default useGameActions;
