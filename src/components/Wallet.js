import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTasks, FaUsers, FaHome, FaWallet, FaTerminal } from 'react-icons/fa'; // Импортируем иконки
import './Home.css'; // Добавим стили для анимации

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const userId = 1; // Замените на фактический идентификатор пользователя

    useEffect(() => {
        // Получить текущий баланс пользователя
        axios.get(`/api/auth/user?userId=${userId}`)
            .then(response => {
                setBalance(response.data.balance);
            })
            .catch(error => {
                console.error(error);
            });

        // Получить историю транзакций пользователя
        axios.get(`/api/auth/transactions?userId=${userId}`)
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>Wallet Page</h1>
            <div className="balance-container">
                <div className="balance">{balance.toFixed(6)} KEDR</div>
            </div>
            <h3>Transaction History:</h3>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>
                        {transaction.type}: {transaction.amount} KEDR on {new Date(transaction.date).toLocaleString()}
                    </li>
                ))}
            </ul>
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

export default Wallet;
