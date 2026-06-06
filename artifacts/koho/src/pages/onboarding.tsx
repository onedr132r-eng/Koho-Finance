import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

const SLIDES = [
  {
    emoji: "💰",
    bg: "#3B1F8C",
    accent: "#C8F135",
    title: "Banking that earns",
    body: "Earn cashback on every purchase — groceries, gas, restaurants, and more. Your spending works for you.",
  },
  {
    emoji: "📈",
    bg: "#1A3A6B",
    accent: "#60C9FA",
    title: "Build your credit",
    body: "KOHO's Credit Building subscription reports your payments to Equifax, helping you build a healthy credit history.",
  },
  {
    emoji: "🛡️",
    bg: "#0D5C40",
    accent: "#4ADE80",
    title: "Cover's got your back",
    body: "When your balance dips, Cover keeps you from overdrafting — no fees, no stress. You're always protected.",
  },
];

interface OnboardingProps {
  onLogin?: () => void;
}

export default function Onboarding({ onLogin }: OnboardingProps) {
  const [, navigate] = useLocation();
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];

  const finish = () => {
    onLogin?.();
    navigate("/");
  };

  const advance = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(s => s + 1);
    } else {
      finish();
    }
  };

  return (
    <div
      className="h-full flex flex-col transition-colors duration-500"
      style={{ backgroundColor: current.bg }}
    >
      <div className="flex items-center justify-between px-6 pt-12 pb-2">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 28 : 8,
                backgroundColor: i <= slide ? current.accent : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
        <button
          onClick={finish}
          className="text-sm font-bold px-3 py-1.5 rounded-full"
          style={{ color: "rgba(255,255,255,0.7)", backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        >
          <span className="text-6xl select-none">{current.emoji}</span>
        </div>

        <h1
          className="text-3xl font-black mb-4 leading-tight"
          style={{ color: current.accent }}
        >
          {current.title}
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          {current.body}
        </p>
      </div>

      <div className="px-6 pb-14">
        {slide < SLIDES.length - 1 ? (
          <button
            onClick={advance}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base transition-all active:scale-95"
            style={{ backgroundColor: current.accent, color: current.bg }}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={advance}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base transition-all active:scale-95"
            style={{ backgroundColor: current.accent, color: current.bg }}
          >
            Get Started
          </button>
        )}

        {slide < SLIDES.length - 1 && (
          <button
            onClick={finish}
            className="w-full mt-3 py-3 text-sm font-semibold text-center"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Skip to app
          </button>
        )}
      </div>
    </div>
  );
}
