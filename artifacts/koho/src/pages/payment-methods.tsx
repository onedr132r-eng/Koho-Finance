import { useState } from "react";
import { ArrowLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";

const faqItems = [
  "What is a payment method?",
  "How do I change my primary payment method?",
  "Why was my payment method declined?",
  "Can I add multiple backup payment methods?",
];

export default function PaymentMethods() {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
      </header>

      <div className="px-5 pt-4 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment methods</h1>
        <p className="text-gray-500 text-sm mb-2">
          Manage how your subscription fee is collected for KOHO supported products and services.
        </p>
        <button className="text-[#7B4FFF] font-medium text-sm">See supported products</button>
      </div>

      <div className="border-t border-gray-100 px-5 py-5">
        <p className="font-bold text-gray-900 mb-1">Primary</p>
        <p className="text-sm text-gray-500 mb-4">We'll always try and collect your fee from this method first.</p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 rounded-md overflow-hidden flex-shrink-0">
            <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #E8604C 0%, #1B4FD8 100%)" }} />
          </div>
          <span className="font-semibold text-gray-900">KOHO Spendable</span>
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-5">
        <p className="font-bold text-gray-900 mb-1">Backup</p>
        <p className="text-sm text-gray-500 mb-1">
          Never worry about losing access to your benefits from a failed payment.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          If your primary payment method is running low, we'll collect the fee from your backup instead. We will not collect any charges except for the subscription fee.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-700 font-bold text-sm tracking-widest">VISA</span>
            <span className="text-gray-900 font-medium">··· 4015</span>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4"
          onClick={() => setFaqOpen(!faqOpen)}
        >
          <span className="font-bold text-gray-900 text-base">Frequently asked questions</span>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${faqOpen ? "rotate-90" : ""}`} />
        </button>

        {faqOpen && (
          <div className="divide-y divide-gray-100">
            {faqItems.map((q) => (
              <button key={q} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left">
                <span className="text-gray-900 text-sm font-medium pr-4">{q}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
