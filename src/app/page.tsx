'use client';

import { useState } from 'react';

// Arc Testnet Correct Config
const ARC_TESTNET_CHAIN_ID = '0x4cef52'; // 5042002 in hex

const switchOrAddArcNetwork = async () => {
  if (typeof window.ethereum === 'undefined') return;

  try {
    // 1. Request wallet to switch to Arc Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARC_TESTNET_CHAIN_ID }],
    });
  } catch (error: any) {
    // 2. If Arc Testnet is not added to the wallet (Error 4902)
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

  // Wallet Connection
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

  // Handle Transaction
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
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Arc Spark Tips
        </h1>
        <p className="text-slate-400 text-center mb-6 text-xs">
          Enter any recipient&apos;s EVM / USDC address to send instant tips on Arc Testnet!
        </p>

        {/* STEP 1: Connect Wallet */}
        <div className="mb-5">
          {!account ? (
            <button
              onClick={connectWallet}
              className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-cyan-400 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition duration-200"
            >
              🦊 Connect Wallet (MetaMask / Bitget)
            </button>
          ) : (
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-400 block mb-1">Your Connected Wallet:</span>
              <code className="text-xs font-mono text-cyan-400 break-all">{account}</code>
            </div>
          )}
        </div>

        <form onSubmit={handleSendTip} className="space-y-4">
          {/* STEP 2: Recipient Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="Enter EVM wallet address (0x...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white placeholder-slate-500 font-mono"
              required
            />
          </div>

          {/* Select Token */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Token
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setToken('USDC'); setAmount('1'); }}
                className={`py-2.5 rounded-xl font-semibold text-sm border transition ${
                  token === 'USDC' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                💵 USDC
              </button>
              <button
                type="button"
                onClick={() => { setToken('ETH'); setAmount('0.01'); }}
                className={`py-2.5 rounded-xl font-semibold text-sm border transition ${
                  token === 'ETH' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                💎 ETH
              </button>
            </div>
          </div>

          {/* Select Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Amount ({token})
            </label>

            {token === 'USDC' ? (
              <div className="grid grid-cols-5 gap-2">
                {['0.5', '1', '2', '3', '5'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-lg text-xs font-bold border ${
                      amount === val ? 'bg-cyan-500 text-slate-900 border-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
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
                placeholder="Enter ETH amount (e.g. 0.01)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white placeholder-slate-500"
                required
              />
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-lg transition duration-200 mt-2"
          >
            Send Tip ({amount} {token}) ✨
          </button>
        </form>

        {status && (
          <p className="mt-4 text-xs font-mono text-center text-cyan-400 break-all">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}
