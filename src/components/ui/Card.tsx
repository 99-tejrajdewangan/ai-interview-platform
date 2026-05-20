import type { ReactNode } from "react";
import { cn } from "../../utils/helpers";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
