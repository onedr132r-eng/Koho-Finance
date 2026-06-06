import { PageHeader } from "@/components/layout/page-header";
import { Scissors } from "lucide-react";
import { useState } from "react";

export default function BillSplit() {
  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState(2);

  const totalAmount = parseFloat(amount) || 0;
  const perPerson = people > 0 ? totalAmount / people : 0;

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(val);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Bill Split" />

      <div className="p-4 space-y-6">
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Scissors className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Split a bill</h1>
            <p className="text-sm text-gray-500 mb-6">Enter the total amount and how many people to split it with.</p>

            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 text-left mb-1">Total Amount</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                     <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl pl-8 pr-4 py-3 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 text-left mb-1">Number of People</label>
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-2">
                     <button 
                        onClick={() => setPeople(Math.max(2, people - 1))}
                        className="w-10 h-10 bg-white rounded-lg shadow-sm font-bold text-gray-900 hover:bg-gray-50"
                     >-</button>
                     <span className="flex-1 font-bold text-gray-900">{people}</span>
                     <button 
                        onClick={() => setPeople(people + 1)}
                        className="w-10 h-10 bg-white rounded-lg shadow-sm font-bold text-gray-900 hover:bg-gray-50"
                     >+</button>
                  </div>
               </div>
            </div>
         </div>

         {totalAmount > 0 && (
            <div className="bg-[#F0EEFF] rounded-3xl p-6 text-center">
               <h3 className="font-bold text-gray-900 text-sm mb-1">Each person pays</h3>
               <div className="text-4xl font-bold text-primary mb-4">{fmt(perPerson)}</div>
               <button className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">
                  Send requests
               </button>
            </div>
         )}
      </div>
    </div>
  );
}