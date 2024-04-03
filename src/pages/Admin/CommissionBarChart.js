import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import Web3 from 'web3';

const CommissionBarChart = ({ gameData, ethToUsdRate }) => {
    const [commissionData, setCommissionData] = useState({ labels: [], commission: [], rewardPool: [] });

    useEffect(() => {
        // Check if gameData is defined before processing
        if (gameData && ethToUsdRate > 0) {
            // Calculate total commission and reward pool collected over time
            const commissionByDate = {};
            const rewardPoolByDate = {};
            gameData.forEach(game => {
                const createdAt = new Date(game.created_at).toLocaleDateString();
                if (!commissionByDate[createdAt]) {
                    commissionByDate[createdAt] = 0;
                    rewardPoolByDate[createdAt] = 0;
                }
                // Convert commission and reward pool from wei to ether
                const commissionInEther = Web3.utils.fromWei(game.commission, 'ether');
                const rewardPoolInEther = Web3.utils.fromWei(game.reward_pool, 'ether');
                // Convert commission and reward pool from ether to USD
                const commissionInUsd = parseFloat(commissionInEther) * ethToUsdRate;
                const rewardPoolInUsd = parseFloat(rewardPoolInEther) * ethToUsdRate;
                commissionByDate[createdAt] += commissionInUsd;
                rewardPoolByDate[createdAt] += rewardPoolInUsd;
            });

            // Convert data to chart format
            const labels = Object.keys(commissionByDate);
            const commission = Object.values(commissionByDate);
            const rewardPool = Object.values(rewardPoolByDate);

            setCommissionData({ labels, commission, rewardPool });
        }
    }, [gameData, ethToUsdRate]);

    useEffect(() => {
        // Create the bar chart
        const ctx = document.getElementById('commissionChart');
        if (ctx && commissionData.labels.length > 0) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: commissionData.labels,
                    datasets: [
                        {
                            label: 'Total Commission Collected (USD)',
                            data: commissionData.commission,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total Reward Pool (USD)',
                            data: commissionData.rewardPool,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [commissionData]);

    return (
        <div>
            <canvas id="commissionChart" width="400" height="200"></canvas>
        </div>
    );
};

export default CommissionBarChart;
