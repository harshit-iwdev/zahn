import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { TimeSlot } from "./TimeSlot";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";

interface TimeSlotData {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  [key: string]: TimeSlotData[];
}

interface WeeklyAvailabilityProps {
  availabilityData?: DayAvailability;
  onAvailabilityChange?: (data: any) => void;
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

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

const timeOptions = generateTimeOptions();

export function WeeklyAvailability({ availabilityData, onAvailabilityChange }: WeeklyAvailabilityProps) {
  const [availability, setAvailability] = useState<DayAvailability>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update local state when API data changes
  useEffect(() => {
    if (availabilityData) {
      setAvailability(availabilityData);
    }
  }, [availabilityData]);

  const validateTimeSlot = (start: string, end: string) => {
    if (!start || !end) {
      return "Please select both start and end times";
    }
    
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

  const checkForOverlaps = (day: string, start: string, end: string, excludeId?: string) => {
    const daySlots = availability[day] || [];
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const newStartMinutes = startHour * 60 + startMinute;
    const newEndMinutes = endHour * 60 + endMinute;
    
    for (const slot of daySlots) {
      if (excludeId && slot.id === excludeId) continue;
      
      const [existingStartHour, existingStartMinute] = parseTimeToMinutes(slot.startTime).toString().split(':').map(Number);
      const [existingEndHour, existingEndMinute] = parseTimeToMinutes(slot.endTime).toString().split(':').map(Number);
      const existingStartMinutes = existingStartHour * 60 + existingStartMinute;
      const existingEndMinutes = existingEndHour * 60 + existingEndMinute;
      
      // Check for overlap
      if ((newStartMinutes < existingEndMinutes) && (newEndMinutes > existingStartMinutes)) {
        return `This time slot overlaps with existing slot: ${slot.startTime} - ${slot.endTime}`;
      }
    }
    
    return null;
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

  // Helper function to calculate total hours
  const calculateTotalHours = (schedule: DayAvailability) => {
    let totalMinutes = 0;
    
    Object.values(schedule).forEach((daySlots) => {
      daySlots.forEach((slot) => {
        const startTime = parseTimeToMinutes(slot.startTime);
        const endTime = parseTimeToMinutes(slot.endTime);
        totalMinutes += (endTime - startTime);
      });
    });
    
    return Math.round(totalMinutes / 60 * 100) / 100;
  };

  // Helper function to parse time string to minutes
  const parseTimeToMinutes = (timeString: string) => {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    return hour24 * 60 + (minutes || 0);
  };

  const handleAvailabilityChange = (newAvailability: DayAvailability) => {
    setAvailability(newAvailability);
    
    // Calculate total hours and notify parent
    if (onAvailabilityChange) {
      const totalHours = calculateTotalHours(newAvailability);
      onAvailabilityChange({
        schedule: newAvailability,
        totalHours: totalHours
      });
    }
  };

  const addTimeSlot = (day: string) => {
    setSelectedDay(day);
    setSelectedStartTime('');
    setSelectedEndTime('');
    setValidationError(null);
    setIsAddModalOpen(true);
  };

  const handleAddTimeSlot = () => {
    const error = validateTimeSlot(selectedStartTime, selectedEndTime);
    if (error) {
      setValidationError(error);
      return;
    }
    
    const overlapError = checkForOverlaps(selectedDay, selectedStartTime, selectedEndTime);
    if (overlapError) {
      setValidationError(overlapError);
      return;
    }
    
    const newSlot: TimeSlotData = {
      id: Date.now().toString(),
      startTime: formatTimeForDisplay(selectedStartTime),
      endTime: formatTimeForDisplay(selectedEndTime)
    };
    
    const updatedAvailability = {
      ...availability,
      [selectedDay]: [...(availability[selectedDay] || []), newSlot]
    };
    
    handleAvailabilityChange(updatedAvailability);
    
    setIsAddModalOpen(false);
  };

  const editTimeSlot = (id: string, startTime: string, endTime: string) => {
    const day = Object.keys(availability).find(d => 
      availability[d].some(slot => slot.id === id)
    );
    
    if (!day) return;
    
    const startTimeValue = parseTimeToValue(startTime);
    const endTimeValue = parseTimeToValue(endTime);
    
    const error = validateTimeSlot(startTimeValue, endTimeValue);
    if (error) {
      console.error('Validation error:', error);
      return;
    }
    
    const overlapError = checkForOverlaps(day, startTimeValue, endTimeValue, id);
    if (overlapError) {
      console.error('Overlap error:', overlapError);
      return;
    }
    
    const updatedAvailability = {
      ...availability,
      [day]: availability[day].map(slot => 
        slot.id === id ? { ...slot, startTime, endTime } : slot
      )
    };
    
    handleAvailabilityChange(updatedAvailability);
  };

  const deleteTimeSlot = (id: string) => {
    const day = Object.keys(availability).find(d => 
      availability[d].some(slot => slot.id === id)
    );
    
    if (!day) return;
    
    const updatedAvailability = {
      ...availability,
      [day]: availability[day].filter(slot => slot.id !== id)
    };
    
    handleAvailabilityChange(updatedAvailability);
  };

  const handleCancelAdd = () => {
    setSelectedDay('');
    setSelectedStartTime('');
    setSelectedEndTime('');
    setValidationError(null);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Set Your Weekly Availability</h3>
        
        <div className="space-y-4">
          {daysOfWeek.map(day => (
            <div key={day} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{day}</h4>
                <Button
                  size="sm"
                  onClick={() => addTimeSlot(day)}
                  className="bg-[#433CE7] hover:bg-[#3730a3] text-white h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Slot
                </Button>
              </div>
              
              {availability[day]?.length > 0 ? (
                <div className="space-y-2">
                  {availability[day].map(slot => (
                    <TimeSlot
                      key={slot.id}
                      id={slot.id}
                      startTime={slot.startTime}
                      endTime={slot.endTime}
                      onEdit={editTimeSlot}
                      onDelete={deleteTimeSlot}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No availability set for this day</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Time Slot Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Time Slot for {selectedDay}</DialogTitle>
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
              <p>• No overlapping time slots allowed</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAdd}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeSlot} className="bg-[#433CE7] hover:bg-[#3730a3]">
              Add Time Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}