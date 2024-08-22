import React from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaUsers, FaHome, FaWallet, FaTerminal } from 'react-icons/fa'; // Импортируем иконки
import './Home.css'; // Добавим стили для анимации

const Quests = () => {
    return (
        <div>
            <h1>Quests Page</h1>
            <div className="links">
                <Link to="/">
                    <FaHome size={24} className="icon" />
                </Link>
                <Link to="/friends">
                    <FaUsers size={24} className="icon" />
                </Link>
                <Link to="/quests">
                    <FaTasks size={24} className="icon" />
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

export default Quests;
