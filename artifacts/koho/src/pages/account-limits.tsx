import { ArrowLeft, ChevronRight, User, Gem } from "lucide-react";
import { Link } from "wouter";

const limits = [
  {
    icon: <User className="w-5 h-5 text-gray-700" />,
    label: "Unverified limits",
    href: "/feature/limits-unverified",
  },
  {
    icon: <User className="w-5 h-5 text-gray-700" />,
    label: "Regular limits",
    href: "/feature/limits-regular",
  },
  {
    icon: <Gem className="w-5 h-5 text-gray-700" />,
    label: "Paid plan limits",
    href: "/feature/limits-paid",
  },
];

export default function AccountLimits() {
  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
      </header>

      <div className="px-5 pt-4 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account limits</h1>
        <p className="text-gray-500 text-sm mb-6">
          Each account type carries a different velocity limit.
        </p>
      </div>

      <div className="divide-y divide-gray-100 px-5">
        {limits.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between py-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#7B4FFF] font-semibold text-sm">View</span>
              <ChevronRight className="w-4 h-4 text-[#7B4FFF]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
