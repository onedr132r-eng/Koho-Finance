import { useGetAccountSummary, useGetCrypto } from "@workspace/api-client-react";
import { X, ChevronRight, Target, Lock, RotateCcw, Database, Bitcoin } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyBalances() {
  const { data: summary, isLoading: isLoadingSummary } = useGetAccountSummary();
  const { data: crypto, isLoading: isLoadingCrypto } = useGetCrypto();

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  if (isLoadingSummary || isLoadingCrypto) {
    return <div className="h-full bg-gray-50 p-4"><Skeleton className="w-full h-48" /></div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="w-9 h-9" />
        <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">My balances</h1>
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-800" />
        </Link>
      </header>

      <div className="bg-white">
        <div className="px-4 py-3 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-2">
          <button className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-bold shadow-sm">All</button>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Spend</button>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Save</button>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Crypto</button>
        </div>

        <div className="p-6 text-center">
          <p className="text-sm font-bold text-gray-500 mb-1">Total balance</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{fmt((summary?.totalBalance || 0) + (crypto?.balance || 0))}</h2>
          <p className="text-sm text-gray-600 max-w-[250px] mx-auto leading-relaxed">
            A snapshot of all your hard-earned cash and savings in one place.
          </p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
           <Link href="/save-interest" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                 <Database className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900">Spendable</h4>
               </div>
             </div>
             <div className="flex flex-col items-end">
                <span className="font-bold text-gray-900">{fmt(summary?.spendable)}</span>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">Earning {summary?.interestRate}% interest</span>
             </div>
           </Link>

           <Link href="/vault" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                 <Lock className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900">Vault</h4>
               </div>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{fmt(summary?.vault)}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
             </div>
           </Link>

           <Link href="/roundups" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                 <RotateCcw className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900">RoundUps</h4>
               </div>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{fmt(summary?.roundups)}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
             </div>
           </Link>

           <Link href="/goals" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                 <Target className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900">Goals</h4>
               </div>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{fmt(summary?.goals)}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
             </div>
           </Link>

           <Link href="/crypto" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-gray-50/50">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                 <Bitcoin className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900">Crypto</h4>
                 <p className="text-xs text-gray-500">Crypto assets don't earn interest</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{fmt(crypto?.balance)}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
             </div>
           </Link>
        </div>
      </div>
    </div>
  );
}