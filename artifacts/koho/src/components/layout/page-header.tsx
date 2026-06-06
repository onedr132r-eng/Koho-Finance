import { ArrowLeft, Globe } from "lucide-react";
import { Link, useLocation } from "wouter";
import React from "react";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  onBack?: () => void;
  showLanguage?: boolean;
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, backHref = "/", onBack, showLanguage = false, rightContent }: PageHeaderProps) {
  const [, navigate] = useLocation();
  const handleBack = onBack ?? (() => navigate(backHref));
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
      <button onClick={handleBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-1">
        <ArrowLeft className="w-5 h-5 text-gray-800" />
      </button>
      <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">{title}</h1>
      <div className="flex items-center gap-2">
        {showLanguage && (
          <button className="flex items-center gap-1 text-gray-700 font-semibold text-sm hover:text-gray-900">
            <Globe className="w-4 h-4" />
            FR
          </button>
        )}
        {rightContent}
      </div>
    </header>
  );
}