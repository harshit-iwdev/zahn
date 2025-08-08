import { useState } from "react";
import { X, User, Mail, Phone, Calendar, AlertCircle, Camera, FileDown, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AppointmentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: number;
    patientName: string;
    time: string;
    status: string;
    type: string;
    date?: string;
    email?: string;
    phone?: string;
    issueReported?: string;
    painLevel?: string;
    uploadedPhoto?: string;
    notes?: string;
  };
}

export function AppointmentDetails({ isOpen, onClose, appointment }: AppointmentDetailsProps) {
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleMarkCompleted = async () => {
    setIsMarkingCompleted(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Appointment marked as completed:', appointment.id);
      onClose();
    } finally {
      setIsMarkingCompleted(false);
    }
  };

  const handleCancelAppointment = async () => {
    setIsCancelling(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Appointment cancelled:', appointment.id);
      onClose();
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadSummary = () => {
    console.log('Downloading appointment summary:', appointment.id);
    // In a real app, this would generate and download a PDF
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "completed": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getPainLevelColor = (painLevel: string) => {
    const level = parseInt(painLevel?.split('/')[0] || '0');
    if (level <= 3) return "text-green-600";
    if (level <= 6) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-medium text-foreground">
              Appointment Details
            </DialogTitle>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-muted rounded-full"
            >
              <X className="w-4 h-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Patient Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E5E3FB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#433CE7]" />
                </div>
                <span className="font-medium text-foreground">{appointment.patientName}</span>
              </div>

              {appointment.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{appointment.email}</span>
                </div>
              )}

              {appointment.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{appointment.phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Appointment Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Appointment Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E5E3FB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#433CE7]" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date || "Tuesday, August 12, 2025"} – {appointment.time}
                  </p>
                </div>
              </div>

              {appointment.issueReported && (
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Issue Reported</p>
                  <p className="text-sm text-muted-foreground">{appointment.issueReported}</p>
                </div>
              )}

              {appointment.painLevel && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Pain Level</p>
                    <p className={`font-medium ${getPainLevelColor(appointment.painLevel)}`}>
                      {appointment.painLevel}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-current opacity-60" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Status</p>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>

              {appointment.uploadedPhoto && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E5E3FB] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Camera className="w-4 h-4 text-[#433CE7]" />
                    </div>
                    <p className="font-medium text-foreground">Uploaded Photo</p>
                  </div>
                  <div className="ml-11">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={appointment.uploadedPhoto}
                        alt="Patient uploaded image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {appointment.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Notes</h3>
                <div className="bg-[#E5E3FB]/20 rounded-lg p-4">
                  <p className="font-medium text-foreground mb-1">Patient's Note:</p>
                  <p className="text-sm text-muted-foreground italic">"{appointment.notes}"</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleMarkCompleted}
              disabled={isMarkingCompleted || appointment.status === 'completed'}
              className="w-full bg-[#433CE7] hover:bg-[#3730a3] text-white"
            >
              {isMarkingCompleted ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Marking Complete...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleCancelAppointment}
                disabled={isCancelling || appointment.status === 'completed'}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 mr-1 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadSummary}
                className="border-[#433CE7]/20 text-[#433CE7] hover:bg-[#E5E3FB]/30"
              >
                <FileDown className="w-4 h-4 mr-1" />
                Summary
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}