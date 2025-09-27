import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, X, Edit3 } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { format } from "date-fns";

interface BlockedDate {
  id: string;
  date: Date;
  reason: string;
}

interface BlockedDatesProps {
  onBlockedDates: (dates: BlockedDate[]) => void;
  initialBlockedDates?: BlockedDate[];
}

export function BlockedDates({ onBlockedDates, initialBlockedDates = [] }: BlockedDatesProps) {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(initialBlockedDates);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlockedDate, setEditingBlockedDate] = useState<BlockedDate | null>(null);
  const [editReason, setEditReason] = useState("");

  // Update local state when initial data changes
  useEffect(() => {
    if(initialBlockedDates.length > 0){
      setBlockedDates(initialBlockedDates);
    }
  }, [initialBlockedDates]);

  // Notify parent component when blocked dates change
  useEffect(() => {
    onBlockedDates(blockedDates);
  }, [blockedDates]);

  const addBlockedDate = (date: Date) => {
    // Check if date is already blocked
    const isAlreadyBlocked = blockedDates.some(blocked => 
      blocked.date.toDateString() === date.toDateString()
    );
    
    if (isAlreadyBlocked) {
      return; // Don't add duplicate dates
    }

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

  const editBlockedDate = (blockedDate: BlockedDate) => {
    setEditingBlockedDate(blockedDate);
    setEditReason(blockedDate.reason);
    setIsEditModalOpen(true);
  };

  const saveEdit = () => {
    if (!editingBlockedDate || !editReason.trim()) return;

    setBlockedDates(prev => 
      prev.map(blocked => 
        blocked.id === editingBlockedDate.id 
          ? { ...blocked, reason: editReason.trim() }
          : blocked
      )
    );
    
    setIsEditModalOpen(false);
    setEditingBlockedDate(null);
    setEditReason("");
  };

  const cancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingBlockedDate(null);
    setEditReason("");
  };

  return (
    <>
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
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editBlockedDate(blocked)}
                    className="h-6 w-6 p-0 hover:bg-white/50"
                  >
                    <Edit3 className="h-3 w-3 text-gray-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBlockedDate(blocked.id)}
                    className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No blocked dates set</p>
        )}
      </div>

      {/* Edit Reason Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Blocked Date Reason</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for blocking</Label>
              <Input
                id="reason"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="e.g., Vacation, Personal, Holiday"
                maxLength={50}
              />
            </div>
            
            <div className="text-xs text-gray-500">
              <p>• Provide a reason to help you remember why this date is blocked</p>
              <p>• Maximum 50 characters</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button 
              onClick={saveEdit} 
              className="bg-[#433CE7] hover:bg-[#3730a3]"
              disabled={!editReason.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}