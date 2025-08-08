import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { cn } from "./ui/utils";

interface DateRangePickerProps {
  onDateRangeChange?: (from: Date | undefined, to: Date | undefined) => void;
  className?: string;
  placeholder?: {
    from?: string;
    to?: string;
  };
}

export function DateRangePicker({ 
  onDateRangeChange, 
  className,
  placeholder = { from: "MM/DD/YYYY", to: "MM/DD/YYYY" }
}: DateRangePickerProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  const handleFromSelect = (date: Date | undefined) => {
    setDateFrom(date);
    setIsFromOpen(false);
    onDateRangeChange?.(date, dateTo);
  };

  const handleToSelect = (date: Date | undefined) => {
    setDateTo(date);
    setIsToOpen(false);
    onDateRangeChange?.(dateFrom, date);
  };

  const clearDateRange = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    onDateRangeChange?.(undefined, undefined);
  };

  const hasDateRange = dateFrom || dateTo;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-[#1E1E1E]">Date Range</Label>
        {hasDateRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* From Date */}
        <div className="flex-1 relative">
          <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  readOnly
                  value={dateFrom ? format(dateFrom, "MM/dd/yyyy") : ""}
                  placeholder={placeholder.from}
                  className={cn(
                    "h-10 pr-10 cursor-pointer bg-white border-gray-200 focus:border-[#433CE7] focus:ring-1 focus:ring-[#433CE7]",
                    dateFrom && "border-[#433CE7]"
                  )}
                />
                <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-lg border border-gray-200" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleFromSelect}
                initialFocus
                disabled={(date) => dateTo ? date > dateTo : false}
                modifiers={{
                  selected: (date) => dateFrom ? date.toDateString() === dateFrom.toDateString() : false
                }}
                modifiersStyles={{
                  selected: { backgroundColor: '#433CE7', color: 'white' }
                }}
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
          <div className="absolute -bottom-5 left-0">
            <span className="text-xs text-gray-600">From</span>
          </div>
        </div>

        {/* To Date */}
        <div className="flex-1 relative">
          <Popover open={isToOpen} onOpenChange={setIsToOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  readOnly
                  value={dateTo ? format(dateTo, "MM/dd/yyyy") : ""}
                  placeholder={placeholder.to}
                  className={cn(
                    "h-10 pr-10 cursor-pointer bg-white border-gray-200 focus:border-[#433CE7] focus:ring-1 focus:ring-[#433CE7]",
                    dateTo && "border-[#433CE7]"
                  )}
                />
                <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-lg border border-gray-200" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleToSelect}
                initialFocus
                disabled={(date) => dateFrom ? date < dateFrom : false}
                modifiers={{
                  selected: (date) => dateTo ? date.toDateString() === dateTo.toDateString() : false,
                  inRange: (date) => {
                    if (!dateFrom || !dateTo) return false;
                    return date >= dateFrom && date <= dateTo;
                  }
                }}
                modifiersStyles={{
                  selected: { backgroundColor: '#433CE7', color: 'white' },
                  inRange: { backgroundColor: '#E5E3FB', color: '#433CE7' }
                }}
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
          <div className="absolute -bottom-5 left-0">
            <span className="text-xs text-gray-600">To</span>
          </div>
        </div>
      </div>
    </div>
  );
}