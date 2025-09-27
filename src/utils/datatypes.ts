export interface IAppointment {
    appointment_id: string;
    appointment_time: string;
    issue_reported: string;
    pain_level: number;
    appointment_status: string;
    patient_data: {
        patient_id: string;
        patient_name: string;
        patient_email: string;
        patient_phone: string;
    };
    dentist_data: {
        dentist_id: string;
        dentist_name: string;
        dentist_email: string;
        dentist_phone: string;
    };
    appointment_notes: string;
    uploaded_photo: string;
    created_at: string;
}
