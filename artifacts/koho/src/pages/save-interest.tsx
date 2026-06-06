import { PageHeader } from "@/components/layout/page-header";
import { useGetSavings } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, TrendingUp, ChevronRight } from "lucide-react";

export default function SaveInterest() {
  const { data: savings, isLoading } = useGetSavings();

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  if (isLoading) return <div className="h-full bg-gray-50"><Skeleton className="w-full h-full" /></div>;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Save Interest" />

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center relative">
          <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
             Earning {savings?.interestRate}%
          </div>
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <Database className="w-8 h-8" />
          </div>
          <h2 className="text-sm font-medium text-gray-500 mb-1">Total Interest Earned</h2>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">{fmt(savings?.totalInterestEarned)}</h1>
          <p className="text-sm text-gray-500 mb-6">Paid out monthly on the 1st</p>
        </div>

        <div>
           <h3 className="font-bold text-gray-900 mb-3 px-1">How it works</h3>
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-4">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 text-[15px] mb-1">Earn {savings?.interestRate}% interest</h4>
                    <p className="text-[13px] text-gray-500">Your entire Spendable and Save balances earn interest daily, paid out monthly.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}