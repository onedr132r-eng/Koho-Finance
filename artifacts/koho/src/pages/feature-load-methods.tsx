import { useState } from "react";
import { ArrowLeft, Building2, Plus, ChevronRight, Trash2 } from "lucide-react";
import { Link } from "wouter";

const LINKED_BANKS = [
  { id: "td", name: "TD Canada Trust", account: "Chequing ••••7241", color: "#3B8C3B", logo: "TD" },
  { id: "rbc", name: "Royal Bank of Canada", account: "Savings ••••4892", color: "#003168", logo: "RBC" },
];

export default function LoadMethods() {
  const [banks, setBanks] = useState(LINKED_BANKS);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Load Methods</h1>
      </header>

      <div className="px-4 pt-6">
        <h2 className="text-sm font-black text-gray-700 mb-3 px-1">Linked bank accounts</h2>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {banks.map(bank => (
            <div key={bank.id} className="flex items-center gap-4 px-5 py-4">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: bank.color }}
              >
                {bank.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{bank.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{bank.account}</p>
              </div>
              <button
                onClick={() => setBanks(prev => prev.filter(b => b.id !== bank.id))}
                className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}

          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
            <span className="font-semibold text-purple-700">Add bank account</span>
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-black text-gray-700 mb-3 px-1">Other load methods</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            <Link href="/direct-deposit" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Direct deposit</p>
                  <p className="text-xs text-gray-500">Receive payroll directly</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Add bank modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-sm p-6 pb-10" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black text-gray-900 mb-2">Link a bank account</h2>
            <p className="text-sm text-gray-500 mb-5">Connect your bank securely. We use 256-bit encryption to protect your information.</p>
            <div className="space-y-3 mb-5">
              {["BMO", "Scotiabank", "CIBC", "Desjardins"].map(b => (
                <button
                  key={b}
                  onClick={() => {
                    setBanks(prev => [...prev, { id: b.toLowerCase(), name: b, account: "Chequing ••••0000", color: "#6B7280", logo: b.slice(0, 3) }]);
                    setShowAdd(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-xs font-black text-gray-600">{b.slice(0, 3)}</div>
                  <span className="font-semibold text-gray-800">{b}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowAdd(false)} className="w-full py-3 rounded-full font-bold text-base text-gray-700 bg-gray-100">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
