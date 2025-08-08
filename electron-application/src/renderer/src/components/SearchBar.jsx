
import { useState } from 'react';

import bitcoinLogo from '../assets/bitcoin.png';
import { useNavigate } from 'react-router';

const SearchBar = ({ onSearch }) => {
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch && address.trim()) {
            onSearch(address.trim());
        }
    };

    return (
        <div className="sticky top-0 z-50 w-full bg-[#0a1437] flex justify-center shadow-lg font-sans">
            <form
                className="flex items-center w-full max-w-2xl p-2 gap-2"
                onSubmit={handleSubmit}
            >
                <img
                    src={bitcoinLogo}
                    alt="Bitcoin Logo"
                    className="h-7 w-7 min-w-[1.75rem] min-h-[1.75rem] object-contain mr-2 drop-shadow-md cursor-pointer transition-transform duration-150 hover:scale-110"
                    onClick={() => navigate('/')}
                />
                <input
                    type="text"
                    placeholder="Enter wallet address..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-l-md bg-[#14204b] text-white placeholder-white border-2 border-transparent focus:border-yellow-400 transition-colors duration-200 focus:outline-none font-sans"
                />
                <button
                    type="submit"
                    className="px-3 py-1.5 rounded-r-md bg-[#c2881b] text-black font-semibold border-2 border-[#e6c15b] text-sm transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none font-sans"
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
