import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#EDE9FF" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <div
              className="w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: "#5B3FCC" }}
            >
              <span
                className="font-black italic select-none"
                style={{
                  fontSize: "3rem",
                  lineHeight: 1,
                  color: "#EDE9FF",
                  letterSpacing: "-0.05em",
                }}
              >
                K
              </span>
            </div>
            <span
              className="font-black italic tracking-tight"
              style={{ fontSize: "2rem", color: "#2A1A7A" }}
            >
              koho
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
