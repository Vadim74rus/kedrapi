import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTasks, FaUsers, FaHome, FaWallet, FaTerminal, FaBatteryEmpty, FaBatteryHalf, FaBatteryFull } from 'react-icons/fa'; // Импортируем иконки
import './Home.css'; // Добавим стили для анимации

const Home = () => {
    const [balance, setBalance] = useState(0);
    const [isFarming, setIsFarming] = useState(false);
    const [activeRectangles, setActiveRectangles] = useState([]);
    const [plusIndices, setPlusIndices] = useState([]); // Индексы прямоугольников с знаком "+"
    const [miningSpeed, setMiningSpeed] = useState('Low'); // Режим скорости майнинга
    const [remainingTime, setRemainingTime] = useState(0); // Оставшееся время до следующего запуска
    const userId = 1; // Замените на фактический идентификатор пользователя

    // Параметры для настройки количества и размера прямоугольников
    const numRows = 11; // Количество строк
    const numCols = 15; // Количество столбцов

    useEffect(() => {
        // Получить текущий баланс пользователя
        axios.get(`/api/auth/user?userId=${userId}`)
            .then(response => {
                setBalance(response.data.balance);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    useEffect(() => {
        let interval;
        if (isFarming) {
            const speeds = {
                Low: 1000,
                Norm: 500,
                Hard: 100
            };
            const speed = speeds[miningSpeed];

            interval = setInterval(() => {
                setBalance(prevBalance => prevBalance + 0.000001);

                // Обновляем активные прямоугольники каждые `speed` миллисекунд
                const rectangles = Array.from({ length: numRows * numCols }, (_, index) => index);
                const shuffledRectangles = rectangles.sort(() => Math.random() - 0.5);
                const activeIndices = shuffledRectangles.slice(0, 100); // Активировать первые 100 прямоугольников
                const randomPlusIndex = activeIndices[Math.floor(Math.random() * activeIndices.length)]; // Выбрать один случайный индекс для "+"
                setActiveRectangles(activeIndices);
                setPlusIndices([randomPlusIndex]);
            }, speed);

            // Остановить фарминг через 5 секунд
            setTimeout(() => {
                clearInterval(interval);
                setIsFarming(false);
                setActiveRectangles([]); // Погасить все прямоугольники
                setPlusIndices([]); // Погасить все знаки "+"
                setRemainingTime(5); // Установить оставшееся время на 5 секунд

                // Отправить запрос на сервер для обновления баланса
                axios.post('/api/auth/update-balance', { userId, amount: 0.000001 * 50 }) // 50 итераций
                    .catch(error => {
                        console.error('Error updating balance:', error);
                    });
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [isFarming, userId, miningSpeed]);

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [remainingTime]);

    const startFarming = () => {
        if (remainingTime === 0) {
            setIsFarming(true);
        }
    };

    return (
        <div className={`content ${miningSpeed.toLowerCase()}`}>
            <h1>Home Page</h1>
            <div className="balance-container">
                <div className="balance">{balance.toFixed(6)} KEDR</div>
            </div>
            <div>
                <label>
                    <input
                        type="radio"
                        value="Low"
                        checked={miningSpeed === 'Low'}
                        onChange={() => setMiningSpeed('Low')}
                    />
                    <FaBatteryEmpty size={24} />
                </label>
                <label>
                    <input
                        type="radio"
                        value="Norm"
                        checked={miningSpeed === 'Norm'}
                        onChange={() => setMiningSpeed('Norm')}
                    />
                    <FaBatteryHalf size={24} />
                </label>
                <label>
                    <input
                        type="radio"
                        value="Hard"
                        checked={miningSpeed === 'Hard'}
                        onChange={() => setMiningSpeed('Hard')}
                    />
                    <FaBatteryFull size={24} />
                </label>
            </div>
            <div className="rectangles-container" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)`, gridTemplateRows: `repeat(${numRows}, 1fr)` }}>
                {Array.from({ length: numRows * numCols }, (_, index) => (
                    <div
                        key={index}
                        className={`rectangle ${activeRectangles.includes(index) ? 'active' : ''} ${miningSpeed.toLowerCase()}`}
                    >
                        {plusIndices.includes(index) && <span className="plus-sign">+</span>}
                    </div>
                ))}
                <button className="start-button" onClick={startFarming} disabled={isFarming || remainingTime > 0}>
                    {remainingTime > 0 ? `Wait ${remainingTime}s` : 'Start farming'}
                </button>
            </div>
            <div className="links">
                <Link to="/">
                    <FaHome size={24} className="icon" />
                </Link>
                <Link to="/quests">
                    <FaTasks size={24} className="icon" />
                </Link>
                <Link to="/friends">
                    <FaUsers size={24} className="icon" />
                </Link>
                <Link to="/wallet">
                    <FaWallet size={24} className="icon" />
                </Link>
                <Link to="/terminal">
                    <FaTerminal size={24} className="icon" />
                </Link>
            </div>
        </div>
    );
};

export default Home;

