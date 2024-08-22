import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoList from './CryptoList';
import CryptoChart from './CryptoChart';
import { FaBitcoin, FaEthereum, FaRegQuestionCircle, FaHome, FaUsers, FaTasks, FaWallet, FaTerminal } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Terminal = () => {
    const [cryptos, setCryptos] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState(null);

    useEffect(() => {
        const fetchCryptos = async () => {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 100,
                    page: 1,
                    sparkline: false,
                },
            });
            const filteredCryptos = response.data.filter(crypto =>
                ['bitcoin', 'ethereum'].includes(crypto.id)
            );
            // Добавляем Toncoin вручную
            const toncoin = {
                id: 'toncoin',
                name: 'Toncoin',
                symbol: 'TON',
                current_price: 0, // Можно заменить на реальные данные, если они доступны
                market_cap: 0,
                market_cap_rank: 0,
                total_volume: 0,
                high_24h: 0,
                low_24h: 0,
                price_change_24h: 0,
                price_change_percentage_24h: 0,
                circulating_supply: 0,
                total_supply: 0,
                max_supply: 0,
                ath: 0,
                ath_change_percentage: 0,
                ath_date: '',
                atl: 0,
                atl_change_percentage: 0,
                atl_date: '',
                roi: null,
                last_updated: '',
            };
            setCryptos([...filteredCryptos, toncoin]);
        };

        fetchCryptos();
    }, []);

    const handleCryptoClick = (crypto) => {
        setSelectedCrypto(crypto);
    };

    return (
        <div>
            <h1>Crypto Terminal</h1>
            <CryptoList cryptos={cryptos} onCryptoClick={handleCryptoClick} />
            {selectedCrypto && (
                <div>
                    <h2>{selectedCrypto.name} <span>{getIcon(selectedCrypto.id)}</span></h2>
                    <CryptoChart crypto={selectedCrypto} />
                </div>
            )}
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
            <style jsx>{`
                .links {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                }
                .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
};

const getIcon = (cryptoId) => {
    switch (cryptoId) {
        case 'bitcoin':
            return <FaBitcoin />;
        case 'ethereum':
            return <FaEthereum />;
        case 'toncoin':
            return <FaRegQuestionCircle />; // Используем временную иконку для Toncoin
        default:
            return null;
    }
};

export default Terminal;
