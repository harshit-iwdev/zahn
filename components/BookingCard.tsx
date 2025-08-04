import { useState } from "react";
import { Calendar, Clock, User, FileText, Image, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BookingCardProps {
  booking: {
    id: string;
    patientName: string;
    patientId: string;
    date: string;
    time: string;
    issueType: string;
    notes?: string;
    hasImage?: boolean;
    imageUrl?: string;
    status: 'upcoming' | 'completed' | 'cancelled';
  };
  onMarkDone?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function BookingCard({ booking, onMarkDone, onCancel }: BookingCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMarkDone = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onMarkDone?.(booking.id);
    setIsProcessing(false);
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onCancel?.(booking.id);
    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with Patient Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{booking.patientName}</h3>
            <p className="text-sm text-gray-600">{booking.patientId}</p>
          </div>
        </div>
        
        {booking.status === 'completed' && (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )}
        {booking.status === 'cancelled' && (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        )}
      </div>

      {/* Appointment Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{booking.date}</span>
          <Clock className="w-4 h-4 text-gray-500 ml-2" />
          <span>{booking.time}</span>
        </div>
        
        <div className="flex items-start space-x-2">
          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Issue Type</p>
            <p className="text-gray-700">{booking.issueType}</p>
          </div>
        </div>

        {booking.notes && (
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Additional Notes</p>
              <p className="text-gray-700 text-sm italic">"{booking.notes}"</p>
            </div>
          </div>
        )}

        {booking.hasImage && (
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Image uploaded</span>
            {booking.imageUrl && (
              <div className="ml-2">
                <ImageWithFallback
                  src={booking.imageUrl}
                  alt="Patient uploaded image"
                  className="w-12 h-12 object-cover rounded border border-gray-200"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {booking.status === 'upcoming' && (
        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <Button
            onClick={handleMarkDone}
            disabled={isProcessing}
            className="flex-1 bg-[#433CE7] hover:bg-[#3730a3] text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Mark as Done'}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isProcessing}
            variant="outline"
            className="flex-1 bg-[#E5E3FB] border-[#E5E3FB] text-gray-700 hover:bg-[#d4d1f9]"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}