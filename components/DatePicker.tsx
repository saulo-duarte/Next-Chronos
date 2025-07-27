'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useId } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface DatePickerProps {
  label?: string;
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  id?: string;
}

export function DatePicker({ label, date, onChange, id }: DatePickerProps) {
  const internalId = useId();
  const fieldId = id || internalId;

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={fieldId}
            variant="outline"
            className={cn(
              'w-full justify-between px-3 font-normal bg-background hover:bg-background border-input outline-offset-0 outline-none focus-visible:outline-[3px]',
              !date && 'text-muted-foreground'
            )}
          >
            <span>{date ? format(date, 'dd/MM/yy') : 'Escolher data'}</span>
            <CalendarIcon size={16} className="text-muted-foreground/80" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              if (selectedDate && date && selectedDate.getTime() === date.getTime()) {
                onChange(undefined);
              } else {
                onChange(selectedDate ?? undefined);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
