export type ViewState = 'TERMINAL' | 'EMPLOYEE' | 'MANAGER';

export type HealthStatus = 'GOOD' | 'RISK';

export interface RPPGMetrics {
  heartRate: number; // bpm
  respirationRate: number; // rpm
  spo2: number; // %
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  stressLevel: number; // 0-100
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  avatarPlaceholder: string;
  password?: string; // Added for login simulation
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  timestamp: Date;
  photoUrl: string; // Base64 or URL
  metrics: RPPGMetrics;
  status: HealthStatus;
  aiAnalysis: string | null;
}