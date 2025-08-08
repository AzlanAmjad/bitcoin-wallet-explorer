
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
  Legend,
  Filler
} from 'chart.js';
import bitcoinLogo from '../assets/bitcoin2.png';
import ClankerInsights from '../components/ClankerInsights';
import { useNavigate } from 'react-router';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);



const MOCK_STATS = {
  height: 850000,
  latestHash: '0000000000000000000a1b2c3d4e5f6g7h8i9j0k',
  mempoolTx: 12345,
};



const Home = () => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spotPrice, setSpotPrice] = useState(null);
  const [spotError, setSpotError] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [blocksError, setBlocksError] = useState(null);
  const [mempool, setMempool] = useState(null);
  const [mempoolError, setMempoolError] = useState(null);
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
    axios.get('https://api.coinbase.com/v2/prices/BTC-USD/spot')
      .then(res => {
        if (res.data && res.data.data && res.data.data.amount) {
          setSpotPrice(res.data.data.amount);
        } else {
          setSpotError('Failed to load spot price');
        }
      })
      .catch(() => {
        setSpotError('Failed to load spot price');
      });

    // Fetch latest blocks from Blockstream API
    axios.get('https://blockstream.info/api/blocks')
      .then(res => {
        setBlocks(res.data);
      })
      .catch(() => {
        setBlocksError('Failed to load latest blocks');
      });

    // Fetch mempool stats from Blockstream API
    axios.get('https://blockstream.info/api/mempool')
      .then(res => {
        setMempool(res.data);
      })
      .catch(() => {
        setMempoolError('Failed to load mempool stats');
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
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img src={bitcoinLogo} alt="Bitcoin" className="h-14 w-14 min-w-[3.5rem] min-h-[3.5rem] object-contain" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <div className="flex items-center gap-4 w-full">
            <span className="text-3xl font-bold text-gray-900">Bitcoin</span>
            <span className="text-lg font-semibold text-orange-500">BTC</span>
            {spotPrice && (
              <span className="ml-2 px-3 py-1 rounded bg-green-100 text-green-800 font-mono text-base shadow-sm">
                ${parseFloat(spotPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            )}
            {spotError && (
              <span className="ml-2 px-3 py-1 rounded bg-red-100 text-red-800 font-mono text-base shadow-sm">
                {spotError}
              </span>
            )}
          </div>
          <span className="text-gray-600 sm:ml-4 max-w-xl">
            Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.
          </span>
        </div>
      </div>

      {/* Blockchain stats panel */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="bg-white rounded shadow p-4 flex-1 flex flex-col items-center">
          <span className="text-xs text-gray-500">Block Height</span>
          {blocksError ? (
            <span className="text-xs text-red-500">Error</span>
          ) : blocks.length === 0 ? (
            <span className="text-xl text-gray-400">Loading...</span>
          ) : (
            <span className="text-xl font-bold">{blocks[0].height}</span>
          )}
        </div>
        <div className="bg-white rounded shadow p-4 flex-1 flex flex-col items-center">
          <span className="text-xs text-gray-500">Latest Block Hash</span>
          {blocksError ? (
            <span className="text-xs text-red-500">Error</span>
          ) : blocks.length === 0 ? (
            <span className="text-xs text-gray-400">Loading...</span>
          ) : (
            <span className="text-xs font-mono break-all text-gray-700">{blocks[0].id}</span>
          )}
        </div>
        <div className="bg-white rounded shadow p-4 flex-1 flex flex-col items-center">
          <span className="text-xs text-gray-500">Mempool TX Count</span>
          {mempoolError ? (
            <span className="text-xs text-red-500">Error</span>
          ) : mempool === null ? (
            <span className="text-xl text-gray-400">Loading...</span>
          ) : (
            <span className="text-xl font-bold">{mempool.count}</span>
          )}
        </div>
      </div>

      {/* Chart and Clanker Insights */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-white rounded shadow p-4 flex-1 flex flex-col min-w-0">
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
        <div className="flex-shrink-0 w-80">
          <ClankerInsights />
        </div>
      </div>

      {/* Latest blocks visualization */}
      <div className="mb-4">
        <div className="font-semibold text-gray-800 mb-2">Latest Blocks</div>
        {blocksError ? (
          <div className="text-red-500 text-sm mb-2">{blocksError}</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {blocks.length === 0 ? (
              <div className="text-gray-400 text-sm">Loading blocks...</div>
            ) : (
              blocks.map((block, idx) => (
                <div key={block.id} className="flex items-center">
                  <div
                    className="bg-white rounded shadow p-4 cursor-pointer hover:bg-blue-50 transition-colors w-56 min-w-[14rem]"
                    onClick={() => navigate(`/block/${block.id}`)}
                  >
                    <div className="text-xs text-gray-500">Height: <span className="font-bold text-gray-800">{block.height}</span></div>
                    <div className="text-xs text-gray-500">Hash:</div>
                    <div className="text-xs font-mono break-all text-gray-700 mb-1">{block.id}</div>
                    <div className="text-xs text-gray-500">TX Count: <span className="font-bold text-gray-800">{block.tx_count}</span></div>
                    <div className="text-xs text-gray-400">{new Date(block.timestamp * 1000).toLocaleString()}</div>
                  </div>
                  {/* Draw right arrow to previous block if not the last block */}
                  {idx < blocks.length - 1 && (
                    <div className="flex flex-col justify-center items-center min-h-full ml-6 mr-2" style={{ minHeight: '100%' }}>
                      <span className="text-gray-700 text-2xl font-bold">→</span>
                      <span className="text-[11px] text-gray-600 font-semibold">prev</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;