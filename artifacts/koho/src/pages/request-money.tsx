import { PageHeader } from "@/components/layout/page-header";
import { Copy, Share, CheckCircle, Delete } from "lucide-react";
import { useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useGetAccount } from "@workspace/api-client-react";

export default function RequestMoney() {
  const { data: account } = useGetAccount();
  const [amount, setAmount] = useState("0");
  const [copied, setCopied] = useState(false);

  const accountNumber = account?.accountNumber ?? "218130721705";
  const username = account?.name ? account.name.split(" ")[0].toLowerCase() : "ahmedreyene";
  const requestAmt = parseFloat(amount) > 0 ? parseFloat(amount) : null;

  const requestUrl = requestAmt
    ? `https://koho.ca/pay/${username}?amount=${requestAmt.toFixed(2)}`
    : `https://koho.ca/pay/${username}`;

  const qrValue = requestAmt
    ? `koho://pay?to=${accountNumber}&amount=${requestAmt.toFixed(2)}`
    : `koho://pay?to=${accountNumber}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(requestUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [requestUrl]);

  const handleNumber = (n: string) => {
    if (n === "." && amount.includes(".")) return;
    setAmount(prev => prev === "0" && n !== "." ? n : prev + n);
  };
  const handleBack = () =>
    setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Request money" />

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center">
          <h2 className="font-bold text-gray-900 mb-1 text-lg">My QR Code</h2>
          <p className="text-xs text-gray-400 font-medium mb-5">@{username}</p>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-5">
            <QRCodeSVG
              value={qrValue}
              size={176}
              bgColor="#ffffff"
              fgColor="#1a1a2e"
              level="M"
              includeMargin={false}
            />
          </div>

          {requestAmt && (
            <div className="bg-primary/5 rounded-xl px-4 py-2 mb-4">
              <p className="text-primary font-bold text-sm">Requesting ${requestAmt.toFixed(2)}</p>
            </div>
          )}

          <div className="flex gap-2 w-full">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              {copied ? (
                <><CheckCircle className="w-4 h-4 text-green-600" /><span className="text-green-600">Copied!</span></>
              ) : (
                <><Copy className="w-4 h-4" /> Copy link</>
              )}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "Pay me on KOHO", url: requestUrl }).catch(() => {});
                } else {
                  handleCopy();
                }
              }}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Share className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Set a specific amount</p>
          <div className="text-center mb-4">
            <div className="text-[3rem] font-bold text-gray-900 leading-none tracking-tighter">
              ${amount}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 mb-4 max-w-xs mx-auto w-full">
            {["1","2","3","4","5","6","7","8","9",".","0"].map(n => (
              <button
                key={n}
                onClick={() => handleNumber(n)}
                className="h-12 text-xl font-semibold text-gray-900 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                {n}
              </button>
            ))}
            <button onClick={handleBack} className="h-12 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center text-gray-600">
              <Delete className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleCopy}
            disabled={parseFloat(amount) === 0}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {copied ? "Link copied!" : "Create request link"}
          </button>
        </div>
      </div>
    </div>
  );
}
