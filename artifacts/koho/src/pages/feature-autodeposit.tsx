import { useState } from "react";
import { ArrowLeft, Mail, Info } from "lucide-react";
import { Link } from "wouter";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none"
      style={{ backgroundColor: on ? "#3B1F8C" : "#D1D5DB" }}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform"
        style={{ transform: on ? "translateX(30px)" : "translateX(2px)" }}
      />
    </button>
  );
}

export default function Autodeposit() {
  const [enabled, setEnabled] = useState(true);
  const autoDpEmail = "rayanre@hotmail.fr";

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Autodeposit</h1>
      </header>

      <div className="px-4 pt-8 flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#EDE9FF" }}>
          <Mail className="w-8 h-8" style={{ color: "#3B1F8C" }} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Autodeposit</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
          Receive Interac e-Transfers automatically without having to accept each one manually.
        </p>
      </div>

      <div className="px-4 space-y-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-gray-900">Enable Autodeposit</p>
              <p className="text-sm text-gray-500 mt-0.5">Automatically deposit e-Transfers</p>
            </div>
            <Toggle on={enabled} onToggle={() => setEnabled(v => !v)} />
          </div>

          {enabled && (
            <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Autodeposit email</p>
              <p className="text-sm font-semibold text-gray-800">{autoDpEmail}</p>
              <p className="text-xs text-gray-400 mt-1">e-Transfers sent to this address will deposit automatically</p>
            </div>
          )}
        </div>

        {enabled && (
          <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800">How it works</p>
              <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                When someone sends an Interac e-Transfer to <span className="font-semibold">{autoDpEmail}</span>, the money lands in your KOHO account within minutes — no action needed.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm font-bold text-gray-700 mb-1">Registered email</p>
          <p className="text-base font-semibold text-gray-900">{autoDpEmail}</p>
          <button className="mt-3 text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors">
            Change email →
          </button>
        </div>
      </div>
    </div>
  );
}
