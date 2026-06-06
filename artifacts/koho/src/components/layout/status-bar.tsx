import { useEffect, useState } from "react";
import { Signal, Wifi, BatteryMedium } from "lucide-react";

interface StatusBarProps {
  variant?: "light" | "dark";
}

export function StatusBar({ variant = "dark" }: StatusBarProps) {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const color = variant === "dark" ? "#2A1A7A" : "rgba(255,255,255,0.9)";

  return (
    <div
      className="flex items-center justify-between px-6 select-none pointer-events-none"
      style={{ height: 44, color }}
    >
      <span className="text-[15px] font-semibold tabular-nums tracking-tight">
        {time}
      </span>
      <div className="flex items-center gap-1">
        <Signal className="w-[15px] h-[15px]" strokeWidth={2} />
        <Wifi className="w-[14px] h-[14px]" strokeWidth={2} />
        <BatteryMedium className="w-[18px] h-[18px]" strokeWidth={2} />
      </div>
    </div>
  );
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
