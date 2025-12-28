"use client"

import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Loader({ className, size = "md", ...props }: LoaderProps) {
  const sizeClasses = {
    sm: "size-6 border-2",
    md: "size-10 border-[3px]",
    lg: "size-16 border-4",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-border border-t-transparent border-r-transparent",
          sizeClasses[size],
          "shadow-shadow"
        )}
        style={{
          borderTopColor: "transparent",
          borderRightColor: "transparent",
        }}
      />
    </div>
  )
}

