'use client';

import { useState } from 'react';

const ARC_TESTNET_CHAIN_ID = '0x4cef52';

const switchOrAddArcNetwork = async () => {
  if (typeof window.ethereum === 'undefined') return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARC_TESTNET_CHAIN_ID }],
    });
  } catch (error: any) {
    if (error.code === 4902 || error.code === -32603) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ARC_TESTNET_CHAIN_ID,
              chainName: 'Arc Testnet',
              nativeCurrency: {
                name: 'USDC',
                symbol: 'USDC',
                decimals: 6,
              },
              rpcUrls: ['https://rpc.testnet.arc.network'],
              blockExplorerUrls: ['https://testnet.arcscan.app'],
            },
          ],
        });
      } catch (addError) {
        console.error('Failed to add Arc Testnet', addError);
      }
    }
  }
};

export default function Home() {
  const [account, setAccount] = useState<string>('');
  const [token, setToken] = useState<'USDC' | 'ETH'>('USDC');
  const [amount, setAmount] = useState<string>('1');
  const [recipient, setRecipient] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or Bitget Wallet!');
      return;
    }
    try {
      setStatus('Connecting wallet...');
      await switchOrAddArcNetwork();

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setStatus('Wallet connected to Arc Testnet!');
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Connection failed: ${err.message}`);
    }
  };

  const handleSendTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet first!');
      return;
    }
    if (!recipient) {
      alert('Please enter a recipient address!');
      return;
    }

    try {
      setStatus('Preparing transaction...');
      await switchOrAddArcNetwork();

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      const weiValue = BigInt(Math.floor(parsedAmount * 1e18));
      const hexValue = '0x' + weiValue.toString(16);

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: recipient,
            value: token === 'ETH' ? hexValue : '0x0',
          },
        ],
      });

      setStatus(`✅ Success! Tx Hash: ${txHash}`);
      alert(`Tip sent successfully! Tx Hash: ${txHash}`);
    } catch (error: any) {
      console.error(error);
      setStatus(`❌ Transaction failed: ${error.message || 'User rejected'}`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-2">
          Arc Spark Tips
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Enter any recipient&apos;s EVM / USDC address to send instant tips on Arc Testnet!
        </p>

        <div className="mb-4">
          {!account ? (
            <button
              onClick={connectWallet}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200"
            >
              🦊 Connect Wallet (MetaMask / Bitget)
            </button>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-400 block mb-1">Connected Wallet:</span>
              <code className="text-xs font-mono text-indigo-400 break-all">{account}</code>
            </div>
          )}
        </div>

        <form onSubmit={handleSendTip} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="Enter EVM wallet address (0x...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Select Token
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setToken('USDC'); setAmount('1'); }}
                className={`py-2 rounded-xl text-sm font-medium border transition ${
                  token === 'USDC'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                USDC
              </button>
              <button
                type="button"
                onClick={() => { setToken('ETH'); setAmount('0.01'); }}
                className={`py-2 rounded-xl text-sm font-medium border transition ${
                  token === 'ETH'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ETH
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Amount ({token})
            </label>

            {token === 'USDC' ? (
              <div className="grid grid-cols-5 gap-2">
                {['0.5', '1', '2', '3', '5'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-xl text-xs font-medium border transition ${
                      amount === val
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="number"
                step="0.0001"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                required
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200 mt-2"
          >
            Send Tip ({amount} {token})
          </button>
        </form>

        {status && (
          <p className="mt-4 text-xs font-mono text-center text-slate-400 break-all">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}
