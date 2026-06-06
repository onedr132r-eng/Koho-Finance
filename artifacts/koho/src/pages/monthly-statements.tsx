import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";

const MONTH_SLUG: Record<string, string> = {
  "January": "january", "February": "february", "March": "march",
  "April": "april", "May": "may", "June": "june",
  "July": "july", "August": "august", "September": "september",
  "October": "october", "November": "november", "December": "december",
};

function toSlug(month: string): string {
  // "April 2026" → "april-2026"
  // "February 2025 - Save" → "february-2025"
  const base = month.replace(/ - Save$/, "").replace(/ - .*$/, "");
  const [m, y] = base.split(" ");
  return `${MONTH_SLUG[m] ?? m.toLowerCase()}-${y}`;
}

const statements: { year: number; months: string[] }[] = [
  {
    year: 2026,
    months: ["April 2026", "March 2026", "February 2026", "January 2026"],
  },
  {
    year: 2025,
    months: [
      "December 2025", "November 2025", "October 2025", "September 2025",
      "August 2025", "July 2025", "June 2025", "May 2025", "April 2025",
      "March 2025", "February 2025", "February 2025 - Save", "January 2025",
    ],
  },
  {
    year: 2024,
    months: [
      "December 2024", "December 2024 - Save", "November 2024",
      "October 2024", "September 2024", "August 2024",
      "July 2024", "June 2024", "May 2024",
    ],
  },
];

export default function MonthlyStatements() {
  const [, navigate] = useLocation();

  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-4">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
      </header>

      <div className="px-5 pt-4 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-5">Monthly statements</h1>

        <Link
          href="/feature/payee-number"
          className="flex items-center justify-between bg-[#F5F3FF] rounded-2xl px-4 py-3 mb-6"
        >
          <div>
            <p className="text-[#7B4FFF] font-semibold text-sm">Looking for payee number?</p>
            <p className="text-gray-600 text-sm">Find your 9 digit payee number here</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </Link>
      </div>

      {statements.map((group) => (
        <div key={group.year} className="px-5 mb-6">
          <p className="font-bold text-gray-900 text-base mb-2">{group.year}</p>
          <div className="divide-y divide-gray-100">
            {group.months.map((month) => (
              <button
                key={month}
                onClick={() => navigate(`/statement/${toSlug(month)}`)}
                className="w-full flex items-center justify-between py-4 hover:bg-gray-50 text-left"
              >
                <span className="font-medium text-gray-900">{month}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
