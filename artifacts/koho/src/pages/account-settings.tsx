import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Link } from "wouter";
import { ChevronRight, User, Bell, Shield, Globe, Sun, Eye, EyeOff } from "lucide-react";

type Tab = "profile" | "notifications" | "security" | "appearance";

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label?: string }) {
  return (
    <button
      onClick={onToggle}
      aria-label={label}
      className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none flex-shrink-0"
      style={{ backgroundColor: on ? "#3B1F8C" : "#D1D5DB" }}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform"
        style={{ transform: on ? "translateX(30px)" : "translateX(2px)" }}
      />
    </button>
  );
}

type NotifRow = { label: string; push: boolean; email: boolean };
type NotifGroup = { group: string; items: NotifRow[] };

const INITIAL_NOTIFS: NotifGroup[] = [
  {
    group: "Transactions",
    items: [
      { label: "Purchases", push: true, email: false },
      { label: "Money received", push: true, email: true },
      { label: "Declined", push: true, email: false },
    ],
  },
  {
    group: "Transfers",
    items: [
      { label: "e-Transfer sent", push: true, email: true },
      { label: "e-Transfer received", push: true, email: true },
      { label: "Direct deposit", push: true, email: false },
    ],
  },
  {
    group: "Promotions",
    items: [
      { label: "Cashback offers", push: false, email: false },
      { label: "Product updates", push: false, email: true },
    ],
  },
  {
    group: "Security",
    items: [
      { label: "New sign-in", push: true, email: true },
      { label: "Suspicious activity", push: true, email: true },
    ],
  },
];

