// import { useState } from "react";
// import { Plus, Clock, Calendar } from "lucide-react";
// import { Button } from "./ui/button";
// import { TimeSlot } from "./TimeSlot";

// interface TimeSlotData {
//   id: string;
//   startTime: string;
//   endTime: string;
// }

// interface DayAvailability {
//   [key: string]: TimeSlotData[];
// }

// const daysOfWeek = [
//   'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
// ];

// const timeSlots = [
//   '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
//   '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
//   '6:00 PM', '7:00 PM'
// ];

// export function WeeklyAvailability() {
//   const [availability, setAvailability] = useState<DayAvailability>({
//     Monday: [
//       { id: '1', startTime: '9:00 AM', endTime: '12:00 PM' },
//       { id: '2', startTime: '2:00 PM', endTime: '6:00 PM' }
//     ],
//     Tuesday: [
//       { id: '3', startTime: '9:00 AM', endTime: '12:00 PM' },
//       { id: '4', startTime: '2:00 PM', endTime: '6:00 PM' }
//     ],
//     Wednesday: [
//       { id: '5', startTime: '9:00 AM', endTime: '12:00 PM' }
//     ],
//     Thursday: [
//       { id: '6', startTime: '9:00 AM', endTime: '12:00 PM' },
//       { id: '7', startTime: '2:00 PM', endTime: '6:00 PM' }
//     ],
//     Friday: [
//       { id: '8', startTime: '9:00 AM', endTime: '3:00 PM' }
//     ],
//     Saturday: [],
//     Sunday: []
//   });

//   const addTimeSlot = (day: string) => {
//     const newSlot: TimeSlotData = {
//       id: Date.now().toString(),
//       startTime: '9:00 AM',
//       endTime: '5:00 PM'
//     };
    
//     setAvailability(prev => ({
//       ...prev,
//       [day]: [...(prev[day] || []), newSlot]
//     }));
//   };

//   const editTimeSlot = (day: string, slotId: string) => {
//     // In a real app, this would open a time picker modal
//     console.log('Edit time slot:', day, slotId);
//   };

//   const deleteTimeSlot = (day: string, slotId: string) => {
//     setAvailability(prev => ({
//       ...prev,
//       [day]: prev[day].filter(slot => slot.id !== slotId)
//     }));
//   };

//   // Helper function to check if a time slot overlaps with existing slots
//   const isTimeSlotOccupied = (day: string, time: string) => {
//     return availability[day]?.some(slot => {
//       const slotStart = slot.startTime;
//       const slotEnd = slot.endTime;
//       return time >= slotStart && time < slotEnd;
//     });
//   };

//   // Helper function to get slots for a specific time
//   const getSlotsAtTime = (day: string, time: string) => {
//     return availability[day]?.filter(slot => {
//       const slotStart = slot.startTime;
//       const slotEnd = slot.endTime;
//       return time >= slotStart && time < slotEnd;
//     }) || [];
//   };

//   return (
//     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-[#E5E3FB] rounded-full flex items-center justify-center">
//             <Calendar className="w-5 h-5 text-[#433CE7]" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900 text-lg">Weekly Availability</h3>
//             <p className="text-sm text-gray-600">Set your working hours for each day of the week</p>
//           </div>
//         </div>
//         <Button
//           size="sm"
//           className="bg-[#433CE7] hover:bg-[#3730a3] text-white"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Day
//         </Button>
//       </div>
      
//       {/* Calendar Grid */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[900px]">
//           {/* Header Row - Days as Columns */}
//           <div className="grid grid-cols-8 gap-1 mb-2">
//             <div className="w-24 h-12 flex items-center justify-center">
//               <div className="flex items-center space-x-2 text-sm text-gray-600">
//                 <Clock className="w-4 h-4" />
//                 <span className="font-medium">Time</span>
//               </div>
//             </div>
//             {daysOfWeek.map(day => (
//               <div key={day} className="h-12 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
//                 <h4 className="font-medium text-gray-900 text-sm">{day.slice(0, 3)}</h4>
//                 <p className="text-xs text-gray-600">{day}</p>
//               </div>
//             ))}
//           </div>

//           {/* Time Slots as Rows */}
//           <div className="space-y-1">
//             {timeSlots.map(time => (
//               <div key={time} className="grid grid-cols-8 gap-1">
//                 {/* Time Label Row */}
//                 <div className="w-24 h-12 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
//                   <div className="text-sm text-gray-700 font-medium">
//                     {time}
//                   </div>
//                 </div>
                
//                 {/* Day Columns for this time slot */}
//                 {daysOfWeek.map(day => {
//                   const slotsAtTime = getSlotsAtTime(day, time);
//                   const isOccupied = isTimeSlotOccupied(day, time);
                  
//                   return (
//                     <div key={`${day}-${time}`} className="h-12 border border-gray-200 rounded-lg relative">
//                       {slotsAtTime.length > 0 ? (
//                         <div className="h-full bg-[#E5E3FB] rounded-lg flex items-center justify-center">
//                           <div className="text-xs text-[#433CE7] font-medium text-center px-1">
//                             <div className="truncate">
//                               {slotsAtTime.map(slot => (
//                                 <div key={slot.id} className="truncate">
//                                   {slot.startTime} - {slot.endTime}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="h-full flex items-center justify-center">
//                           <div className="w-2 h-2 bg-gray-200 rounded-full opacity-50"></div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Add Slot Buttons Row */}
//       <div className="mt-4">
//         <div className="grid grid-cols-8 gap-1">
//           <div className="w-24 h-10"></div> {/* Empty space */}
//           {daysOfWeek.map(day => (
//             <div key={day} className="h-10 flex items-center justify-center">
//               <Button
//                 size="sm"
//                 onClick={() => addTimeSlot(day)}
//                 className="bg-[#433CE7] hover:bg-[#3730a3] text-white h-8 text-xs"
//               >
//                 <Plus className="w-3 h-3 mr-1" />
//                 Add Slot
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Detailed Time Slots List */}
//       <div className="mt-8">
//         <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
//           <Clock className="w-4 h-4" />
//           <span>Detailed Schedule</span>
//         </h4>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {daysOfWeek.map(day => (
//             <div key={day} className="border border-gray-200 rounded-lg p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h5 className="font-medium text-gray-900">{day}</h5>
//                 <span className="text-xs text-gray-500">
//                   {availability[day]?.length || 0} slots
//                 </span>
//               </div>
              
//               {availability[day]?.length > 0 ? (
//                 <div className="space-y-2">
//                   {availability[day].map(slot => (
//                     <TimeSlot
//                       key={slot.id}
//                       startTime={slot.startTime}
//                       endTime={slot.endTime}
//                       onEdit={() => editTimeSlot(day, slot.id)}
//                       onDelete={() => deleteTimeSlot(day, slot.id)}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500 italic">No availability set</p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
