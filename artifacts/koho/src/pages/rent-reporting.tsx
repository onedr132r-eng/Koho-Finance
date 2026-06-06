import { PageHeader } from "@/components/layout/page-header";
import { Home, CheckCircle2 } from "lucide-react";

export default function RentReporting() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Rent Reporting" />

      <div className="p-4 space-y-6">
         <div className="text-center pt-4 pb-2">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Home className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Get credit for rent</h1>
            <p className="text-sm text-gray-500 max-w-[280px] mx-auto">You pay rent every month. Now you can use it to build your credit history.</p>
         </div>

         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex gap-4">
               <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
               <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Add your landlord</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">Provide your rent amount and landlord details.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
               <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Pay through KOHO</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">We automatically send your rent payment via e-Transfer.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
               <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Watch your score grow</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">We report your on-time payments to Equifax every month.</p>
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