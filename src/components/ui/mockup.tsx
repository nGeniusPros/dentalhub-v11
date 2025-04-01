import React from "react";
import { cn } from "@/lib/utils";

const Mockup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden", // Basic styling
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Mockup.displayName = "Mockup";

export { Mockup };