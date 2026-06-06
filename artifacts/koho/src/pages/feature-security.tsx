import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Shield, Lock, LogOut } from "lucide-react";
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

export default function Security() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwDone, setPwDone] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleChangePassword = () => {
    if (!oldPw) { setPwError("Enter your current password."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords don't match."); return; }
    setPwError("");
    setPwDone(true);
  };

  const SESSIONS = [
    { device: "iPhone 15 Pro", location: "Quebec, Canada", time: "Active now", current: true },
    { device: "Chrome on MacBook", location: "Quebec, Canada", time: "2 days ago", current: false },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Login & Security</h1>
        <span className="ml-2 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
      </header>

      <div className="px-4 pt-6 space-y-5">
        {/* Password */}
        <div>
          <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Password</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {!showChangePassword ? (
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Password</p>
                    <p className="text-xs text-gray-400 mt-0.5">Last changed 3 months ago</p>
                  </div>
                </div>
                <button onClick={() => setShowChangePassword(true)} className="text-sm font-bold text-purple-700 hover:text-purple-900">
                  Change
                </button>
              </div>
            ) : pwDone ? (
              <div className="px-5 py-5 flex flex-col items-center text-center">
                <span className="text-3xl mb-2">✅</span>
                <p className="font-bold text-gray-900">Password updated</p>
                <p className="text-xs text-gray-500 mt-1">Your new password is active.</p>
                <button onClick={() => { setShowChangePassword(false); setPwDone(false); setOldPw(""); setNewPw(""); setConfirmPw(""); }} className="mt-3 text-sm font-bold text-purple-700">
                  Done
                </button>
              </div>
            ) : (
              <div className="px-5 py-4 space-y-3">
                <p className="font-semibold text-gray-900 text-sm">Change password</p>
                {pwError && <p className="text-xs text-red-500 font-semibold">{pwError}</p>}
                <div className="relative">
                  <input type={showOld ? "text" : "password"} value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="Current password" className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  <button onClick={() => setShowOld(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password (8+ characters)" className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  <button onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm new password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                <div className="flex gap-2 pt-1">
                  <button onClick={() => { setShowChangePassword(false); setPwError(""); }} className="flex-1 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 text-sm">Cancel</button>
                  <button onClick={handleChangePassword} className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: "#3B1F8C" }}>Save</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security options */}
        <div>
          <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Security Options</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900">Two-factor authentication</p>
                  <p className="text-xs text-gray-400 mt-0.5">SMS code on sign-in</p>
                </div>
              </div>
              <Toggle on={twoFactor} onToggle={() => setTwoFactor(v => !v)} />
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900">Login alerts</p>
                  <p className="text-xs text-gray-400 mt-0.5">Notify me of new sign-ins</p>
                </div>
              </div>
              <Toggle on={loginAlerts} onToggle={() => setLoginAlerts(v => !v)} />
            </div>
            <Link href="/feature/biometrics" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-gray-500" />
                <p className="font-semibold text-gray-900">Biometrics</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

        {/* Active sessions */}
        <div>
          <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Active Sessions</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {SESSIONS.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{s.device}</p>
                    {s.current && <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">Current</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{s.location} · {s.time}</p>
                </div>
                {!s.current && (
                  <button className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
