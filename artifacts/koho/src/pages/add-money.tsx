import { ArrowLeft, CreditCard, Banknote, Send, Briefcase, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function AddMoney() {
  const methods = [
    {
      href: "/feature/interac-etransfer",
      icon: Send,
      bg: "bg-yellow-50",
      color: "text-yellow-600",
      title: "INTERAC e-Transfer",
      sub: "Up to $10,000 · 5 min",
    },
    {
      href: "/feature/debit-card",
      icon: CreditCard,
      bg: "bg-blue-50",
      color: "text-blue-500",
      title: "Debit card",
      sub: "Up to $3,000 · Instant",
    },
    {
      href: "/direct-deposit",
      icon: Briefcase,
      bg: "bg-purple-50",
      color: "text-primary",
      title: "Direct deposit",
      sub: "Set up payroll",
    },
    {
      href: "/feature/cash-deposit",
      icon: Banknote,
      bg: "bg-green-50",
      color: "text-green-600",
      title: "Cash deposit",
      sub: "Find a location near you",
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 mr-2 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Add Money</h1>
      </header>

      <div className="p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {methods.map(({ href, icon: Icon, bg, color, title, sub }) => (
            <Link
              key={title}
              href={href}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-[15px]">{title}</h4>
                  <p className="text-[13px] text-gray-500">{sub}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
