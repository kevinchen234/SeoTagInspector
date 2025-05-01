import { cn } from "@/lib/utils";
import React from "react";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  valueClassName?: string;
  children?: React.ReactNode;
}

export function ProgressRing({ 
  value, 
  size = 120, 
  strokeWidth = 10, 
  className,
  valueClassName,
  children
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  // Determine color based on value
  const getColorClass = () => {
    if (value >= 80) return "stroke-green-500";
    if (value >= 50) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-gray-200"
          fill="transparent"
        />
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-500 ease-in-out", getColorClass())}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ? (
          children
        ) : (
          <div className={cn("text-2xl font-bold", valueClassName)}>
            {Math.round(value)}%
          </div>
        )}
      </div>
    </div>
  );
}