import React from "react";

interface ViolationCountProps {
  counts: { [key: string]: number };
}

export const ViolationSummary: React.FC<ViolationCountProps> = ({ counts }) => {
  const impactColors: { [key: string]: string } = {
    
    critical: "bg-pink-500 opacity-90",
    serious: "bg-red-500 opacity-90",
    moderate: "bg-yellow-400 opacity-90",
    minor: "bg-blue-400 opacity-80",
  };

  return (
    <div className="flex gap-4 bg-gray-50 p-2 rounded-md ml-auto">
      {Object.entries(counts).map(([impact, count]) => (
        <div
          key={impact}
          className="flex items-center gap-2 px-2 py-1 rounded-md shadow-lg"
        >
          <span
            className={`text-white text-sm font-semibold ${impactColors[impact]} px-2 py-1 rounded-md`}
          >
            {count}
          </span>
          <span className="text-sm font-medium capitalize">{impact}</span>
        </div>
      ))}
    </div>
  );
};
