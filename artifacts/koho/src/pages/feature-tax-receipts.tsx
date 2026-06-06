import { ArrowLeft, Download, FileText } from "lucide-react";
import { Link } from "wouter";

const TAX_SLIPS = [
  {
    year: 2025,
    slips: [
      { id: "t5-2025", type: "T5", label: "Statement of Investment Income", status: "Available" },
      { id: "t4a-2025", type: "T4A", label: "Statement of Other Income", status: "Available" },
    ],
  },
  {
    year: 2024,
    slips: [
      { id: "t5-2024", type: "T5", label: "Statement of Investment Income", status: "Available" },
    ],
  },
  {
    year: 2023,
    slips: [
      { id: "t5-2023", type: "T5", label: "Statement of Investment Income", status: "Available" },
    ],
  },
];

export default function TaxReceipts() {
  const handleDownload = (slip: { id: string; type: string }) => {
    const filename = `KOHO_${slip.id.toUpperCase()}.pdf`;
    const link = document.createElement("a");
    link.href = "data:application/pdf;base64,JVBERi0=";
    link.download = filename;
    link.click();
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Tax Receipts</h1>
      </header>

      <div className="px-4 pt-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 mb-5">
          <p className="text-xs font-bold text-yellow-800 mb-0.5">Tax season reminder</p>
          <p className="text-xs text-yellow-700">Tax slips are issued by February 28 each year for the prior tax year.</p>
        </div>

        <div className="space-y-5">
          {TAX_SLIPS.map(group => (
            <div key={group.year}>
              <h2 className="text-sm font-black text-gray-700 mb-2 px-1">Tax year {group.year}</h2>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {group.slips.map(slip => (
                  <div key={slip.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-purple-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{slip.type}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{slip.label}</p>
                      <p className="text-[10px] text-green-600 font-semibold mt-0.5">● {slip.status}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(slip)}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
                      style={{ color: "#3B1F8C" }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 px-1">
          <p className="text-xs text-gray-400 leading-relaxed">
            Tax slips are issued by KOHO Financial Inc. and Peoples Trust Company as applicable. Contact support@koho.ca with questions about your tax documents.
          </p>
        </div>
      </div>
    </div>
  );
}
