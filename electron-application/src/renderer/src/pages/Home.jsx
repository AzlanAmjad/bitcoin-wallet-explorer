
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import bitcoinLogo from '../assets/bitcoin2.png';
import robotLogo from '../assets/robot.png';
import { useNavigate } from 'react-router';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const MOCK_BLOCKS = [
  { height: 850000, hash: '0000000000000000000a1b2c3d4e5f6g7h8i9j0k', txCount: 3123, time: '2025-08-08 12:01' },
  { height: 849999, hash: '0000000000000000000b2c3d4e5f6g7h8i9j0k1l', txCount: 2987, time: '2025-08-08 11:55' },
  { height: 849998, hash: '0000000000000000000c3d4e5f6g7h8i9j0k1l2m', txCount: 3050, time: '2025-08-08 11:50' },
  { height: 849997, hash: '0000000000000000000d4e5f6g7h8i9j0k1l2m3n', txCount: 2876, time: '2025-08-08 11:45' },
  { height: 849996, hash: '0000000000000000000e5f6g7h8i9j0k1l2m3n4o', txCount: 2999, time: '2025-08-08 11:40' },
  { height: 849995, hash: '0000000000000000000f6g7h8i9j0k1l2m3n4o5p', txCount: 3102, time: '2025-08-08 11:35' },
];

const MOCK_STATS = {
  height: 850000,
  latestHash: '0000000000000000000a1b2c3d4e5f6g7h8i9j0k',
  mempoolTx: 12345,
};

const Home = () => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30')
      .then(res => {
        setPriceData(res.data.prices);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load price data');
        setLoading(false);
      });
  }, []);

  // Prepare chart data
  const chartData = priceData ? {
    labels: priceData.map(([ts]) => {
      const d = new Date(ts);
      return `${d.getMonth()+1}/${d.getDate()}`;
    }),
    datasets: [
      {
        label: 'BTC Price (USD)',
        data: priceData.map(([, price]) => price),
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245, 158, 66, 0.1)',
        tension: 0.2,
        pointRadius: 0,
        fill: true,
      }
    ]
  } : null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img src={bitcoinLogo} alt="Bitcoin" className="h-14 w-14 min-w-[3.5rem] min-h-[3.5rem] object-contain" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">Bitcoin</span>
            <span className="text-lg font-semibold text-orange-500">BTC</span>
          </div>
          <span className="text-gray-600 sm:ml-4 max-w-xl">
            Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.
          </span>
        </div>
      </div>

      {/* Blockchain stats panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500">Block Height</span>
          <span className="text-xl font-bold">{MOCK_STATS.height}</span>
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500">Latest Block Hash</span>
          <span className="text-xs font-mono break-all text-gray-700">{MOCK_STATS.latestHash}</span>
        </div>
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500">Mempool TX Count</span>
          <span className="text-xl font-bold">{MOCK_STATS.mempoolTx}</span>
        </div>
      </div>

      {/* Chart and Clanker Insights */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-white rounded shadow p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-800">30 Day BTC Price Chart</span>
            <span className="text-xs text-gray-400">powered by CoinGecko</span>
          </div>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading chart...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">{error}</div>
          ) : (
            <Line data={chartData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { x: { grid: { display: false } }, y: { grid: { color: '#eee' } } }
            }} height={220} />
          )}
        </div>
        <div className="bg-white rounded shadow p-4 w-full md:w-80 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <img src={robotLogo} alt="Clanker" className="h-7 w-7 object-contain" />
            <span className="font-semibold text-gray-800">Clanker Insights</span>
          </div>
          <div className="text-gray-600 text-sm">
            Bitcoin's mempool is currently healthy. Network activity is steady. No major anomalies detected. (Mocked AI insight)
          </div>
        </div>
      </div>

      {/* Latest blocks visualization */}
      <div className="mb-4">
        <div className="font-semibold text-gray-800 mb-2">Latest Blocks</div>
        <div className="flex flex-wrap gap-4">
          {MOCK_BLOCKS.map(block => (
            <div
              key={block.hash}
              className="bg-white rounded shadow p-4 cursor-pointer hover:bg-blue-50 transition-colors w-56"
              onClick={() => navigate(`/block/${block.hash}`)}
            >
              <div className="text-xs text-gray-500">Height: <span className="font-bold text-gray-800">{block.height}</span></div>
              <div className="text-xs text-gray-500">Hash:</div>
              <div className="text-xs font-mono break-all text-gray-700 mb-1">{block.hash}</div>
              <div className="text-xs text-gray-500">TX Count: <span className="font-bold text-gray-800">{block.txCount}</span></div>
              <div className="text-xs text-gray-400">{block.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;