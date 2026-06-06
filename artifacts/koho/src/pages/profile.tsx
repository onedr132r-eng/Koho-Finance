import type { ReactNode } from "react";
import { ChevronRight, CheckCircle2, Plus } from "lucide-react";
import { Link } from "wouter";
import { useGetAccount } from "@workspace/api-client-react";

const medals = [
  { bg: "#C084FC", ribbon: "#7C3AED", dot: "#F59E0B" },
  { bg: "#4ADE80", ribbon: "#16A34A", dot: "#FACC15" },
  { bg: "#D1D5DB", ribbon: "#6B7280", dot: "#9CA3AF" },
  { bg: "#FB923C", ribbon: "#EA580C", dot: "#FCD34D" },
  { bg: "#34D399", ribbon: "#059669", dot: "#064E3B" },
];

function Medal({ bg, ribbon, dot }: { bg: string; ribbon: string; dot: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-1.5 h-4 rounded-full" style={{ background: ribbon }} />
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
        style={{ background: bg }}
      >
        <div className="w-4 h-4 rounded-full" style={{ background: dot }} />
      </div>
    </div>
  );
}

export default function Profile() {
  const { data: account } = useGetAccount();
  const name = account?.user?.name?.split(" ").slice(0, 2).join(" ") || "Ahmed Reyene";

  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col pb-10">
      <header className="flex justify-end items-center px-4 py-4">
        <button className="flex items-center gap-1 text-gray-700 font-semibold text-sm">
          <span className="text-base">&#127760;</span> FR
        </button>
      </header>

      <div className="flex flex-col items-center px-5 pb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-md"
          style={{ background: "#3B1F8C" }}
        >
          <span
            className="text-4xl font-black leading-none"
            style={{ color: "#C8F135", fontFamily: "sans-serif", letterSpacing: "-2px" }}
          >
            K
          </span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">KOHO Essential</span>
          <span className="text-gray-400">·</span>
          <span className="flex items-center gap-1 text-sm font-bold text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Active
          </span>
        </div>

        <p className="text-xs font-semibold text-gray-500 mt-4 mb-3">Achievements</p>
        <div className="flex gap-3 justify-center">
          {medals.map((m, i) => (
            <Medal key={i} {...m} />
          ))}
        </div>
      </div>

      <div className="px-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Switch account</h2>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-[#7B4FFF] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Personal</span>
            </div>
            <div className="text-right">
              <p className="text-white text-xs opacity-80">Total balance</p>
              <p className="text-white font-bold">$0.00</p>
            </div>
          </div>
          <Link
            href="/feature/joint-account"
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span className="font-medium text-gray-900">Open a Joint Account</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#EDE9FF] text-[#7B4FFF] text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </Link>
        </div>
      </div>

      <Section title="Account">
        <Row label="Autodeposit" href="/feature/autodeposit" />
        <Row label="Direct deposit" href="/direct-deposit" />
        <Row label="Payment methods" href="/payment-methods" />
        <Row label="Load methods" href="/feature/load-methods" />
        <Row label="Personal details" href="/personal-details" />
        <Row label="Display & icon" href="/feature/display-icon" />
        <Row label="Account velocity limits" href="/account-limits" />
      </Section>

      <Section title="Subscriptions">
        <Row label="Manage my plan" href="/plan" />
        <Row label="Credit Building" href="/credit-building" />
        <Row label="Credit Building utilization" href="/feature/credit-utilization" />
        <Row label="Cover" href="/cover" />
      </Section>

      <Section title="Documents">
        <Row label="Monthly statements" href="/monthly-statements" />
        <Row label="Tax receipts" href="/feature/tax-receipts" />
        <Row label="Legal documents" href="/feature/legal-docs" />
        <Row label="Void cheque" href="/void-cheque" />
      </Section>

      <Section title="Security">
        <Row label="Login & password" href="/feature/security" badge="New" />
      </Section>

      <Section title="Support">
        <Row label="Disputed transactions" href="/feature/disputed-transactions" />
        <Row label="Support" href="/feature/support" />
        <Row label="Status" href="/feature/status" />
        <Row label="Feature requests" href="/feature/feature-requests" />
      </Section>

      <div className="px-4 mt-6 mb-4">
        <button className="w-full py-4 rounded-full bg-[#FEE8E4] text-[#E8604C] font-bold text-base hover:bg-[#fdddd7] transition-colors">
          Logout
        </button>
      </div>

      <div className="flex flex-col items-center pb-4 gap-0.5">
        <p className="text-xs text-gray-400">Version 4.11.0.792460</p>
        <p className="text-xs text-gray-400 text-center">
          KOHO{"\n"}601 West Broadway, Suite 400{"\n"}Vancouver BC{"\n"}V5Z 4C2
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-4 mb-5">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
}

function Row({ label, href, badge }: { label: string; href: string; badge?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-4 hover:bg-gray-50"
    >
      <span className="font-medium text-gray-900">{label}</span>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-[#EDE9FF] text-[#7B4FFF] text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </Link>
  );
}
