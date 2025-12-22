import React, { useMemo, useState } from 'react';
import { AttendanceRecord } from '../types';
import { ShieldAlert, CheckCircle, Search, Filter, Lock, Coffee, AlertTriangle } from 'lucide-react';

interface ManagerDashboardProps {
  records: AttendanceRecord[];
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ records }) => {
  const [filter, setFilter] = useState<'ALL' | 'RISK'>('ALL');

  // Logic: Sort by Risk first, then by date descending. Privacy filter: don't show photos.
  const processedRecords = useMemo(() => {
    let data = [...records];
    
    if (filter === 'RISK') {
      data = data.filter(r => r.status === 'RISK');
    }

    return data.sort((a, b) => {
      // Priority 1: Risk status
      if (a.status === 'RISK' && b.status !== 'RISK') return -1;
      if (a.status !== 'RISK' && b.status === 'RISK') return 1;
      // Priority 2: Timestamp (newest first)
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [records, filter]);

  const riskCount = records.filter(r => r.status === 'RISK').length;

  return (
    <div className="h-full bg-gray-50 flex flex-col text-gray-900">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Workforce Safety Monitor</h1>
          <p className="text-gray-500 text-sm">Real-time health status dashboard</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-lg flex items-center gap-3">
             <div className="bg-red-100 p-2 rounded-full">
                <ShieldAlert className="w-5 h-5 text-red-600" />
             </div>
             <div>
                <span className="block text-xs font-bold text-red-800 uppercase">Risk Alerts</span>
                <span className="block text-xl font-bold text-red-600">{riskCount}</span>
             </div>
          </div>
          <div className="bg-green-50 border border-green-100 px-4 py-2 rounded-lg flex items-center gap-3">
             <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
             </div>
             <div>
                <span className="block text-xs font-bold text-green-800 uppercase">Active / Safe</span>
                <span className="block text-xl font-bold text-green-600">{records.length - riskCount}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-4 flex justify-between items-center">
        <div className="flex gap-2">
            <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
            >
                All Records
            </button>
            <button 
                onClick={() => setFilter('RISK')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'RISK' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
            >
                Risk Only
            </button>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search employee..." 
                className="pl-9 pr-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Metrics Overview</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {processedRecords.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        processedRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {record.status === 'RISK' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            <ShieldAlert className="w-3.5 h-3.5" /> Risk Detected
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle className="w-3.5 h-3.5" /> Good
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {/* Privacy Filter: No real photo, generic avatar */}
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <Lock size={14} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                                            <div className="text-xs text-gray-500">{record.employeeId} &bull; {record.department}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                    {record.timestamp.toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-gray-500 font-medium">
                                            HR: {record.metrics.heartRate} bpm <span className="text-gray-300">|</span> Stress: {record.metrics.stressLevel}/100
                                        </span>
                                        {record.aiAnalysis && (
                                            <div className="text-[10px] text-gray-400 bg-gray-50 p-1 rounded border border-gray-100 max-w-xs truncate" title={record.aiAnalysis}>
                                                AI: {record.aiAnalysis}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {record.status === 'RISK' ? (
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-red-900/20 flex items-center gap-2 ml-auto">
                                            <Coffee size={14} /> Force Break
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400">No action required</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;