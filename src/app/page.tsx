"use client";

import React, { useState } from "react";

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [token, setToken] = useState("USDC");
  const [amount, setAmount] = useState("1");

  const handleSendTip = () => {
    alert(`Sending ${amount} ${token} to ${recipient}`);
  };

  return (
    <main className="min-h-screen bg-sky-500 flex flex-col items-center justify-center p-4 text-black">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-slate-900">
          Arc Spark Tips
        </h1>
        <p className="text-center text-slate-700 mb-6 text-sm">
          Enter any recipient's EVM / USDC address to send instant tips on Arc Testnet!
        </p>

        <div className="mb-6 flex justify-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow transition duration-200">
            🦊 Connect Wallet (MetaMask / Bitget)
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter EVM wallet address (0x...)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Token
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setToken("USDC")}
                className={`flex-1 py-2 rounded-lg border font-medium ${
                  token === "USDC"
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                💵 USDC
              </button>
              <button
                type="button"
                onClick={() => setToken("ETH")}
                className={`flex-1 py-2 rounded-lg border font-medium ${
                  token === "ETH"
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-slate-700 border-slate-300"
                }`}
              >
                💎 ETH
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount ({token})
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {["0.5", "1", "2", "3", "5"].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-1.5 text-sm rounded-lg border font-medium ${
                    amount === val
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-black text-center font-bold"
            />
          </div>

          <button
            onClick={handleSendTip}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-200 mt-4"
          >
            Send Tip ({amount} {token}) ✨
          </button>
        </div>
      </div>
    </main>
  );
}
