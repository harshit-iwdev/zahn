import { X, Mail, Phone, Calendar, AlertCircle, Camera, Download, Check, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    patientName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    issue: string;
    painLevel: string;
    hasPhoto: boolean;
    photoUrl?: string;
    patientNote: string;
  };
}

export function AppointmentModal({ isOpen, onClose, appointment }: AppointmentModalProps) {
  const handleMarkCompleted = () => {
    // Handle mark as completed logic
    console.log("Marking appointment as completed");
    onClose();
  };

  const handleCancelAppointment = () => {
    // Handle cancel appointment logic
    console.log("Canceling appointment");
    onClose();
  };

  const handleDownloadSummary = () => {
    // Handle download summary logic
    console.log("Downloading appointment summary");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Appointment Details
          </DialogTitle>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Patient Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {appointment.patientName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appointment.patientName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{appointment.email}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{appointment.phone}</span>
              </div>
            </div>
          </div>

          {/* Appointment Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Appointment Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Date & Time</p>
                  <p className="text-gray-600">{appointment.date} – {appointment.time}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Issue Reported</p>
                <p className="text-gray-600">{appointment.issue}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">Pain Level</p>
                  <p className="text-gray-600">{appointment.painLevel}</p>
                </div>
              </div>
              
              {appointment.hasPhoto && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-900">Uploaded Photo</p>
                  </div>
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    {appointment.photoUrl ? (
                      <ImageWithFallback
                        src={appointment.photoUrl}
                        alt="Patient uploaded photo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Notes
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">Patient's Note:</p>
              <p className="text-gray-600 italic">"{appointment.patientNote}"</p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button 
            onClick={handleMarkCompleted}
            className="flex-1 bg-[#433CE7] hover:bg-[#3730a3] text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark as Completed
          </Button>
          
          <Button 
            onClick={handleCancelAppointment}
            variant="outline"
            className="flex-1 bg-[#E5E3FB] border-[#E5E3FB] text-gray-700 hover:bg-[#d4d1f9]"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Appointment
          </Button>
          
          <Button 
            onClick={handleDownloadSummary}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Summary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}