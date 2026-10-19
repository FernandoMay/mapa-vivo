import React from 'react';

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  highlight?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, value, description, highlight = false }) => {
  return (
    <div className={\p-6 rounded-2xl border transition-all duration-300 \\}>
      <p className={\	ext-xs font-bold uppercase tracking-wider mb-2 \\}>
        {title}
      </p>
      <p className={\	ext-4xl font-black mb-3 \\}>
        {value}
      </p>
      <p className={\	ext-sm leading-relaxed \\}>
        {description}
      </p>
    </div>
  );
};
