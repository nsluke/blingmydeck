"use client";

interface LoadingStateProps {
  current: number;
  total: number;
  cardName: string;
}

export default function LoadingState({
  current,
  total,
  cardName,
}: LoadingStateProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-navy-dark border border-gray-800 rounded-xl p-6 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">
          Blinging card {current} of {total}
        </span>
        <span className="text-gold">{Math.round(pct)}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 truncate">
        {cardName}
      </p>
    </div>
  );
}
