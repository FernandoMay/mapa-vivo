import React from 'react';

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  highlight?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, value, description, highlight = false }) => {
  const containerClass = highlight 
    ? 'p-6 rounded-2xl border transition-all duration-300 bg-blue-600 border-blue-700 text-white shadow-xl scale-105' 
    : 'p-6 rounded-2xl border transition-all duration-300 bg-white border-gray-100 text-gray-900 shadow-sm hover:shadow-md';
  
  const titleClass = highlight ? 'text-xs font-bold uppercase tracking-wider mb-2 text-blue-100' : 'text-xs font-bold uppercase tracking-wider mb-2 text-gray-500';
  const valueClass = highlight ? 'text-4xl font-black mb-3 text-white' : 'text-4xl font-black mb-3 text-blue-900';
  const descClass = highlight ? 'text-sm leading-relaxed text-blue-50' : 'text-sm leading-relaxed text-gray-600';

  return (
    <div className={containerClass}>
      <p className={titleClass}>{title}</p>
      <p className={valueClass}>{value}</p>
      <p className={descClass}>{description}</p>
    </div>
  );
};
