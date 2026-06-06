import { useState } from "react";
import { ArrowLeft, X, Download, Share2, Copy, Check, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useGetAccount } from "@workspace/api-client-react";

const faqs = [
  "Why hasn't my direct deposit loaded yet?",
  "What are my account limits for direct deposit?",
  "When can I expect my direct deposit to land in my KOHO account?",
  "How do I set up direct deposit?",
  "Where can I find my routing number?",
];

export default function DirectDeposit() {
  const { data: account } = useGetAccount();
  const [copied, setCopied] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState(true);

  const accountNumber = account?.accountNumber || "218130721705";
  const transitNumber = account?.transitNumber || "16001";
  const institutionNumber = account?.institutionNumber || "621";
  const institutionName = account?.institutionName || "Peoples Trust Company";
  const userName = account?.user?.name || "Ahmed Reyene Rebaiaia";

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col pb-24">
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link href="/add-money" className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <span className="font-semibold text-gray-900">Add money</span>
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-800" />
        </Link>
      </header>

      <div className="flex-1 px-5 pt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Direct deposit</h1>
        <p className="text-gray-500 text-sm text-center px-2 mb-8">
          Use your information below to set up a direct deposit and get paid faster!*
        </p>

        <div className="flex justify-center gap-10 mb-8">
          <button className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-[#EDE9FF] flex items-center justify-center">
              <Download className="w-6 h-6 text-[#7B4FFF]" />
            </div>
            <span className="text-sm font-medium text-gray-800">Download</span>
          </button>
          <button className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-[#EDE9FF] flex items-center justify-center">
              <Share2 className="w-6 h-6 text-[#7B4FFF]" />
            </div>
            <span className="text-sm font-medium text-gray-800">Share</span>
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-bold text-gray-900">Account number</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{accountNumber}</span>
              <button onClick={() => handleCopy("account", accountNumber)} className="p-1 hover:bg-gray-100 rounded">
                {copied === "account" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="py-3">
            <p className="text-sm text-gray-500">
              Need your 9 digit payee account number to deposit money via bill pay?{" "}
              <span className="text-[#7B4FFF] font-medium cursor-pointer">Learn more</span>
            </p>
          </div>

          <div className="flex items-center justify-between py-4">
            <p className="font-bold text-gray-900">Transit number</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{transitNumber}</span>
              <button onClick={() => handleCopy("transit", transitNumber)} className="p-1 hover:bg-gray-100 rounded">
                {copied === "transit" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <p className="font-bold text-gray-900">Institution number</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{institutionNumber}</span>
              <button onClick={() => handleCopy("institution", institutionNumber)} className="p-1 hover:bg-gray-100 rounded">
                {copied === "institution" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <p className="font-bold text-gray-900">Institution name</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{institutionName}</span>
              <button onClick={() => handleCopy("iname", institutionName)} className="p-1 hover:bg-gray-100 rounded">
                {copied === "iname" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4 pb-4 border-b border-gray-100">
          Make sure the name on the deposit is {userName}, otherwise it might be rejected.
        </p>

        <p className="text-sm text-gray-400 mt-4 pb-6">
          While Direct Deposits are typically received and processed the evening before your scheduled payday, the actual timing may vary depending on when the payment is issued. Please allow up to 2 business days for complete processing.
        </p>
      </div>

      <div className="bg-white border-t border-gray-100 mx-4 mb-4 rounded-2xl shadow-sm overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4"
          onClick={() => setFaqOpen(!faqOpen)}
        >
          <span className="font-bold text-gray-900 text-base">Frequently asked questions</span>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${faqOpen ? "rotate-90" : ""}`} />
        </button>

        {faqOpen && (
          <div className="divide-y divide-gray-100">
            {faqs.map((q) => (
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