export default function AccountSettings() {
  const [tab, setTab] = useState<Tab>("profile");

  // Profile state
  const [name, setName] = useState("Ahmed Reyene Rebaiaia");
  const [email, setEmail] = useState("rayanre@hotmail.fr");
  const [phone, setPhone] = useState("(418) 932-9480");

  // Notifications state
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const toggleNotif = (gi: number, ii: number, key: "push" | "email") => {
    setNotifs(prev =>
      prev.map((g, gi2) =>
        gi2 !== gi ? g : {
          ...g,
          items: g.items.map((item, ii2) =>
            ii2 !== ii ? item : { ...item, [key]: !item[key] }
          ),
        }
      )
    );
  };

  // Security state
  const [faceId, setFaceId] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [showChangePw, setShowChangePw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwDone, setPwDone] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleChangePw = () => {
    if (!oldPw) { setPwError("Enter your current password."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords don't match."); return; }
    setPwError("");
    setPwDone(true);
  };

  // Appearance state
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"EN" | "FR">("EN");

  const TABS: { id: Tab; label: string; Icon: typeof User }[] = [
    { id: "profile", label: "Profile", Icon: User },
    { id: "notifications", label: "Notifs", Icon: Bell },
    { id: "security", label: "Security", Icon: Shield },
    { id: "appearance", label: "Display", Icon: Sun },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Account Settings" showLanguage />

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 px-4 pt-2 pb-0 flex gap-1 sticky top-[57px] z-10">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition-colors border-b-2"
            style={{
              color: tab === id ? "#3B1F8C" : "#9CA3AF",
              borderBottomColor: tab === id ? "#3B1F8C" : "transparent",
            }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === "profile" && (
        <div className="px-4 pt-5 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {[
              { label: "Full name", value: name, setter: setName },
              { label: "Email", value: email, setter: setEmail },
              { label: "Phone", value: phone, setter: setPhone },
            ].map(({ label, value, setter }) => (
              <div key={label} className="px-5 py-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                <input
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="w-full text-sm font-semibold text-gray-900 bg-transparent focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            <p className="px-5 pt-4 pb-0 text-xs font-bold text-gray-400 uppercase tracking-wide">Account links</p>
            <Link href="/personal-details" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <span className="font-medium text-gray-900">Personal details</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/feature/load-methods" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <span className="font-medium text-gray-900">Load methods</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/feature/autodeposit" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <span className="font-medium text-gray-900">Autodeposit</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/direct-deposit" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <span className="font-medium text-gray-900">Direct deposit</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            <p className="px-5 pt-4 pb-0 text-xs font-bold text-gray-400 uppercase tracking-wide">Documents</p>
            <Link href="/monthly-statements" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <span className="font-medium text-gray-900">Monthly statements</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/feature/tax-receipts" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <span className="font-medium text-gray-900">Tax receipts</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/feature/legal-docs" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <span className="font-medium text-gray-900">Legal documents</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/void-cheque" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <span className="font-medium text-gray-900">Void cheque</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>

          <button
            className="w-full py-4 rounded-full font-bold text-base transition-all active:scale-95"
            style={{ background: "#3B1F8C", color: "#fff" }}
            onClick={() => {/* save */}}
          >
            Save changes
          </button>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {tab === "notifications" && (
        <div className="px-4 pt-5 space-y-4">
          <p className="text-sm text-gray-500 px-1">Choose how you want to be notified.</p>
          {notifs.map((group, gi) => (
            <div key={group.group}>
              <h2 className="text-sm font-black text-gray-700 mb-2 px-1">{group.group}</h2>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center px-4 py-2 border-b border-gray-50">
                  <span className="flex-1 text-xs font-bold text-gray-400 uppercase tracking-wide">Notification</span>
                  <span className="w-14 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Push</span>
                  <span className="w-14 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Email</span>
                </div>
                {group.items.map((item, ii) => (
                  <div key={item.label} className="flex items-center px-4 py-3.5 border-b border-gray-50 last:border-0">
                    <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                    <div className="w-14 flex justify-center">
                      <Toggle on={item.push} onToggle={() => toggleNotif(gi, ii, "push")} />
                    </div>
                    <div className="w-14 flex justify-center">
                      <Toggle on={item.email} onToggle={() => toggleNotif(gi, ii, "email")} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {tab === "security" && (
        <div className="px-4 pt-5 space-y-4">
          {/* Face ID */}
          <div>
            <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Biometrics</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-gray-900">Face ID / Touch ID</p>
                  <p className="text-xs text-gray-400 mt-0.5">Sign in with biometrics</p>
                </div>
                <Toggle on={faceId} onToggle={() => setFaceId(v => !v)} />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-gray-900">Two-factor authentication</p>
                  <p className="text-xs text-gray-400 mt-0.5">SMS code on sign-in</p>
                </div>
                <Toggle on={twoFactor} onToggle={() => setTwoFactor(v => !v)} />
              </div>
            </div>
          </div>

          {/* Change password */}
          <div>
            <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Password</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {!showChangePw ? (
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">Change password</p>
                    <p className="text-xs text-gray-400 mt-0.5">Last changed 3 months ago</p>
                  </div>
                  <button onClick={() => setShowChangePw(true)} className="text-sm font-bold text-purple-700">
                    Change
                  </button>
                </div>
              ) : pwDone ? (
                <div className="px-5 py-5 flex flex-col items-center text-center">
                  <span className="text-3xl mb-2">✅</span>
                  <p className="font-bold text-gray-900">Password updated</p>
                  <button
                    onClick={() => { setShowChangePw(false); setPwDone(false); setOldPw(""); setNewPw(""); setConfirmPw(""); }}
                    className="mt-3 text-sm font-bold text-purple-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="px-5 py-4 space-y-3">
                  {pwError && <p className="text-xs text-red-500 font-semibold">{pwError}</p>}
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPw}
                      onChange={e => setOldPw(e.target.value)}
                      placeholder="Current password"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button onClick={() => setShowOld(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      placeholder="New password (8+ chars)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => { setShowChangePw(false); setPwError(""); }} className="flex-1 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 text-sm">
                      Cancel
                    </button>
                    <button onClick={handleChangePw} className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: "#3B1F8C" }}>
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active sessions */}
          <div>
            <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Active Sessions</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {[
                { device: "iPhone 15 Pro", location: "Quebec, Canada", time: "Active now", current: true },
                { device: "Chrome on MacBook", location: "Quebec, Canada", time: "2 days ago", current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{s.device}</p>
                      {s.current && <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full">Current</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{s.location} · {s.time}</p>
                  </div>
                  {!s.current && <button className="text-xs font-bold text-red-500">Sign out</button>}
                </div>
              ))}
            </div>
          </div>

          <Link href="/feature/security" className="flex items-center justify-between px-5 py-4 bg-white rounded-3xl shadow-sm border border-gray-100 hover:bg-gray-50">
            <span className="font-medium text-gray-900">More security options</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      )}

      {/* ── APPEARANCE TAB ── */}
      {tab === "appearance" && (
        <div className="px-4 pt-5 space-y-4">
          {/* Language */}
          <div>
            <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Language</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {(["EN", "FR"] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{lang === "EN" ? "English" : "Français"}</span>
                  </div>
                  {language === lang && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#3B1F8C" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dark mode */}
          <div>
            <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Appearance</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-gray-900">Dark mode</p>
                  <p className="text-xs text-gray-400 mt-0.5">Preview feature — full support coming soon</p>
                </div>
                <Toggle on={darkMode} onToggle={() => setDarkMode(v => !v)} />
              </div>
            </div>
          </div>

          {/* Icon */}
          <Link href="/feature/display-icon" className="flex items-center justify-between px-5 py-4 bg-white rounded-3xl shadow-sm border border-gray-100 hover:bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">Display & icon</p>
              <p className="text-xs text-gray-400 mt-0.5">Choose your app icon</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      )}
    </div>
  );
}
