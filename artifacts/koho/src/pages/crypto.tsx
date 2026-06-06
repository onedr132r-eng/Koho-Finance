import { PageHeader } from "@/components/layout/page-header";
import { useGetCrypto } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Bitcoin, TrendingDown, ChevronRight } from "lucide-react";

export default function CryptoPage() {
  const { data: crypto, isLoading } = useGetCrypto();

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  if (isLoading) return <div className="h-full bg-gray-50"><Skeleton className="w-full h-full" /></div>;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Crypto" />

      <div className="p-4 space-y-6">
        <div className="text-center pt-4 pb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Total Balance</h2>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">{fmt(crypto?.balance)}</h1>
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-red-500">
             <TrendingDown className="w-4 h-4" />
             {crypto?.allTimeChange}% all-time
          </div>
        </div>

        <div className="flex gap-2">
           <button className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">
             Buy
           </button>
           <button className="flex-1 py-3 bg-white text-gray-900 font-bold border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
             Sell
           </button>
        </div>

        <div>
           <h3 className="font-bold text-gray-900 mb-3 px-1">Your Holdings</h3>
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {crypto?.holdings.map(h => (
                 <div key={h.symbol} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                          <Bitcoin className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-900">{h.asset}</h4>
                          <p className="text-xs text-gray-500">{h.amount} {h.symbol}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="text-right">
                          <p className="font-bold text-gray-900">{fmt(h.value)}</p>
                          <p className={`text-xs font-medium ${h.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                             {h.change24h >= 0 ? '+' : ''}{h.change24h}%
                          </p>
                       </div>
                       <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-3xl p-6 text-white shadow-md">
           <h3 className="font-bold text-xl mb-2">Learn about Crypto</h3>
           <p className="text-white/90 text-sm mb-4">Discover the basics of cryptocurrency and how to invest smartly.</p>
           <button className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
             Start learning
           </button>
        </div>
      </div>
    </div>
  );
}