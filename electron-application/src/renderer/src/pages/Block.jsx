
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import blockchainLogo from '../assets/blockchain.png';
import { useNavigate } from 'react-router';

const Block = () => {
  const { blockHash } = useParams();
  const navigate = useNavigate();
  const [block, setBlock] = useState(null);
  const [blockError, setBlockError] = useState(null);
  const [status, setStatus] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [miningAddress, setMiningAddress] = useState(null);
  const [miningAddressError, setMiningAddressError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setLoading(true);
    setBlockError(null);
    setStatusError(null);
    setMiningAddress(null);
    setMiningAddressError(null);
    axios.get(`https://blockstream.info/api/block/${blockHash}`)
      .then(res => setBlock(res.data))
      .catch((err) => {
        setBlockError('Failed to load block data.');
        console.error('Failed to load block data:', err);
      });
    axios.get(`https://blockstream.info/api/block/${blockHash}/status`)
      .then(res => setStatus(res.data))
      .catch((err) => {
        setStatusError('Failed to load block status.');
        console.error('Failed to load block status:', err);
      });
    // Fetch coinbase tx to get mining address
    axios.get(`https://blockstream.info/api/block/${blockHash}/txs/0`)
      .then(res => {
        const txs = res.data;
        if (Array.isArray(txs) && txs.length > 0 && txs[0].vout && txs[0].vout.length > 0) {
          setMiningAddress(txs[0].vout[0].scriptpubkey_address);
        } else {
          setMiningAddressError('No mining address found');
        }
      })
      .catch((err) => {
        setMiningAddressError('Failed to load mining address');
        console.error('Failed to load mining address:', err);
      });
    setLoading(false);
  }, [blockHash]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      {/* Title and Blockchain Image */}
      <div className="flex items-center gap-4 mb-2">
        <img src={blockchainLogo} alt="Blockchain" className="h-12 w-12 object-contain" />
        <h1 className="text-2xl font-bold text-gray-900">
          {block && block.height !== undefined ? `Block ${block.height}` : 'Block'}
        </h1>
      </div>

      {/* Block Info Panel */}
      <div className="bg-white rounded shadow p-8 md:p-10 flex flex-col gap-2 max-w-2xl w-full self-center">
        <div className="text-lg font-semibold text-gray-800 mb-2">Block Details</div>
        {blockError ? (
          <div className="text-red-500">{blockError}</div>
        ) : !block ? (
          <div className="text-gray-400">Loading block data...</div>
        ) : (
          <table className="w-full text-left align-top">
            <tbody>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Hash:</th>
                <td className="font-mono break-all text-gray-800 py-1">{block.id}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Height:</th>
                <td className="py-1">{block.height}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Version:</th>
                <td className="py-1">{block.version}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Timestamp:</th>
                <td className="py-1">{new Date(block.timestamp * 1000).toLocaleString()}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">TX Count:</th>
                <td className="py-1">{block.tx_count}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Size (bytes):</th>
                <td className="py-1">{block.size}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Weight:</th>
                <td className="py-1">{block.weight}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Merkle Root:</th>
                <td className="font-mono break-all text-gray-800 py-1">{block.merkle_root}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Previous Block Hash:</th>
                <td className="py-1">
                  {block.previousblockhash ? (
                    <span
                      className="font-mono break-all text-blue-500 hover:underline cursor-pointer transition-opacity opacity-80 hover:opacity-100"
                      title="Go to previous block"
                      onClick={() => navigate(`/block/${block.previousblockhash}`)}
                    >
                      {block.previousblockhash}
                    </span>
                  ) : (
                    <span className="font-mono break-all text-gray-400">None</span>
                  )}
                </td>
              </tr>
              {block.difficulty && (
                <tr>
                  <th className="pr-4 py-1 text-gray-600 font-medium">Difficulty:</th>
                  <td className="py-1">{block.difficulty}</td>
                </tr>
              )}
              {block.nonce && (
                <tr>
                  <th className="pr-4 py-1 text-gray-600 font-medium">Nonce:</th>
                  <td className="py-1">{block.nonce}</td>
                </tr>
              )}
              {block.bits && (
                <tr>
                  <th className="pr-4 py-1 text-gray-600 font-medium">Bits:</th>
                  <td className="py-1">{block.bits}</td>
                </tr>
              )}
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Mining Address:</th>
                <td className="py-1">
                  {miningAddressError ? (
                    <span className="text-xs text-red-400">{miningAddressError}</span>
                  ) : miningAddress ? (
                    <span
                      className="font-mono break-all text-blue-500 hover:underline cursor-pointer transition-opacity opacity-80 hover:opacity-100"
                      title="View miner's wallet"
                      onClick={() => navigate(`/wallet/${miningAddress}`)}
                    >
                      {miningAddress}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Loading...</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Block Status Panel */}
      <div className="bg-white rounded shadow p-8 md:p-10 flex flex-col gap-2 max-w-2xl w-full self-center">
        <div className="text-lg font-semibold text-gray-800 mb-2">Block Status</div>
        {statusError ? (
          <div className="text-red-500">{statusError}</div>
        ) : !status ? (
          <div className="text-gray-400">Loading block status...</div>
        ) : (
          <table className="w-full text-left align-top">
            <tbody>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">In Best Chain:</th>
                <td className="py-1">{status.in_best_chain ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Height:</th>
                <td className="py-1">{status.height}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600 font-medium">Next Block Hash:</th>
                <td className="py-1 font-mono break-all text-blue-500">
                  {status.next_best || <span className="text-gray-400">None</span>}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Block;