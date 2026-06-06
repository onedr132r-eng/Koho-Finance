import { useState } from "react";
import { ArrowLeft, Copy, Check, Download, Share2 } from "lucide-react";
import { Link } from "wouter";
import { useGetAccount } from "@workspace/api-client-react";

export default function VoidCheque() {
  const { data: account } = useGetAccount();
  const [copied, setCopied] = useState<string | null>(null);

  const accountNumber = account?.accountNumber || "218130721705";
  const transitNumber = account?.transitNumber || "16001";
  const institutionNumber = account?.institutionNumber || "621";
  const userName = account?.user?.name || "Ahmed Reyene Rebaiaia";

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
      </header>

      <div className="px-5 pt-4 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Void cheque</h1>
        <p className="text-sm text-gray-500 mb-6">
          Use this to set up direct deposit or pre-authorized payments.
        </p>

        <div
          className="rounded-2xl overflow-hidden mb-6 shadow-md"
          style={{ background: "#F5F3FF", border: "1.5px solid #E0D9FF" }}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#3B1F8C" }}
              >
                <span
                  className="text-xl font-black leading-none"
                  style={{ color: "#C8F135", fontFamily: "sans-serif" }}
                >
                  K
                </span>
              </div>
              <span className="font-bold text-gray-800 text-sm">KOHO</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">#001</span>
          </div>

          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-0.5">Pay to the order of</p>
            <div className="border-b border-gray-400 pb-1 mb-3">
              <p className="font-semibold text-gray-800">{userName}</p>
            </div>

            <div className="flex gap-4 mb-3">
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
                <div className="border-b border-gray-400 pb-1">
                  <p className="text-gray-500 text-sm">VOID</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Amount</p>
                <div className="border-b border-gray-400 pb-1">
                  <p className="text-gray-500 text-sm">VOID</p>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-0.5">Memo</p>
              <div className="border-b border-gray-400 pb-1">
                <p className="text-gray-400 text-xs italic">VOID</p>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <div className="border-b border-gray-400 w-36 pb-1 text-right">
                <p className="text-gray-400 text-xs">Signature — VOID</p>
              </div>
            </div>

            <div
              className="rounded-lg px-3 py-2 mb-3"
              style={{ background: "#3B1F8C" }}
            >
              <p
                className="font-mono text-xs tracking-widest text-center"
                style={{ color: "#C8F135" }}
              >
                ⑆{transitNumber}⑆ {institutionNumber}⑆ {accountNumber}⑆
              </p>
            </div>

            <div className="flex justify-between text-[10px] text-gray-400 mb-3 px-1">
              <span>Transit: {transitNumber}</span>
              <span>Institution: {institutionNumber}</span>
              <span>Account: {accountNumber}</span>
            </div>
          </div>

          <div
            className="px-4 py-2 text-center"
            style={{ background: "#EDE9FF" }}
          >
            <p className="text-[10px] text-[#7B4FFF] font-semibold uppercase tracking-widest">
              VOID — NOT NEGOTIABLE
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleCopy("all", `Transit: ${transitNumber} | Institution: ${institutionNumber} | Account: ${accountNumber}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-gray-200 font-semibold text-sm text-gray-800 hover:bg-gray-50 transition-colors"
          >
            {copied === "all" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            Copy details
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#7B4FFF] text-white font-semibold text-sm hover:bg-[#5B3FCC] transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
          {[
            { label: "Account number", value: accountNumber, field: "account" },
            { label: "Transit number", value: transitNumber, field: "transit" },
            { label: "Institution number", value: institutionNumber, field: "institution" },
            { label: "Institution name", value: "Peoples Trust Company", field: "iname" },
          ].map((row) => (
            <div key={row.field} className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="font-bold text-gray-900 text-sm">{row.label}</p>
                <p className="text-gray-500 text-sm">{row.value}</p>
              </div>
              <button
                onClick={() => handleCopy(row.field, row.value)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {copied === row.field
                  ? <Check className="w-4 h-4 text-green-500" />
                  : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4 px-2">
          Peoples Trust Company · Suite 400-601 West Broadway, Vancouver, BC V5Z 4C2
        </p>
      </div>
    </div>
  );
}
