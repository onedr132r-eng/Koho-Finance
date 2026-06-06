import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const details = [
  { label: "Name", value: "Ahmed Reyene Rebaiaia" },
  { label: "Email", value: "rayanre@hotmail.fr" },
  { label: "Phone number", value: "(418) 932-9480" },
  { label: "Occupation", value: "Student" },
  { label: "Account purpose", value: "Daily living expenses" },
  { label: "Shipping address", value: "209-385 Rue Lockwell\nQuebec, Quebec\nG1R 5J6" },
  { label: "Home address", value: "209-385 Rue Lockwell\nQuebec, Quebec\nG1R 5J6" },
  { label: "Tax residency", value: "Canada" },
];

export default function PersonalDetails() {
  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
      </header>

      <div className="px-5 pt-4 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Personal details</h1>
      </div>

      <div className="divide-y divide-gray-100 px-5">
        {details.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-start justify-between py-4 hover:bg-gray-50 text-left"
          >
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">{item.label}</p>
              <p className="text-gray-600 text-sm mt-0.5 whitespace-pre-line">{item.value}</p>
            </div>
            <div className="flex items-center gap-1 ml-4 mt-0.5">
              <span className="text-[#7B4FFF] font-semibold text-sm">Update</span>
              <ChevronRight className="w-4 h-4 text-[#7B4FFF]" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
