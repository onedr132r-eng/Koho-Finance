import { Link, useLocation } from "wouter";
import { Home, LineChart, DollarSign, Wallet, Compass } from "lucide-react";
import { ReactNode, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "HOME" },
  { path: "/credit", icon: LineChart, label: "CREDIT" },
  { path: "/move-money", icon: DollarSign, label: "PAY", isCenter: true },
  { path: "/plan", icon: Wallet, label: "MY PLAN" },
  { path: "/discover", icon: Compass, label: "DISCOVER" },
];

const mainPaths = ["/", "/credit", "/move-money", "/plan", "/discover"];

function getNavIndex(path: string) {
  const idx = mainPaths.indexOf(path);
  return idx === -1 ? 0 : idx;
}

const slideVariants = {
  enterFromRight: { x: "100%", opacity: 0 },
  enterFromLeft:  { x: "-30%", opacity: 0 },
  center:         { x: 0, opacity: 1 },
  exitToLeft:     { x: "-30%", opacity: 0 },
  exitToRight:    { x: "100%", opacity: 0 },
};

const SWIPE_EDGE_THRESHOLD = 28;  // px from left edge to start swipe-back
const SWIPE_DISTANCE_MIN = 80;    // min horizontal travel to trigger back

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const prevNavIndex = useRef(getNavIndex(location));
  const currentNavIndex = getNavIndex(location);
  const isMainNav = mainPaths.includes(location);

  const isNavForward = currentNavIndex >= prevNavIndex.current;
  prevNavIndex.current = currentNavIndex;

  // ── Swipe-back gesture ──
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swipeLocked = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX <= SWIPE_EDGE_THRESHOLD) {
      swipeStart.current = { x: touch.clientX, y: touch.clientY };
      swipeLocked.current = false;
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeStart.current || swipeLocked.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - swipeStart.current.x;
    const dy = Math.abs(touch.clientY - swipeStart.current.y);
    if (dy > 20) { swipeLocked.current = true; return; } // vertical scroll wins
    if (dx > SWIPE_DISTANCE_MIN) {
      swipeLocked.current = true;
      swipeStart.current = null;
      window.history.back();
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    swipeStart.current = null;
    swipeLocked.current = false;
  }, []);

  return (
    <div
      className="flex flex-col h-full bg-[#F5F3FF] overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Page content area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location}
            className="absolute inset-0 overflow-hidden"
            initial={isMainNav && !isNavForward ? "enterFromLeft" : "enterFromRight"}
            animate="center"
            exit={isMainNav && isNavForward ? "exitToLeft" : "exitToRight"}
            variants={slideVariants}
            transition={{ duration: 0.28, ease: [0.32, 0, 0.16, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="relative z-50 bg-white border-t border-gray-100 flex justify-center flex-shrink-0">
        <div className="flex justify-between items-center w-full max-w-[375px] px-2 h-16 pb-safe-or-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex flex-col items-center justify-center -mt-6 tap-highlight-none"
                >
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg text-white mb-1"
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex flex-col items-center justify-center w-16 gap-0.5 tap-highlight-none relative"
              >
                <motion.div
                  animate={isActive ? { scale: [1, 0.92, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute -inset-x-3 -inset-y-1 rounded-full bg-primary/10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon
                      className={`w-6 h-6 relative z-10 transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-gray-400"
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                      style={isActive ? { fill: "rgba(91,63,204,0.15)" } : undefined}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
