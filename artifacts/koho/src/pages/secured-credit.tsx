import { PageHeader } from "@/components/layout/page-header";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SecuredCredit() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Secured Credit Building" />

      <div className="p-4 space-y-6">
         <div className="text-center pt-4 pb-2">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Build with your own money</h1>
            <p className="text-sm text-gray-500 max-w-[280px] mx-auto">Use a refundable deposit to open a secured line of credit and build your history safely.</p>
         </div>

         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex gap-4">
               <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
               <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Make a deposit</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Deposit $30 to $500. This becomes your credit limit.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
               <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Spend normally</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Use it like a regular credit card for your everyday purchases.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
               <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Build credit safely</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">We report your usage. Close the account anytime to get your deposit back.</p>
               </div>
            </div>
         </div>

         <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">
            Set up
         </button>
      </div>
    </div>
  );
}