import { useState } from "react";
import { ArrowLeft, Fingerprint, Smartphone } from "lucide-react";
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

export default function Biometrics() {
  const [faceId, setFaceId] = useState(true);
  const [touchId, setTouchId] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/feature/security" className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Biometrics</h1>
      </header>

      <div className="flex flex-col items-center py-10 px-4 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "#EDE9FF" }}>
          <Fingerprint className="w-10 h-10" style={{ color: "#3B1F8C" }} />
        </div>
        <h1 className="text-xl font-black text-gray-900 mb-2">Biometric Login</h1>
        <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
          Use Face ID or Touch ID to sign in to KOHO quickly and securely without typing your password.
        </p>
      </div>

      <div className="px-4 space-y-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Face ID</p>
                <p className="text-xs text-gray-400 mt-0.5">Unlock with facial recognition</p>
              </div>
            </div>
            <Toggle on={faceId} onToggle={() => setFaceId(v => !v)} />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Touch ID</p>
                <p className="text-xs text-gray-400 mt-0.5">Unlock with fingerprint</p>
              </div>
            </div>
            <Toggle on={touchId} onToggle={() => setTouchId(v => !v)} />
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl px-4 py-3">
          <p className="text-xs font-bold text-blue-800 mb-0.5">Privacy note</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Biometric data is stored on your device and never transmitted to KOHO servers. Your device's security settings govern biometric access.
          </p>
        </div>
      </div>
    </div>
  );
}
