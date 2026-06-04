export type Appointment = {
  id: number;
  doctor_id: number;
  patient_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type UpdateAppointmentRequest = {
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
};

export type CreateAppointmentRequest = {
  doctor_id: number;
  patient_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
};