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
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Centered Light Blue Box */}
      <div className="max-w-md w-full bg-slate-900/95 backdrop-blur-md rounded-3xl p-8 border border-sky-400/50 shadow-[0_0_40px_rgba(56,189,248,0.15)] my-auto">
        <h1 className="text-3xl font-extrabold text-center mb-1 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          Arc Spark Tips
        </h1>
        <p className="text-sky-200/75 text-center mb-6 text-xs">
          Enter any recipient&apos;s EVM / USDC address to send instant tips on Arc Testnet!
        </p>

        <div className="mb-5">
          {!account ? (
            <button
              onClick={connectWallet}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-sky-500/25"
            >
              🦊 Connect Wallet (MetaMask / Bitget)
            </button>
          ) : (
            <div className="bg-black/60 border border-sky-400/40 rounded-2xl p-3 text-center">
              <span className="text-xs text-sky-300 block mb-1">My Connected Wallet:</span>
              <code className="text-xs font-mono text-sky-400 break-all">{account}</code>
            </div>
          )}
        </div>

        <form onSubmit={handleSendTip} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="Enter EVM wallet address (0x...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-black/50 border border-sky-900 focus:border-sky-400 rounded-2xl px-4 py-3 text-sm focus:outline-none text-white placeholder-sky-700 font-mono transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2">
              Select Token
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setToken('USDC'); setAmount('1'); }}
                className={`py-2.5 rounded-2xl font-semibold text-sm border transition ${
                  token === 'USDC'
                    ? 'bg-sky-400 text-black border-sky-300 font-bold shadow-md shadow-sky-400/20'
                    : 'bg-black/50 border-sky-900 text-sky-400 hover:border-sky-700'
                }`}
              >
                💵 USDC
              </button>
              <button
                type="button"
                onClick={() => { setToken('ETH'); setAmount('0.01'); }}
                className={`py-2.5 rounded-2xl font-semibold text-sm border transition ${
                  token === 'ETH'
                    ? 'bg-sky-400 text-black border-sky-300 font-bold shadow-md shadow-sky-400/20'
                    : 'bg-black/50 border-sky-900 text-sky-400 hover:border-sky-700'
                }`}
              >
                💎 ETH
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2">
              Amount ({token})
            </label>

            {token === 'USDC' ? (
              <div className="grid grid-cols-5 gap-2">
                {['0.5', '1', '2', '3', '5'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      amount === val
                        ? 'bg-sky-400 text-black border-sky-300 shadow-md shadow-sky-400/20'
                        : 'bg-black/50 border-sky-900 text-sky-300 hover:border-sky-700'
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
                className="w-full bg-black/50 border border-sky-900 focus:border-sky-400 rounded-2xl px-4 py-3 text-sm focus:outline-none text-white placeholder-sky-700 transition"
                required
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-black font-extrabold py-3.5 rounded-2xl shadow-lg shadow-sky-400/25 transition duration-200 mt-2"
          >
            Send Tip ({amount} {token}) ✨
          </button>
        </form>

        {status && (
          <p className="mt-4 text-xs font-mono text-center text-sky-400 break-all">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}
