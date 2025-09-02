import { useState } from "react";
import { X, User, Mail, Phone, Calendar, AlertCircle, Camera, FileDown, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatDate, formatTime } from "@/utils/formatDateTime";
import { IAppointment } from "@/utils/datatypes";
import { DENTIST_ENDPOINT } from "@/utils/ApiConstants";
import { executor } from "@/http/executer";
// import Image from "next/image";

interface AppointmentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: IAppointment;
}

export function AppointmentDetails({ isOpen, onClose, appointment }: AppointmentDetailsProps) {
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleAppointmentStatus = async (status: string) => {
    try {
      // call api to confirm appointment
      const url = DENTIST_ENDPOINT.CONFIRM_APPOINTMENT;
      const payload = {
        appointmentId: appointment.appointment_id,
        appointmentStatus: status
      }
      const exe = executor("put", url);
      const axiosResponse = await exe.execute(payload);
      const apiBody = axiosResponse?.data;
      const appointmentData = apiBody?.data ?? apiBody;
      if (axiosResponse.status >= 200 && axiosResponse.status < 300 && appointmentData) {
        onClose();
      } else {
        console.log('Failed to change appointment status. Please try again.');
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadSummary = () => {
    console.log('Downloading appointment summary:', appointment.appointment_id);
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

  const getPainLevelColor = (painLevel: number) => {
    const level = painLevel;
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
                <span className="font-medium text-foreground">{appointment.patient_data.patient_name}</span>
              </div>

              {appointment.patient_data.patient_email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{appointment.patient_data.patient_email}</span>
                </div>
              )}

              {appointment.patient_data.patient_phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{appointment.patient_data.patient_phone}</span>
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
                    {formatDate(appointment.appointment_time)} – {formatTime(appointment.appointment_time)}
                  </p>
                </div>
              </div>

              {appointment.issue_reported && (
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Issue Reported</p>
                  <p className="text-sm text-muted-foreground">{appointment.issue_reported}</p>
                </div>
              )}

              {appointment.pain_level && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Pain Level</p>
                    <p className={`font-medium ${getPainLevelColor(appointment.pain_level)}`}>
                      {appointment.pain_level}
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
                  <Badge className={getStatusColor(appointment.appointment_status)}>
                    {appointment.appointment_status}
                  </Badge>
                </div>
              </div>

              {appointment.uploaded_photo && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E5E3FB] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Camera className="w-4 h-4 text-[#433CE7]" />
                    </div>
                    <p className="font-medium text-foreground">Uploaded Photo</p>
                  </div>
                  <div className="ml-11">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      {/* <ImageWithFallback
                        src={appointment.uploaded_photo}
                        alt="Patient uploaded image"
                        className="w-full h-full object-cover"
                      /> */}
                      <img
                        src={appointment.uploaded_photo}
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
          {appointment.appointment_notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Notes</h3>
                <div className="bg-[#E5E3FB]/20 rounded-lg p-4">
                  <p className="font-medium text-foreground mb-1">Patient's Note:</p>
                  <p className="text-sm text-muted-foreground italic">"{appointment.appointment_notes}"</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleAppointmentStatus('completed')}
                disabled={isMarkingCompleted || appointment.appointment_status === 'completed'}
                className="w-full bg-[#433CE7] hover:bg-[#3730a3] text-white"
              >
                {isMarkingCompleted ? (
                  <>
                    <div className="w-4 h-4 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Marking Complete...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark as Completed
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleAppointmentStatus('confirmed')}
                className="border-[#433CE7]/20 text-[#433CE7] hover:bg-[#E5E3FB]/30"
              >
                <FileDown className="w-4 h-4 mr-1" />
                Confirm
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleAppointmentStatus('rejected')}
                disabled={isCancelling || appointment.appointment_status === 'completed'}
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