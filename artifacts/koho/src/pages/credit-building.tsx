import { PageHeader } from "@/components/layout/page-header";
import { TrendingUp, CheckCircle2, Plus } from "lucide-react";

export default function CreditBuilding() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Credit Building" />

      <div className="p-4 space-y-6">
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
               Action required
            </div>
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
               <TrendingUp className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Set your utilization</h2>
            <p className="text-sm text-gray-500 mb-6">To continue building your credit, you need to set your utilization amount for this month.</p>
            <button className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">
               Set Utilization
            </button>
         </div>

         <div>
            <h3 className="font-bold text-gray-900 mb-3 px-1">How it works</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-4">
               <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm mb-1">We extend a line of credit</h4>
                     <p className="text-xs text-gray-500 leading-relaxed">We open a line of credit for you and report it to Equifax.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm mb-1">You make payments</h4>
                     <p className="text-xs text-gray-500 leading-relaxed">We automatically withdraw a small portion of it each month.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm mb-1">Your score grows</h4>
                     <p className="text-xs text-gray-500 leading-relaxed">On-time payments are reported, helping build your credit history.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="pt-2">
            <h3 className="font-bold text-gray-900 mb-3 px-1">FAQ</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
               <div className="p-4 flex items-center justify-between text-gray-900 font-medium text-sm">
                 How long does it take to see results?
                 <Plus className="w-5 h-5 text-gray-400" />
               </div>
               <div className="p-4 flex items-center justify-between text-gray-900 font-medium text-sm">
                 What happens if I miss a payment?
                 <Plus className="w-5 h-5 text-gray-400" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}