import { useState } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";

interface TimeSlotProps {
  id: string;
  startTime: string;
  endTime: string;
  onEdit: (id: string, startTime: string, endTime: string) => void;
  onDelete: (id: string) => void;
}

// Generate time options (every 30 minutes from 6 AM to 11 PM)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = formatTimeForDisplay(timeString);
      times.push({ value: timeString, label: displayTime });
    }
  }
  return times;
};

const formatTimeForDisplay = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
  return `${displayHours}${displayMinutes} ${period}`;
};

const parseTimeToValue = (timeString: string) => {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let hour24 = hours;
  
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes ? minutes.toString().padStart(2, '0') : '00'}`;
};

const timeOptions = generateTimeOptions();

export function TimeSlot({ id, startTime, endTime, onEdit, onDelete }: TimeSlotProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(parseTimeToValue(startTime));
  const [selectedEndTime, setSelectedEndTime] = useState(parseTimeToValue(endTime));
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateTimeSlot = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (startMinutes >= endMinutes) {
      return "End time must be after start time";
    }
    
    const duration = endMinutes - startMinutes;
    if (duration < 30) {
      return "Time slot must be at least 30 minutes";
    }
    
    if (duration > 8 * 60) { // 8 hours
      return "Time slot cannot exceed 8 hours";
    }
    
    return null;
  };

  const handleSave = () => {
    const error = validateTimeSlot(selectedStartTime, selectedEndTime);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError(null);
    onEdit(id, formatTimeForDisplay(selectedStartTime), formatTimeForDisplay(selectedEndTime));
    setIsEditModalOpen(false);
  };

  const handleCancel = () => {
    setSelectedStartTime(parseTimeToValue(startTime));
    setSelectedEndTime(parseTimeToValue(endTime));
    setValidationError(null);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-[#E5E3FB] rounded-lg px-3 py-2 border border-gray-200">
        <span className="text-sm text-gray-700">
          {startTime} – {endTime}
        </span>
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditModalOpen(true)}
            className="h-6 w-6 p-0 hover:bg-white/50"
          >
            <Edit3 className="h-3 w-3 text-gray-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(id)}
            className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3 text-gray-600" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Time Slot</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {validationError && (
              <Alert variant="destructive">
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Start Time</label>
              <Select value={selectedStartTime} onValueChange={setSelectedStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">End Time</label>
              <Select value={selectedEndTime} onValueChange={setSelectedEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>• Time slot must be at least 30 minutes</p>
              <p>• Maximum duration is 8 hours</p>
              <p>• End time must be after start time</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#433CE7] hover:bg-[#3730a3]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}