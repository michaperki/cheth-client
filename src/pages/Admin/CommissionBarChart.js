import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Web3 from 'web3';

const CommissionBarChart = ({ gameData, ethToUsdRate }) => {
    const [chartData, setChartData] = useState({ labels: [], commission: [], rewardPool: [], totalGames: [] });
    const chartRef = useRef(null);

    useEffect(() => {
        // Check if gameData is defined before processing
        if (gameData && ethToUsdRate > 0) {
            // Calculate total commission, reward pool, and total games created over time
            const commissionByDate = {};
            const rewardPoolByDate = {};
            const totalGamesByDate = {};
            gameData.forEach(game => {
                const createdAt = new Date(game.created_at).toLocaleDateString();
                if (!commissionByDate[createdAt]) {
                    commissionByDate[createdAt] = 0;
                }
                if (!rewardPoolByDate[createdAt]) {
                    rewardPoolByDate[createdAt] = 0;
                }
                if (!totalGamesByDate[createdAt]) {
                    totalGamesByDate[createdAt] = 0;
                }
                // Convert commission and reward pool from wei to ether
                const commissionInEther = Web3.utils.fromWei(game.commission, 'ether');
                const rewardPoolInEther = Web3.utils.fromWei(game.reward_pool, 'ether');
                // Convert commission and reward pool from ether to USD
                const commissionInUsd = parseFloat(commissionInEther) * ethToUsdRate;
                const rewardPoolInUsd = parseFloat(rewardPoolInEther) * ethToUsdRate;
                commissionByDate[createdAt] += commissionInUsd;
                rewardPoolByDate[createdAt] += rewardPoolInUsd;
                // Count total games created
                totalGamesByDate[createdAt]++;
            });

            // Convert data to chart format
            const labels = Object.keys(commissionByDate);
            const commission = Object.values(commissionByDate);
            const rewardPool = Object.values(rewardPoolByDate);
            const totalGames = Object.values(totalGamesByDate);

            setChartData({ labels, commission, rewardPool, totalGames });
        }
    }, [gameData, ethToUsdRate]);

    useEffect(() => {
        // Create or update the bar chart
        if (chartRef.current && chartData.labels.length > 0) {
            if (chartRef.current.chart) {
                // If chart instance exists, destroy it before creating a new one
                chartRef.current.chart.destroy();
            }
            chartRef.current.chart = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: 'Total Commission Collected (USD)',
                            data: chartData.commission,
                            yAxisID: 'ethYAxis',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total Reward Pool (USD)',
                            data: chartData.rewardPool,
                            yAxisID: 'ethYAxis',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total Games Created',
                            data: chartData.totalGames,
                            yAxisID: 'totalGamesYAxis',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    height: 400,
                    scales: {
                        ethYAxis: {
                            position: 'left',
                            title: {
                                display: true,
                                text: 'USD'
                            }
                        },
                        totalGamesYAxis: {
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Total Games'
                            }
                        }
                    }
                }
            });
        }
    }, [chartData]);

    return (
        <div>
            <canvas ref={chartRef} />
        </div>
    );
};

export default CommissionBarChart;
