"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { nl as nlDayPicker } from "react-day-picker/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

function parseDateValue(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatDateValue(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function DatePicker({
  label,
  id,
  value,
  onChange,
  placeholder = "Kies een datum",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDateValue(value);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label
        htmlFor={id}
        className="text-sm font-medium text-sky-950 dark:text-slate-200"
      >
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          render={
            <Button
              variant="outline"
              className={cn(
                "h-10 w-full justify-start gap-2 rounded-xl border-sky-200 bg-white px-3 text-sm font-normal text-rkz-navy shadow-sm hover:bg-sky-50/40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
                !selected && "text-slate-500",
              )}
            />
          }
        >
          <HugeiconsIcon
            icon={Calendar03Icon}
            strokeWidth={2}
            className="size-4 shrink-0 text-sky-600/80"
          />
          {selected
            ? format(selected, "d MMM yyyy", { locale: nl })
            : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            locale={nlDayPicker}
            weekStartsOn={1}
            onSelect={(date) => {
              if (!date) {
                onChange("");
                return;
              }
              onChange(formatDateValue(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
