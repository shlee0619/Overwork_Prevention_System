import { Employee, AttendanceRecord } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'E001', name: 'Tony Stark', department: 'Engineering Lead', avatarPlaceholder: 'https://picsum.photos/200/200?random=5', password: '1234' },
  { id: 'E002', name: 'Sarah Connor', department: 'Security', avatarPlaceholder: 'https://picsum.photos/200/200?random=2', password: '1234' },
  { id: 'E003', name: 'Alex Murphy', department: 'Operations', avatarPlaceholder: 'https://picsum.photos/200/200?random=3', password: '1234' },
  { id: 'E004', name: 'Ellen Ripley', department: 'Logistics', avatarPlaceholder: 'https://picsum.photos/200/200?random=4', password: '1234' },
  { id: 'E005', name: 'Diana Prince', department: 'Management', avatarPlaceholder: 'https://picsum.photos/200/200?random=1', password: '1234' },
  { id: 'E006', name: 'Bruce Banner', department: 'R&D Lab', avatarPlaceholder: 'https://picsum.photos/200/200?random=6', password: '1234' },
];

export const THRESHOLDS = {
  HEART_RATE_HIGH: 100,
  HEART_RATE_LOW: 50,
  SPO2_LOW: 95,
  STRESS_HIGH: 80,
};

export const INITIAL_RECORDS: AttendanceRecord[] = [
  {
    id: 'risk-record-001',
    employeeId: 'E006',
    employeeName: 'Bruce Banner',
    department: 'R&D Lab',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    photoUrl: 'https://picsum.photos/200/200?random=6',
    metrics: {
      heartRate: 145,
      respirationRate: 28,
      spo2: 92,
      bloodPressureSys: 155,
      bloodPressureDia: 95,
      stressLevel: 98,
    },
    status: 'RISK',
    aiAnalysis: 'CRITICAL: Subject displays extreme physiological distress. Heart rate and stress levels indicate imminent risk of burnout or cardiac event. Immediate removal from high-stress environment recommended.',
  }
];