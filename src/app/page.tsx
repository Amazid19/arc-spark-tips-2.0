'use client';

import { useState } from 'react';

// 🔹 Arc Testnet Contract Address
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; 

export default function Home() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Sending ${amount} ETH tip to ${recipient} via contract: ${CONTRACT_ADDRESS}`);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Arc Spark Tips
        </h1>
        <p className="text-slate-400 text-center mb-6 text-sm">
          A seamless Web3 tipping platform on Arc Testnet
        </p>

        {/* Contract Address Display Box */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 mb-6 text-center">
          <span className="text-xs text-slate-400 block mb-1">Contract Address:</span>
          <code className="text-xs font-mono text-cyan-400 break-all">
            {CONTRACT_ADDRESS}
          </code>
        </div>

        <form onSubmit={handleSendTip} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white placeholder-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white placeholder-slate-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl shadow-lg transition duration-200 mt-2"
          >
            Send Tip ✨
          </button>
        </form>
      </div>
    </main>
  );
}
