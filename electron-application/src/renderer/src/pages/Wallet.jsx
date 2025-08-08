
import { useParams } from 'react-router';

const Wallet = () => {
    const { address } = useParams();
    return (
        <div className="p-6">
            <div className="mb-4 p-4 rounded bg-blue-900 text-yellow-400 text-lg shadow font-mono">
                Wallet Address: {address}
            </div>
            {/* ...other wallet details here... */}
        </div>
    );
};

export default Wallet;