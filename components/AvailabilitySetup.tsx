import { useState, useEffect } from "react";
import { Clock, Calendar, Globe, Check, AlertTriangle, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";

interface AvailabilitySetupProps {
  onComplete: (availabilityData: any) => void;
  onBack: () => void;
}

type TimeSlot = {
  day: string;
  hour: number;
  time: string;
  selected: boolean;
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
const MINIMUM_HOURS = 12;

const PRESETS = [
  {
    name: "Mon-Fri, 9 AM-12 PM",
    hours: 15,
    schedule: {
      Monday: [9, 10, 11],
      Tuesday: [9, 10, 11],
      Wednesday: [9, 10, 11],
      Thursday: [9, 10, 11],
      Friday: [9, 10, 11],
      Saturday: [],
      Sunday: []
    }
  },
  {
    name: "Mon-Fri, 2 PM-6 PM",
    hours: 20,
    schedule: {
      Monday: [14, 15, 16, 17],
      Tuesday: [14, 15, 16, 17],
      Wednesday: [14, 15, 16, 17],
      Thursday: [14, 15, 16, 17],
      Friday: [14, 15, 16, 17],
      Saturday: [],
      Sunday: []
    }
  },
  {
    name: "Weekends Only",
    hours: 16,
    schedule: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [9, 10, 11, 12, 13, 14, 15, 16],
      Sunday: [9, 10, 11, 12, 13, 14, 15, 16]
    }
  }
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
];

export function AvailabilitySetup({ onComplete, onBack }: AvailabilitySetupProps) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [timezone, setTimezone] = useState('America/New_York');
  const [calendarSync, setCalendarSync] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-detect timezone on component mount
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const supportedTimezone = TIMEZONES.find(tz => tz.value === detectedTimezone);
    if (supportedTimezone) {
      setTimezone(detectedTimezone);
    }
  }, []);

  const formatTime = (hour: number) => {
    if (hour < 12) {
      return hour === 0 ? '12 AM' : `${hour} AM`;
    } else if (hour === 12) {
      return '12 PM';
    } else {
      return `${hour - 12} PM`;
    }
  };

  const getSlotKey = (day: string, hour: number) => `${day}-${hour}`;

  const toggleTimeSlot = (day: string, hour: number) => {
    const slotKey = getSlotKey(day, hour);
    const newSelectedSlots = new Set(selectedSlots);
    
    if (newSelectedSlots.has(slotKey)) {
      newSelectedSlots.delete(slotKey);
    } else {
      newSelectedSlots.add(slotKey);
    }
    
    setSelectedSlots(newSelectedSlots);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    const newSelectedSlots = new Set<string>();
    
    Object.entries(preset.schedule).forEach(([day, hours]) => {
      hours.forEach(hour => {
        newSelectedSlots.add(getSlotKey(day, hour));
      });
    });
    
    setSelectedSlots(newSelectedSlots);
  };

  const getTotalHours = () => selectedSlots.size;
  const meetsMinimum = () => getTotalHours() >= MINIMUM_HOURS;

  const getStatusMessage = () => {
    const total = getTotalHours();
    if (total === 0) {
      return { type: 'neutral', message: 'Select your available time slots to get started' };
    } else if (total < MINIMUM_HOURS) {
      return { 
        type: 'warning', 
        message: `You need ${MINIMUM_HOURS - total} more hour${MINIMUM_HOURS - total === 1 ? '' : 's'} to meet the minimum requirement` 
      };
    } else {
      return { 
        type: 'success', 
        message: `Great! You've selected ${total} hours. You're eligible to appear in search.` 
      };
    }
  };

  const handleSubmit = async () => {
    if (!meetsMinimum()) return;

    setIsLoading(true);

    try {
      // Convert selected slots to structured data
      const availabilityData = {
        timezone,
        calendarSync,
        schedule: {} as Record<string, number[]>,
        totalHours: getTotalHours()
      };

      // Group slots by day
      DAYS.forEach(day => {
        availabilityData.schedule[day] = HOURS.filter(hour =>
          selectedSlots.has(getSlotKey(day, hour))
        );
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Availability data:', availabilityData);
      onComplete(availabilityData);
    } catch (error) {
      console.error('Failed to save availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const status = getStatusMessage();

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-6">
      <div className="w-full max-w-5xl">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center py-12 px-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#E5E3FB] rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-[#433CE7]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-3">
              Set Your Weekly Availability
            </CardTitle>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              You must maintain at least 12 hours/week bookable with 48-hour advance notice to remain active on ZaaN.
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-12">
            {/* Status and Counter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#433CE7]" />
                  <span className="font-medium text-lg">
                    Total Hours: <span className="text-[#433CE7]">{getTotalHours()}</span>
                  </span>
                </div>
                <div className="text-right">
                  <Badge 
                    className={`px-4 py-2 ${
                      status.type === 'success' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : status.type === 'warning'
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {status.type === 'success' && <Check className="w-4 h-4 mr-1" />}
                    {status.type === 'warning' && <AlertTriangle className="w-4 h-4 mr-1" />}
                    {meetsMinimum() ? 'Requirement Met' : `${MINIMUM_HOURS - getTotalHours()} hours needed`}
                  </Badge>
                </div>
              </div>
              
              <Alert className={`${
                status.type === 'success' 
                  ? 'border-green-200 bg-green-50' 
                  : status.type === 'warning'
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-blue-200 bg-blue-50'
              }`}>
                <AlertDescription className={`${
                  status.type === 'success' 
                    ? 'text-green-800' 
                    : status.type === 'warning'
                    ? 'text-orange-800'
                    : 'text-blue-800'
                }`}>
                  {status.message}
                </AlertDescription>
              </Alert>
            </div>

            {/* Quick Presets */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#433CE7]" />
                Quick Presets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    onClick={() => applyPreset(preset)}
                    className="h-auto p-4 text-left flex flex-col items-start hover:border-[#433CE7] hover:bg-[#E5E3FB]/50 transition-all"
                  >
                    <span className="font-medium text-foreground">{preset.name}</span>
                    <span className="text-sm text-muted-foreground">{preset.hours} hours/week</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-foreground mb-4">Weekly Schedule</h3>
              <div className="border border-border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-8 bg-[#E5E3FB] border-b border-border">
                  <div className="p-3 font-medium text-[#433CE7]">Time</div>
                  {DAYS.map(day => (
                    <div key={day} className="p-3 font-medium text-[#433CE7] text-center text-sm">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>
                
                {/* Time Slots */}
                {HOURS.map(hour => (
                  <div key={hour} className="grid grid-cols-8 border-b border-border last:border-b-0">
                    <div className="p-3 text-sm font-medium text-muted-foreground bg-gray-50 border-r border-border">
                      {formatTime(hour)}
                    </div>
                    {DAYS.map(day => {
                      const isSelected = selectedSlots.has(getSlotKey(day, hour));
                      return (
                        <button
                          key={`${day}-${hour}`}
                          onClick={() => toggleTimeSlot(day, hour)}
                          className={`p-3 text-center transition-all border-r border-border last:border-r-0 hover:bg-[#E5E3FB]/50 ${
                            isSelected 
                              ? 'bg-[#433CE7] text-white hover:bg-[#3730a3]' 
                              : 'bg-white hover:bg-[#E5E3FB]/30'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 mx-auto" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Timezone */}
              <div className="space-y-3">
                <label className="text-foreground font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#433CE7]" />
                  Timezone
                </label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="h-12 bg-input-background border-border rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar Sync */}
              <div className="space-y-3">
                <label className="text-foreground font-medium">Calendar Integration</label>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-muted-foreground">Sync with Google or Apple Calendar</p>
                    <p className="text-sm text-muted-foreground">Coming soon</p>
                  </div>
                  <Switch 
                    checked={false} 
                    disabled 
                    className="opacity-50" 
                  />
                </div>
              </div>
            </div>

            {/* Validation Warning */}
            {!meetsMinimum() && getTotalHours() > 0 && (
              <Alert className="border-destructive/20 bg-destructive/10 mb-8">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className="text-destructive">
                  You must select at least 12 bookable hours to proceed. Profiles with less than 12 hours/week availability may be deactivated.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="px-8 py-3"
              >
                Go Back
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!meetsMinimum() || isLoading}
                className="bg-[#433CE7] hover:bg-[#3730a3] text-white px-12 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving availability...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
