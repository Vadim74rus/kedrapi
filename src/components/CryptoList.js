import React, { useState } from 'react';

const CryptoList = ({ cryptos, onCryptoClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCryptos = cryptos.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search for a crypto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredCryptos.map((crypto) => (
                    <li key={crypto.id} onClick={() => onCryptoClick(crypto)}>
                        {crypto.name} ({crypto.symbol})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CryptoList;
