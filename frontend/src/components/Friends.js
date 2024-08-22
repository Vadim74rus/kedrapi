import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTasks, FaUsers, FaHome, FaWallet, FaTerminal } from 'react-icons/fa'; // Импортируем иконки
import './Home.css'; // Добавим стили для анимации

const Friends = () => {
    const [referrals, setReferrals] = useState([]);
    const [referralCode, setReferralCode] = useState('');

    useEffect(() => {
        // Замените userId на фактический идентификатор пользователя
        const userId = 1;
        axios.get(`/api/auth/referrals?userId=${userId}`)
            .then(response => {
                setReferrals(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        // Замените userId на фактический идентификатор пользователя
        const userId = 1;
        axios.get(`/api/auth/user?userId=${userId}`)
            .then(response => {
                setReferralCode(response.data.referralCode);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>Friends Page</h1>
            <h2>Your Referral Code: {referralCode}</h2>
            <h3>Your Referrals:</h3>
            <ul>
                {referrals.map(referral => (
                    <li key={referral.id}>{referral.user.username}</li>
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

export default Friends;
