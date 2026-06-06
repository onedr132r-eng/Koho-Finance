import { ReactNode, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

const PULL_THRESHOLD = 72;

export function PullToRefresh({ onRefresh, children, className = "", onScroll }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pullY = useMotionValue(0);
  const indicatorOpacity = useTransform(pullY, [0, PULL_THRESHOLD * 0.5, PULL_THRESHOLD], [0, 0.5, 1]);
  const indicatorScale = useTransform(pullY, [0, PULL_THRESHOLD], [0.5, 1]);
  const indicatorRotate = useTransform(pullY, [0, PULL_THRESHOLD], [0, 360]);
  const contentY = useTransform(pullY, v => Math.min(v, PULL_THRESHOLD * 0.6));

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    onScroll?.(e.currentTarget.scrollTop);
  }, [onScroll]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const el = containerRef.current;
    if (!el || el.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY.current === null || refreshing) return;
    const el = containerRef.current;
    if (!el || el.scrollTop > 0) { startY.current = null; return; }
    const delta = e.touches[0].clientY - startY.current;
    if (delta < 0) return;
    const clamped = Math.min(delta * 0.5, PULL_THRESHOLD * 1.2);
    pullY.set(clamped);
  }, [refreshing, pullY]);

  const handleTouchEnd = useCallback(async () => {
    if (startY.current === null) return;
    startY.current = null;
    if (pullY.get() >= PULL_THRESHOLD && !refreshing) {
      setRefreshing(true);
      pullY.set(PULL_THRESHOLD * 0.6);
      try { await onRefresh(); } finally {
        setRefreshing(false);
        pullY.set(0);
      }
    } else {
      pullY.set(0);
    }
  }, [pullY, refreshing, onRefresh]);

  return (
    <div className="relative overflow-hidden flex flex-col flex-1" style={{ minHeight: 0 }}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center items-center z-20 pointer-events-none"
        style={{ height: PULL_THRESHOLD, opacity: indicatorOpacity, y: useTransform(pullY, v => v - PULL_THRESHOLD) }}
      >
        <motion.div style={{ scale: indicatorScale }}>
          <motion.div style={{ rotate: refreshing ? undefined : indicatorRotate }}>
            <RotateCcw
              className={`w-6 h-6 text-primary ${refreshing ? "animate-spin" : ""}`}
              strokeWidth={2.5}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scrollable content */}
      <motion.div
        ref={containerRef}
        className={`flex-1 overflow-y-auto ${className}`}
        style={{ y: contentY }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}
