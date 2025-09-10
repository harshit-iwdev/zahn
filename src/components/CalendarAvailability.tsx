import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { BlockedDates } from "./BlockedDates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CalendarDays, Clock } from "lucide-react";
import { WeeklyAvailability } from "./WeeklyAvailability";
import { executor } from "@/http/executer";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";

interface BlockedDate {
  id: string;
  date: Date;
  reason: string;
}

export function CalendarAvailability() {
  const [isGoogleSyncEnabled, setIsGoogleSyncEnabled] = useState(true);
  const [isAppleSyncEnabled, setIsAppleSyncEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availabilitySchedule, setAvailabilitySchedule] = useState<any>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);

  useEffect(() => {
    fetchDentistAvailabilitySchedule();
  }, []);

  const fetchDentistAvailabilitySchedule = async () => {
    try {
      const url = DENTIST_ENDPOINT.GET_DENTIST_AVAILABILITY_SCHEDULE;
      const exe = executor("get", url);
      const response = await exe.execute();
      console.log("response", response);
      setAvailabilitySchedule(response.data.data.general_schedule);
      
      // Convert blocked dates from API if they exist
      if (response.data.data.blocked_dates) {
        const apiBlockedDates = response.data.data.blocked_dates.map((dateStr: string, index: number) => ({
          id: `blocked_${index}`,
          date: new Date(dateStr),
          reason: 'Blocked'
        }));
        setBlockedDates(apiBlockedDates);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Helper function to calculate total hours from availability schedule
  const calculateTotalHours = (schedule: any) => {
    if (!schedule || typeof schedule !== 'object') return 0;
    
    let totalMinutes = 0;
    
    Object.values(schedule).forEach((daySlots: any) => {
      if (Array.isArray(daySlots)) {
        daySlots.forEach((slot: any) => {
          if (slot.startTime && slot.endTime) {
            const startTime = parseTimeToMinutes(slot.startTime);
            const endTime = parseTimeToMinutes(slot.endTime);
            totalMinutes += (endTime - startTime);
          }
        });
      }
    });
    
    return Math.round(totalMinutes / 60 * 100) / 100; // Round to 2 decimal places
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

  const handleSaveAvailability = async () => {
    try {
      const totalHours = calculateTotalHours(availabilitySchedule?.schedule);
      
      // Prepare the data to save
      const saveData = {
        general_schedule: {
          ...availabilitySchedule,
          totalHours: totalHours
        },
        blocked_dates: blockedDates.map(blocked => blocked.date.toISOString().split('T')[0])
      };

      console.log("Saving availability with total hours:", totalHours);
      console.log("Save data:", saveData);

      // Call your save API endpoint here
      const url = DENTIST_ENDPOINT.UPDATE_DENTIST_AVAILABILITY_SCHEDULE;
      const exe = executor("put", url);
      const response = await exe.execute(saveData);
      
      console.log("Availability saved successfully", response);
      // Show success toast or notification
    } catch (error) {
      console.error("Failed to save availability", error);
      // Show error toast or notification
    }
  };

  const handleAvailabilityChange = (newAvailability: any) => {
    const totalHours = calculateTotalHours(newAvailability);
    
    setAvailabilitySchedule(prev => ({
      ...prev,
      schedule: newAvailability,
      totalHours: totalHours
    }));
  };

  const handleBlockedDatesChange = (newBlockedDates: BlockedDate[]) => {
    setBlockedDates(newBlockedDates);
  };

  // Helper function to check if a date is blocked
  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked => 
      blocked.date.toDateString() === date.toDateString()
    );
  };

  // Helper function to check if a date has availability
  const hasAvailability = (date: Date) => {
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    return availabilitySchedule?.schedule?.[dayName]?.length > 0;
  };

  // Get current total hours for display
  const currentTotalHours = calculateTotalHours(availabilitySchedule?.schedule);

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Calendar & Availability
          </h1>
          <p className="text-gray-600">Manage when you're available for appointments</p>
          
          {/* Total Hours Display */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Total Weekly Hours</h3>
                <p className="text-sm text-gray-600">Total available hours per week</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#433CE7]">
                  {currentTotalHours.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* External Calendar Sync */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">External Calendar Sync</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">G</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Google Calendar</p>
                  <p className="text-sm text-gray-600">
                    {isGoogleSyncEnabled ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isGoogleSyncEnabled}
                onCheckedChange={setIsGoogleSyncEnabled}
                className="data-[state=checked]:bg-[#433CE7]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">🍎</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Apple Calendar</p>
                  <p className="text-sm text-gray-600">
                    {isAppleSyncEnabled ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isAppleSyncEnabled}
                onCheckedChange={setIsAppleSyncEnabled}
                className="data-[state=checked]:bg-[#433CE7]"
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Availability Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Availability */}
            <WeeklyAvailability 
              availabilityData={availabilitySchedule?.schedule || {}} 
              onAvailabilityChange={handleAvailabilityChange}
            />
            
            {/* Blocked Dates */}
            <BlockedDates onBlockedDates={handleBlockedDatesChange} />
          </div>

          {/* Right Column - Calendar View */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-[#433CE7]" />
                Calendar View
              </h3>
              
              <Tabs defaultValue="month" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
                
                <TabsContent value="week" className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Weekly availability view</p>
                    <div className="space-y-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                        const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index];
                        const hasAvailability = availabilitySchedule?.schedule?.[dayName]?.length > 0;
                        const dayHours = calculateDayHours(availabilitySchedule?.schedule?.[dayName] || []);
                        
                        return (
                          <div key={day} className="flex items-center justify-between p-2 rounded border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">{day}</span>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                hasAvailability ? 'bg-[#433CE7]' : 'bg-gray-200'
                              }`}></div>
                              <span className="text-xs text-gray-500">
                                {hasAvailability ? `${dayHours.toFixed(1)}h` : 'Blocked'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="month">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md"
                    modifiers={{
                      available: (date) => hasAvailability(date) && !isDateBlocked(date),
                      blocked: (date) => isDateBlocked(date) || !hasAvailability(date)
                    }}
                    modifiersStyles={{
                      available: { backgroundColor: '#E5E3FB' },
                      blocked: { backgroundColor: '#FEE2E2', color: '#DC2626' }
                    }}
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-[#E5E3FB]"></div>
                  <span className="text-gray-600">Available time</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-100"></div>
                  <span className="text-gray-600">Blocked date</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveAvailability}
            className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-8 py-3"
          >
            <Clock className="w-4 h-4 mr-2" />
            Save Availability ({currentTotalHours.toFixed(1)}h)
          </Button>
        </div>
      </div>
    </div>
  );

  // Helper function to calculate hours for a specific day
  function calculateDayHours(daySlots: any[]) {
    if (!Array.isArray(daySlots)) return 0;
    
    let totalMinutes = 0;
    daySlots.forEach((slot: any) => {
      if (slot.startTime && slot.endTime) {
        const startTime = parseTimeToMinutes(slot.startTime);
        const endTime = parseTimeToMinutes(slot.endTime);
        totalMinutes += (endTime - startTime);
      }
    });
    
    return Math.round(totalMinutes / 60 * 100) / 100;
  }
}