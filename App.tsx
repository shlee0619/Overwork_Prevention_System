import React, { useState, useMemo } from 'react';
import { ViewState, AttendanceRecord, Employee } from './types';
import { INITIAL_RECORDS } from './constants';
import AttendanceTerminal from './components/AttendanceTerminal';
import EmployeeView from './components/EmployeeView';
import ManagerDashboard from './components/ManagerDashboard';
import LoginScreen from './components/LoginScreen';
import { LayoutDashboard, UserCircle, ScanLine } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('TERMINAL');
  // Initialize with the mock records containing Bruce Banner
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
  
  // Authentication State
  const [loggedInEmployee, setLoggedInEmployee] = useState<Employee | null>(null);

  const handleScanComplete = (record: AttendanceRecord) => {
    // Just add the record to the database
    setRecords(prev => [record, ...prev]);
  };

  const handleLogin = (employee: Employee) => {
    setLoggedInEmployee(employee);
  };

  const handleLogout = () => {
    setLoggedInEmployee(null);
  };

  // Filter records to get history for the LOGGED-IN employee (not necessarily the last scanned one)
  const employeeHistory = useMemo(() => {
    if (!loggedInEmployee) return [];
    return records
      .filter(r => r.employeeId === loggedInEmployee.id)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Sort old to new for charts
  }, [records, loggedInEmployee]);

  // Determine latest record for the dashboard view of the logged in user
  const latestEmployeeRecord = useMemo(() => {
    if (employeeHistory.length === 0) return null;
    return employeeHistory[employeeHistory.length - 1];
  }, [employeeHistory]);

  const NavButton = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center p-3 w-20 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-lg scale-105' 
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
      }`}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* Sidebar / Bottom Bar Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4 p-2 bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl">
        <NavButton view="TERMINAL" icon={ScanLine} label="Scan" />
        <NavButton view="EMPLOYEE" icon={UserCircle} label="My App" />
        <NavButton view="MANAGER" icon={LayoutDashboard} label="Admin" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative w-full h-full">
        {currentView === 'TERMINAL' && (
          <AttendanceTerminal 
            onScanComplete={handleScanComplete} 
          />
        )}
        
        {currentView === 'EMPLOYEE' && (
          loggedInEmployee ? (
            <EmployeeView 
              employee={loggedInEmployee}
              latestRecord={latestEmployeeRecord} 
              history={employeeHistory}
              onLogout={handleLogout}
            />
          ) : (
            <LoginScreen onLogin={handleLogin} />
          )
        )}
        
        {currentView === 'MANAGER' && (
          <ManagerDashboard records={records} />
        )}
      </main>

      {/* Intro Toast for Demo Context (Only on Terminal) */}
      {records.length === INITIAL_RECORDS.length && currentView === 'TERMINAL' && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-blue-900/80 text-blue-100 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-500/30 animate-pulse pointer-events-none z-40">
           Demo: Please allow camera access to start attendance.
        </div>
      )}
    </div>
  );
};

export default App;