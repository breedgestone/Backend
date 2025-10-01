export enum AppointmentStatus {
  PENDING = 'pending', // Payment not completed
  SCHEDULED = 'scheduled', // Payment completed, awaiting appointment
  CONFIRMED = 'confirmed', // Agent/admin confirmed
  COMPLETED = 'completed', // Service completed
  CANCELLED = 'cancelled', // Cancelled by user or agent
}
