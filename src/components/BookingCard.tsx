import { Calendar, Clock, User, FileText, Image, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatDate, formatTime } from "@/utils/formatDateTime";

interface BookingCardProps {
  booking: {
    appointment_id: string,
    appointment_time: string,
    issue_reported: string,
    pain_level: number,
    appointment_status: string,
    patient_data: {
        patient_id: string,
        patient_name: string,
        patient_email: string,
        patient_phone: string
    },
    dentist_data: {
        dentist_id: string,
        dentist_name: string,
        dentist_email: string,
        dentist_phone: string
    },
    appointment_notes: string,
    uploaded_photo: string,
    created_at: string
};
  handleBookingStatus: (id: string, status: string) => void;
}

export function BookingCard({ booking, handleBookingStatus }: BookingCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with Patient Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{booking.patient_data.patient_name}</h3>
            <p className="text-sm text-gray-600">{booking.patient_data.patient_id}</p>
          </div>
        </div>
        
        {booking.appointment_status === 'completed' && (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )}
        {booking.appointment_status === 'cancelled' && (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        )}
      </div>

      {/* Appointment Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{formatDate(new Date(booking.appointment_time).toISOString())}</span>
          <Clock className="w-4 h-4 text-gray-500 ml-2" />
          <span>{formatTime(new Date(booking.appointment_time).toISOString())}</span>
        </div>
        
        <div className="flex items-start space-x-2">
          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Issue Type</p>
            <p className="text-gray-700">{booking.issue_reported}</p>
          </div>
        </div>

        {booking.appointment_notes && (
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Additional Notes</p>
              <p className="text-gray-700 text-sm italic">"{booking.appointment_notes}"</p>
            </div>
          </div>
        )}

        {booking.uploaded_photo && (
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Image uploaded</span>
            {booking.uploaded_photo && (
              <div className="ml-2">
                <ImageWithFallback
                  src={booking.uploaded_photo}
                  alt="Patient uploaded image"
                  className="w-12 h-12 object-cover rounded border border-gray-200"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {booking.appointment_status === 'confirmed' && (
        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <Button
            onClick={() => handleBookingStatus(booking.appointment_id, 'completed')}
            className="flex-1 bg-[#433CE7] hover:bg-[#3730a3] text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark as Done
          </Button>
          <Button
            onClick={() => handleBookingStatus(booking.appointment_id, 'rejected')}
            variant="outline"
            className="flex-1 bg-[#E5E3FB] border-[#E5E3FB] text-gray-700 hover:bg-[#d4d1f9]"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
      {booking.appointment_status === 'pending' && (
        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <Button
            onClick={() => handleBookingStatus(booking.appointment_id, 'confirmed')}
            className="flex-1 bg-[#433CE7] hover:bg-[#3730a3] text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm
          </Button>
          <Button
            onClick={() => handleBookingStatus(booking.appointment_id, 'rejected')}
            variant="outline"
            className="flex-1 bg-[#E5E3FB] border-[#E5E3FB] text-gray-700 hover:bg-[#d4d1f9]"
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}