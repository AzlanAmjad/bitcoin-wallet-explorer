import ewalletLogo from '../assets/ewallet.png';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import ClankerInsights from '../components/ClankerInsights';

const Wallet = () => {
  const { address } = useParams();
  const [walletInfo, setWalletInfo] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [spotPrice, setSpotPrice] = useState(null);
  const [spotError, setSpotError] = useState(null);
  const [txs, setTxs] = useState([]);
  const [txsError, setTxsError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setLoading(true);
    setWalletError(null);
    setSpotError(null);
    setTxsError(null);
    // Get wallet info
    axios.get(`https://blockstream.info/api/address/${address}`)
      .then(res => setWalletInfo(res.data))
      .catch(() => setWalletError('Failed to load wallet info.'));
    // Get spot price
    axios.get('https://api.coinbase.com/v2/prices/BTC-USD/spot')
      .then(res => {
        if (res.data && res.data.data && res.data.data.amount) {
          setSpotPrice(res.data.data.amount);
        } else {
          setSpotError('Failed to load spot price');
        }
      })
      .catch(() => setSpotError('Failed to load spot price'));
    // Get transactions
    axios.get(`https://blockstream.info/api/address/${address}/txs`)
      .then(res => setTxs(res.data))
      .catch(() => setTxsError('Failed to load transactions.'));
    setLoading(false);
  }, [address]);

  // Calculate balances
  let confirmed = 0, unconfirmed = 0;
  if (walletInfo) {
    confirmed = walletInfo.chain_stats.funded_txo_sum - walletInfo.chain_stats.spent_txo_sum;
    unconfirmed = walletInfo.mempool_stats.funded_txo_sum - walletInfo.mempool_stats.spent_txo_sum;
  }
  const btc = (confirmed + unconfirmed) / 1e8;
  const btcConfirmed = confirmed / 1e8;
  const btcUnconfirmed = unconfirmed / 1e8;
  const usd = spotPrice ? (btc * parseFloat(spotPrice)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '...';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img src={ewalletLogo} alt="Wallet" className="h-14 w-14 min-w-[3.5rem] min-h-[3.5rem] object-contain" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-gray-500 break-all">{address}</span>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">{btc.toLocaleString(undefined, {minimumFractionDigits: 8, maximumFractionDigits: 8})} BTC</span>
            <span className="text-lg font-semibold text-green-600">${usd}</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-600">
            <span>Confirmed: <span className="font-bold text-gray-800">{btcConfirmed.toLocaleString(undefined, {minimumFractionDigits: 8, maximumFractionDigits: 8})}</span></span>
            <span>Unconfirmed: <span className="font-bold text-gray-800">{btcUnconfirmed.toLocaleString(undefined, {minimumFractionDigits: 8, maximumFractionDigits: 8})}</span></span>
          </div>
        </div>
      </div>

      {/* Clanker Insights */}
      <div className="mb-4">
        <div className="w-full">
          <ClankerInsights />
        </div>
      </div>

      {/* Address Stats */}
      {walletInfo && (
        <div className="bg-white rounded shadow p-6 mb-4">
          <div className="text-lg font-semibold text-gray-800 mb-2">Address Stats</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><span className="font-medium text-gray-600">Total Transactions:</span> {walletInfo.chain_stats.tx_count + walletInfo.mempool_stats.tx_count}</div>
            <div><span className="font-medium text-gray-600">Funded TXOs:</span> {walletInfo.chain_stats.funded_txo_count}</div>
            <div><span className="font-medium text-gray-600">Spent TXOs:</span> {walletInfo.chain_stats.spent_txo_count}</div>
            <div><span className="font-medium text-gray-600">Total Received:</span> {(walletInfo.chain_stats.funded_txo_sum / 1e8).toLocaleString(undefined, {minimumFractionDigits: 8, maximumFractionDigits: 8})} BTC</div>
            <div><span className="font-medium text-gray-600">Total Sent:</span> {(walletInfo.chain_stats.spent_txo_sum / 1e8).toLocaleString(undefined, {minimumFractionDigits: 8, maximumFractionDigits: 8})} BTC</div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="text-lg font-semibold text-gray-800 mb-2">Transactions</div>
        {txsError ? (
          <div className="text-red-500">{txsError}</div>
        ) : txs.length === 0 ? (
          <div className="text-gray-400">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left align-top">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pr-4 py-2">TXID</th>
                  <th className="pr-4 py-2">Date</th>
                  <th className="pr-4 py-2">Type</th>
                  <th className="pr-4 py-2">Amount</th>
                  <th className="pr-4 py-2">Fee</th>
                </tr>
              </thead>
              <tbody>
                {txs.map(tx => {
                  const isIncoming = tx.vout.some(v => v.scriptpubkey_address === address);
                  const isOutgoing = tx.vin.some(v => v.prevout && v.prevout.scriptpubkey_address === address);
                  const valueIn = tx.vout.filter(v => v.scriptpubkey_address === address).reduce((sum, v) => sum + v.value, 0);
                  const valueOut = tx.vin.filter(v => v.prevout && v.prevout.scriptpubkey_address === address).reduce((sum, v) => sum + v.prevout.value, 0);
                  const amount = (valueIn - valueOut) / 1e8;
                  const fee = tx.fee ? tx.fee / 1e8 : 0;
                  return (
                    <tr key={tx.txid} className="border-b hover:bg-gray-50">
                      <td className="pr-4 py-2 font-mono break-all text-blue-500 opacity-80 cursor-pointer hover:underline" title="View on Blockstream Explorer" onClick={() => window.open(`https://blockstream.info/tx/${tx.txid}`, '_blank')}>{tx.txid}</td>
                      <td className="pr-4 py-2">{tx.status && tx.status.block_time ? new Date(tx.status.block_time * 1000).toLocaleString() : 'Unconfirmed'}</td>
                      <td className="pr-4 py-2">{isIncoming && !isOutgoing ? 'In' : isOutgoing && !isIncoming ? 'Out' : 'Self'}</td>
                      <td className="pr-4 py-2">{amount.toLocaleString(undefined, {minimumFractionDigits: 8, maximumFractionDigits: 8})} BTC</td>
                      <td className="pr-4 py-2">{fee ? `${fee.toLocaleString(undefined, {minimumFractionDigits: 8, maximumFractionDigits: 8})} BTC` : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Wallet;