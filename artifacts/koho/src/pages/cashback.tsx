import { PageHeader } from "@/components/layout/page-header";
import { useGetCashback } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, ChevronRight } from "lucide-react";

export default function CashbackPage() {
  const { data: cashback, isLoading } = useGetCashback();

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  if (isLoading) return <div className="h-full bg-gray-50"><Skeleton className="w-full h-full" /></div>;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Cash back" />

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-sm font-medium text-gray-500 mb-1">Total Cash back Earned</h2>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">{fmt(cashback?.totalEarned)}</h1>
          
          <button className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">
            Cash out to Spendable
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
           <div className="flex items-center justify-between px-4 py-4">
              <span className="font-medium text-gray-900">Earned last month</span>
              <span className="font-bold text-gray-900">{fmt(cashback?.earnedLastMonth)}</span>
           </div>
           <div className="flex items-center justify-between px-4 py-4">
              <span className="font-medium text-gray-900">All time earned</span>
              <span className="font-bold text-gray-900">{fmt(cashback?.totalEarned)}</span>
           </div>
        </div>

        <div className="pt-2">
           <h3 className="font-bold text-gray-900 mb-3 px-1">How you earn</h3>
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <span className="font-bold text-gray-900">Groceries & Transportation</span>
                 <span className="ml-auto font-bold text-primary">1%</span>
              </div>
              <p className="text-sm text-gray-500 ml-5">Earn 1% cash back on all groceries and transportation purchases.</p>
           </div>
        </div>
      </div>
    </div>
  );
}