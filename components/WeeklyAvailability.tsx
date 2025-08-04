import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { TimeSlot } from "./TimeSlot";

interface TimeSlotData {
  id: string;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  [key: string]: TimeSlotData[];
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export function WeeklyAvailability() {
  const [availability, setAvailability] = useState<DayAvailability>({
    Monday: [
      { id: '1', startTime: '9:00 AM', endTime: '12:00 PM' },
      { id: '2', startTime: '2:00 PM', endTime: '6:00 PM' }
    ],
    Tuesday: [
      { id: '3', startTime: '9:00 AM', endTime: '12:00 PM' },
      { id: '4', startTime: '2:00 PM', endTime: '6:00 PM' }
    ],
    Wednesday: [
      { id: '5', startTime: '9:00 AM', endTime: '12:00 PM' }
    ],
    Thursday: [
      { id: '6', startTime: '9:00 AM', endTime: '12:00 PM' },
      { id: '7', startTime: '2:00 PM', endTime: '6:00 PM' }
    ],
    Friday: [
      { id: '8', startTime: '9:00 AM', endTime: '3:00 PM' }
    ],
    Saturday: [],
    Sunday: []
  });

  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlotData = {
      id: Date.now().toString(),
      startTime: '9:00 AM',
      endTime: '5:00 PM'
    };
    
    setAvailability(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newSlot]
    }));
  };

  const editTimeSlot = (day: string, slotId: string) => {
    // In a real app, this would open a time picker modal
    console.log('Edit time slot:', day, slotId);
  };

  const deleteTimeSlot = (day: string, slotId: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter(slot => slot.id !== slotId)
    }));
  };

  return (
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
                    startTime={slot.startTime}
                    endTime={slot.endTime}
                    onEdit={() => editTimeSlot(day, slot.id)}
                    onDelete={() => deleteTimeSlot(day, slot.id)}
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
  );
}