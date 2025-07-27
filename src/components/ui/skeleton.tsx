import { cn } from "@/lib/utils";

/**
 * A placeholder component to display while content is loading.
 * It uses a pulse animation and a muted background color.
 * It accepts all standard div props, including `className` for custom styling.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
