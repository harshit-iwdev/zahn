import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";

interface BlockedDate {
  id: string;
  date: Date;
  reason: string;
}

export function BlockedDates() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    {
      id: '1',
      date: new Date(2025, 7, 15), // August 15, 2025
      reason: 'Vacation'
    },
    {
      id: '2', 
      date: new Date(2025, 7, 16), // August 16, 2025
      reason: 'Vacation'
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const addBlockedDate = (date: Date) => {
    const newBlockedDate: BlockedDate = {
      id: Date.now().toString(),
      date,
      reason: 'Blocked'
    };
    
    setBlockedDates(prev => [...prev, newBlockedDate]);
    setSelectedDate(undefined);
    setIsCalendarOpen(false);
  };

  const removeBlockedDate = (id: string) => {
    setBlockedDates(prev => prev.filter(blocked => blocked.id !== id));
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Block Specific Dates</h3>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border-[#433CE7] text-[#433CE7] hover:bg-[#433CE7] hover:text-white"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Block Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  addBlockedDate(date);
                }
              }}
              disabled={(date) => 
                date < new Date() || 
                blockedDates.some(blocked => 
                  blocked.date.toDateString() === date.toDateString()
                )
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {blockedDates.length > 0 ? (
        <div className="space-y-2">
          {blockedDates.map(blocked => (
            <div
              key={blocked.id}
              className="flex items-center justify-between bg-[#E5E3FB] rounded-lg px-3 py-2"
            >
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-4 h-4 text-[#433CE7]" />
                <span className="text-sm text-gray-700">
                  {format(blocked.date, 'MMMM d, yyyy')}
                </span>
                <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                  {blocked.reason}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeBlockedDate(blocked.id)}
                className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No blocked dates set</p>
      )}
    </div>
  );
}