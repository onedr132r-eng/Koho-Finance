import { ReactNode } from "react";
import { StatusBar } from "./status-bar";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-frame-root">
      <div className="phone-frame-shell">
        {/* Dynamic island notch — desktop only via CSS */}
        <div className="phone-frame-notch" />

        {/* Status bar — sits above content in the shell */}
        <div className="phone-frame-statusbar">
          <StatusBar variant="dark" />
        </div>

        {/* App content */}
        <div className="phone-frame-screen">
          {children}
        </div>

        {/* Home indicator */}
        <div className="phone-frame-home-indicator" />
      </div>
    </div>
  );
}
