import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "wouter";

const AVATARS = [
  { id: "koho-k", label: "KOHO Classic", bg: "#3B1F8C", text: "#C8F135", char: "K" },
  { id: "star", label: "Star", bg: "#F59E0B", text: "#fff", char: "★" },
  { id: "leaf", label: "Leaf", bg: "#10B981", text: "#fff", char: "🌿" },
  { id: "flame", label: "Flame", bg: "#EF4444", text: "#fff", char: "🔥" },
  { id: "crown", label: "Crown", bg: "#7C3AED", text: "#FFD700", char: "👑" },
  { id: "wave", label: "Wave", bg: "#0EA5E9", text: "#fff", char: "🌊" },
];

const DARK_OPTIONS = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

export default function DisplayIcon() {
  const [selected, setSelected] = useState("koho-k");
  const [appearance, setAppearance] = useState("light");

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Display & Icon</h1>
      </header>

      {/* Preview */}
      <div className="flex flex-col items-center py-8">
        {(() => {
          const avatar = AVATARS.find(a => a.id === selected)!;
          return (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-2"
              style={{ background: avatar.bg }}
            >
              <span className="text-3xl font-black" style={{ color: avatar.text }}>{avatar.char}</span>
            </div>
          );
        })()}
        <p className="text-sm text-gray-500 mt-1">Ahmed Reyene</p>
      </div>

      {/* Icon selector */}
      <div className="px-4 mb-6">
        <h2 className="text-sm font-black text-gray-700 mb-3 px-1">Choose icon</h2>
        <div className="grid grid-cols-3 gap-3">
          {AVATARS.map(avatar => (
            <button
              key={avatar.id}
              onClick={() => setSelected(avatar.id)}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 transition-all"
              style={{ borderColor: selected === avatar.id ? "#3B1F8C" : "transparent" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                style={{ background: avatar.bg }}
              >
                <span className="text-2xl font-black" style={{ color: avatar.text }}>{avatar.char}</span>
              </div>
              <div className="flex items-center gap-1">
                {selected === avatar.id && <Check className="w-3 h-3 text-purple-700" />}
                <span className="text-xs font-bold text-gray-700">{avatar.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="px-4">
        <h2 className="text-sm font-black text-gray-700 mb-3 px-1">App Appearance</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {DARK_OPTIONS.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => setAppearance(opt.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-0"
            >
              <span className="font-medium text-gray-900">{opt.label}</span>
              {appearance === opt.id && <Check className="w-5 h-5 text-purple-700" />}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 px-1">Dark mode is a preview feature — full support coming soon.</p>
      </div>

      <div className="px-4 mt-6">
        <button
          className="w-full py-4 rounded-full font-bold text-base text-white transition-all active:scale-95"
          style={{ background: "#3B1F8C" }}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
