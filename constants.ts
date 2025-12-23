import { Employee, AttendanceRecord } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'E001', name: 'Tony Stark', department: '엔지니어링 리드', avatarPlaceholder: 'https://picsum.photos/200/200?random=5', password: '1234' },
  { id: 'E002', name: 'Sarah Connor', department: '보안팀', avatarPlaceholder: 'https://picsum.photos/200/200?random=2', password: '1234' },
  { id: 'E003', name: 'Alex Murphy', department: '운영팀', avatarPlaceholder: 'https://picsum.photos/200/200?random=3', password: '1234' },
  { id: 'E004', name: 'Ellen Ripley', department: '물류팀', avatarPlaceholder: 'https://picsum.photos/200/200?random=4', password: '1234' },
  { id: 'E005', name: 'Diana Prince', department: '경영지원', avatarPlaceholder: 'https://picsum.photos/200/200?random=1', password: '1234' },
  { id: 'E006', name: 'Bruce Banner', department: 'R&D 연구소', avatarPlaceholder: 'https://picsum.photos/200/200?random=6', password: '1234' },
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
    department: 'R&D 연구소',
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
    aiAnalysis: '경고: 대상자는 극심한 생리적 스트레스 징후를 보입니다. 심박수와 스트레스 수치가 과로 또는 심혈관 질환 위험 임계치를 초과했습니다. 고스트레스 환경에서 즉각적인 격리 및 휴식이 필요합니다.',
  }
];