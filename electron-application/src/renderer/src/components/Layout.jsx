

import { Outlet, useNavigate } from 'react-router';
import SearchBar from './SearchBar';


const Layout = () => {

    const navigate = useNavigate();
    const handleSearch = (address) => {
        if (address) {
            navigate(`/wallet/${address}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <SearchBar onSearch={handleSearch} />
            <main className="pt-6 max-w-3xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;