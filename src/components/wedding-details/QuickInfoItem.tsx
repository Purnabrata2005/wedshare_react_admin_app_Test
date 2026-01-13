import { cn } from "@/lib/utils";

interface QuickInfoItemProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export function QuickInfoItem({
  label,
  value,
  valueClassName,
}: QuickInfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className={cn("font-semibold text-foreground", valueClassName)}>
        {value}
      </p>
    </div>
  );
}