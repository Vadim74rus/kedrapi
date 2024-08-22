import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Регистрация компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CryptoChart = ({ crypto }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchChartData = async () => {
            if (crypto.id === 'toncoin') {
                // Заглушка для Toncoin
                const prices = Array.from({ length: 30 }, (_, i) => ({
                    x: new Date().getTime() - (30 - i) * 24 * 60 * 60 * 1000,
                    y: Math.random() * 100,
                }));
                setChartData({
                    labels: prices.map((price) => new Date(price.x).toLocaleDateString()),
                    datasets: [
                        {
                            label: crypto.name,
                            data: prices.map((price) => price.y),
                            fill: false,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                        },
                    ],
                });
            } else {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${crypto.id}/market_chart`, {
                    params: {
                        vs_currency: 'usd',
                        days: '30',
                    },
                });

                const prices = response.data.prices.map((price) => ({
                    x: price[0],
                    y: price[1],
                }));

                setChartData({
                    labels: prices.map((price) => new Date(price.x).toLocaleDateString()),
                    datasets: [
                        {
                            label: crypto.name,
                            data: prices.map((price) => price.y),
                            fill: false,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                        },
                    ],
                });
            }
        };

        fetchChartData();
    }, [crypto.id, crypto.name]);

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{crypto.name} Chart</h2>
            <Line data={chartData} />
        </div>
    );
};

export default CryptoChart;

