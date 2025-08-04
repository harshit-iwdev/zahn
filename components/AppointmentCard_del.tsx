import { useState } from "react";
import { Clock, User } from "lucide-react";
import { Button } from "./ui/button";
import { AppointmentModal } from "./AppointmentModal";

interface AppointmentCardProps {
  patientName: string;
  time: string;
  issue: string;
  type: 'upcoming' | 'past';
  date?: string;
  status?: string;
}

export function AppointmentCard({ 
  patientName, 
  time, 
  issue, 
  type, 
  date, 
  status 
}: AppointmentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock appointment data for the modal
  const appointmentData = {
    patientName,
    email: "jane.doe@email.com",
    phone: "+1 234 567 8900",
    date: "Tuesday, August 12, 2025",
    time: time,
    issue: issue,
    painLevel: "7/10",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=face",
    patientNote: "Pain started 3 days ago, worsens while eating."
  };

  const handleViewClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={`p-4 rounded-lg border ${
        type === 'upcoming' 
          ? 'border-gray-200 bg-white shadow-sm' 
          : 'border-gray-100 bg-gray-50'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <User className="w-4 h-4 text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-900">{patientName}</h4>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock className="w-4 h-4 mr-1" />
              <span>{type === 'past' && date ? `${date} • ` : ''}{time}</span>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{issue}</p>
            
            {type === 'past' && status && (
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                {status}
              </span>
            )}
          </div>
          
          <div className="ml-4">
            {type === 'upcoming' ? (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleViewClick}
              >
                View
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                className="bg-[#E5E3FB] border-[#E5E3FB] text-gray-700 hover:bg-[#d4d1f9]"
                onClick={handleViewClick}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={appointmentData}
      />
    </>
  );
}