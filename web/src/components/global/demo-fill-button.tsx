import { MagicWand01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DemoFillButtonProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

/** Vult formulier automatisch met demo-gegevens (presentatie / test). */
export function DemoFillButton({
  onClick,
  className,
  disabled,
}: DemoFillButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-8 gap-1.5 rounded-xl border-dashed border-amber-300 bg-amber-50/80 text-xs font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-950/50",
        className,
      )}
    >
      <HugeiconsIcon icon={MagicWand01Icon} strokeWidth={2} className="size-3.5" />
      Demo invullen
    </Button>
  );
}
