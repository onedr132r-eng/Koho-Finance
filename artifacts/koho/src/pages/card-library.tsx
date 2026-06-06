import { PageHeader } from "@/components/layout/page-header";
import { Library, Search, ChevronRight } from "lucide-react";

export default function CardLibrary() {
  const cards = [
    { name: "Altitude Sports", discount: "5% cash back", color: "bg-black text-white" },
    { name: "Frank And Oak", discount: "4% cash back", color: "bg-gray-900 text-white" },
    { name: "Indigo", discount: "3% cash back", color: "bg-blue-900 text-white" },
    { name: "Kiehl's", discount: "4% cash back", color: "bg-slate-800 text-white" },
    { name: "Well.ca", discount: "2% cash back", color: "bg-green-700 text-white" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="Card Library" />

      <div className="p-4 space-y-6">
         <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
               type="text"
               placeholder="Search partners"
               className="w-full bg-white border-none shadow-sm rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
         </div>

         <div className="text-center">
            <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Library className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner Offers</h1>
            <p className="text-sm text-gray-500 max-w-[280px] mx-auto mb-6">Earn extra cash back when you shop at our partner brands with your KOHO card.</p>
         </div>

         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {cards.map(card => (
               <div key={card.name} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${card.color}`}>
                        {card.name.charAt(0)}
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">{card.name}</h4>
                        <p className="text-sm text-primary font-bold">{card.discount}</p>
                     </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}