<div align="center">
  
  # 🛡️ 과로사 방지 근태 관리 시스템 (Sentinel Health)
  
  **AI 기반 실시간 건강 모니터링 및 위험 감지 솔루션**
  <br/>
  <em>"출퇴근이 곧 건강검진이 되는 안전한 일터"</em>
</div>

<br/>

## 📖 프로젝트 소개
이 프로젝트는 근로자의 출퇴근 시 얼굴 스캔을 통해 생체 신호(심박수, 스트레스 지수, 산소포화도 등)를 측정하고, **Google Gemini AI**를 활용하여 건강 상태를 분석하는 웹 애플리케이션 데모입니다. 과로사 위험 징후를 조기에 발견하여 관리자와 근로자에게 알림을 제공합니다.

> **참고:** 본 프로젝트는 프로토타입으로, rPPG(원격 광용적맥파) 측정 기능은 시뮬레이션 데이터로 동작합니다.

## ✨ 주요 기능

### 1. 📷 스마트 근태 단말기 (`AttendanceTerminal`)
- **얼굴 인식 기반 출석 체크**: 카메라를 통한 비접촉식 스캔
- **실시간 생체 신호 측정**: 심박수(BPM), 산소포화도(SpO2), 혈압, 스트레스 지수 시뮬레이션
- **AI 건강 분석**: 측정된 데이터를 바탕으로 Gemini AI가 현재 상태(정상/위험) 판별 및 코멘트 제공

### 2. 👤 직원용 모바일 앱 (`EmployeeView`)
- **개인 건강 대시보드**: 자신의 최근 건강 지표 및 AI 분석 결과 확인
- **히스토리 트래킹**: 시간대별 건강 추세 그래프 제공
- **프라이버시 보호**: 본인 인증을 통한 개인 데이터 접근

### 3. 🖥️ 관리자 대시보드 (`ManagerDashboard`)
- **실시간 위험 모니터링**: 전체 직원의 건강 상태를 '신호등(Risk/Good)' 형태로 시각화
- **위험군 관리**: 이상 징후 발생 시 타임라인 분석 및 휴식 권고 기능
- **데이터 분석**: 부서별/시간대별 건강 데이터 통계

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Visualization**: Recharts (데이터 시각화)
- **Icons**: Lucide React

## 🚀 시작하기 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하기 위한 가이드입니다.

### 사전 요구사항 (Prerequisites)
- **Node.js** (v18 이상 권장)
- **Google Gemini API Key** (AI Studio에서 발급 필요)

### 설치 및 실행 (Installation)

1. **프로젝트 클론 및 의존성 설치**
   ```bash
   npm install
