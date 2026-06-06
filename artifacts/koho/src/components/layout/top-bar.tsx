import { Bell, Gift, User, ChevronDown } from "lucide-react";
import { Link } from "wouter";

interface TopBarProps {
  showBalanceDropdown?: boolean;
  balance?: string;
  notificationCount?: number;
}

export function TopBar({ showBalanceDropdown = false, balance, notificationCount = 10 }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-transparent absolute top-0 left-0 right-0 z-30">
      <Link href="/profile" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
        <User className="w-5 h-5" />
      </Link>
      
      {showBalanceDropdown ? (
        <Link href="/my-balances" className="flex items-center gap-1 font-semibold text-gray-800 hover:opacity-70 transition-opacity">
          <span>{balance || "$0.00"}</span>
          <ChevronDown className="w-4 h-4" />
        </Link>
      ) : (
        <Link href="/my-balances" className="flex items-center gap-1 font-semibold text-gray-800 hover:opacity-70 transition-opacity">
          <span>Balance</span>
          <ChevronDown className="w-4 h-4" />
        </Link>
      )}

      <div className="flex items-center gap-3 text-gray-600">
        <Link href="/feature/referrals" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Gift className="w-5 h-5" />
        </Link>
        <Link href="/notifications" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center relative hover:bg-gray-200 transition-colors">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}