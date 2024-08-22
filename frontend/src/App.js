import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Quests from './components/Quests';
import Friends from './components/Friends';
import Wallet from './components/Wallet';
import Terminal from './components/Terminal'; // Импортируем компонент Terminal

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/quests" element={<Quests />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/terminal" element={<Terminal />} /> {/* Добавляем маршрут для Terminal */}
            </Routes>
        </Router>
    );
};

export default App;
