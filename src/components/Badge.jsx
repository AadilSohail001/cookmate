import { cn } from "@/utils/cn";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
    primary: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
