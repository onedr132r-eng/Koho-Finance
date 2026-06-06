import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

type Toggle = { label: string; push: boolean; email: boolean };

const INITIAL: Record<string, Toggle[]> = {
  Transactions: [
    { label: "Purchases", push: true, email: false },
    { label: "Money received", push: true, email: true },
    { label: "Declined transactions", push: true, email: false },
  ],
  Transfers: [
    { label: "e-Transfer sent", push: true, email: true },
    { label: "e-Transfer received", push: true, email: true },
    { label: "Direct deposit", push: true, email: false },
  ],
  Promotions: [
    { label: "Cashback offers", push: false, email: false },
    { label: "Product updates", push: false, email: true },
    { label: "KOHO news", push: false, email: false },
  ],
  Security: [
    { label: "New sign-in", push: true, email: true },
    { label: "Password change", push: true, email: true },
    { label: "Suspicious activity", push: true, email: true },
  ],
  Account: [
    { label: "Monthly statement ready", push: true, email: true },
    { label: "Plan renewal", push: true, email: false },
    { label: "Credit score update", push: true, email: false },
  ],
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0"
      style={{ backgroundColor: on ? "#3B1F8C" : "#D1D5DB" }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

export default function NotificationSettings() {
  const [groups, setGroups] = useState(INITIAL);

  const toggleItem = (group: string, idx: number, key: "push" | "email") => {
    setGroups(prev => ({
      ...prev,
      [group]: prev[group].map((item, i) =>
        i === idx ? { ...item, [key]: !item[key] } : item
      ),
    }));
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/notifications" className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Notification Settings</h1>
      </header>

      <div className="px-4 py-3">
        <p className="text-sm text-gray-500">Choose how you receive notifications for each category.</p>
      </div>

      <div className="px-4 space-y-5">
        {Object.entries(groups).map(([groupName, items]) => (
          <div key={groupName}>
            <h2 className="text-sm font-black text-gray-900 mb-2 px-1">{groupName}</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center px-4 py-2 border-b border-gray-50">
                <span className="flex-1 text-xs font-bold text-gray-400 uppercase tracking-wide">Notification</span>
                <span className="w-14 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Push</span>
                <span className="w-14 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">Email</span>
              </div>
              {items.map((item, idx) => (
                <div key={item.label} className="flex items-center px-4 py-3.5 border-b border-gray-50 last:border-0">
                  <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                  <div className="w-14 flex justify-center">
                    <Toggle on={item.push} onToggle={() => toggleItem(groupName, idx, "push")} />
                  </div>
                  <div className="w-14 flex justify-center">
                    <Toggle on={item.email} onToggle={() => toggleItem(groupName, idx, "email")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
