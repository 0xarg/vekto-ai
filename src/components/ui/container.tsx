import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  width = "default",
}: {
  className?: string;
  children: React.ReactNode;
  width?: "default" | "wide" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "default" && "max-w-6xl",
        width === "wide" && "max-w-7xl",
        width === "prose" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
