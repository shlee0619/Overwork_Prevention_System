import React, { useMemo, useState } from 'react';
import { AttendanceRecord } from '../types';
import { 
  ShieldAlert, CheckCircle, Search, Lock, Coffee, 
  ArrowLeft, Mail, Phone, Calendar, Clock, 
  Activity, AlertTriangle, ChevronRight, MoreHorizontal 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ManagerDashboardProps {
  records: AttendanceRecord[];
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ records }) => {
  const [filter, setFilter] = useState<'ALL' | 'RISK'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Logic: Sort by Risk first, then by date descending.
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

  // --- Detail View Component ---
  const renderDetailView = (record: AttendanceRecord) => {
    const isRisk = record.status === 'RISK';
    
    // Mock Data for the visual layout
    const dataQuality = [
        { name: 'Recognized', value: 92, color: '#3b82f6' },
        { name: 'Lost', value: 8, color: '#e5e7eb' }
    ];

    return (
      <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
        {/* Breadcrumb / Back Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
            <button 
                onClick={() => setSelectedRecord(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
            >
                <ArrowLeft size={16} /> Back to List
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 text-sm">Employees</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 text-sm font-semibold">{record.employeeName}</span>
        </div>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow-sm overflow-hidden">
                             {/* Privacy safe placeholder if needed, otherwise use photoUrl */}
                             <img src={record.photoUrl} alt={record.employeeName} className="w-full h-full object-cover" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${isRisk ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{record.employeeName}</h1>
                        <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                            <span>ID: {record.employeeId}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>Joined 2021</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
                                Dept: {record.department}
                            </span>
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
                                Shift: Morning A
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                    {/* Stats */}
                    <div className="flex gap-6 border-r border-gray-200 pr-6 hidden lg:flex">
                        <div>
                            <div className="text-xs text-gray-500 font-medium uppercase">Avg HR</div>
                            <div className="text-xl font-bold text-gray-900">{record.metrics.heartRate} <span className="text-sm font-normal text-gray-400">bpm</span></div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-medium uppercase">Risk Score</div>
                            <div className={`text-xl font-bold ${isRisk ? 'text-red-600' : 'text-green-600'}`}>
                                {isRisk ? 'Critical' : 'Low'}
                            </div>
                        </div>
                         <div>
                            <div className="text-xs text-gray-500 font-medium uppercase">Last 7d</div>
                            <div className="text-xl font-bold text-gray-900">42h</div>
                        </div>
                    </div>

                    <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2">
                        <Mail size={16} /> Contact Employee
                    </button>
                </div>
            </div>

            {/* Tabs (Visual Only) */}
            <div className="border-b border-gray-200 flex gap-8 px-2">
                <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">Risk Timeline</button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">Attendance Log</button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">Notifications</button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">Data Quality</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="text-blue-600" size={20}/> 
                            Today's Timeline
                        </h2>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button className="px-3 py-1 text-xs font-medium text-gray-500">Previous</button>
                            <button className="px-3 py-1 text-xs font-medium bg-white text-gray-900 shadow-sm rounded-md">Today</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-500">Next</button>
                        </div>
                    </div>

                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
                        {/* Timeline Item 1: Shift Start (Mock) */}
                        <div className="relative pl-8">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-300"></div>
                            <span className="text-xs text-gray-400 absolute -left-20 top-1 w-12 text-right">08:00 AM</span>
                            
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-bold text-gray-900">Shift Check-In</h3>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Normal</span>
                                </div>
                                <div className="grid grid-cols-4 gap-4 text-xs">
                                    <div>
                                        <div className="text-gray-400 uppercase tracking-wider text-[10px]">Body Temp</div>
                                        <div className="font-semibold text-gray-700">98.4°F</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 uppercase tracking-wider text-[10px]">Heart Rate</div>
                                        <div className="font-semibold text-gray-700">72 bpm</div>
                                    </div>
                                     <div>
                                        <div className="text-gray-400 uppercase tracking-wider text-[10px]">BP</div>
                                        <div className="font-semibold text-gray-700">120/80</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 uppercase tracking-wider text-[10px]">Hydration</div>
                                        <div className="font-semibold text-gray-700">Good</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Item 2: Lunch (Mock) */}
                        <div className="relative pl-8">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-300"></div>
                            <span className="text-xs text-gray-400 absolute -left-20 top-1 w-12 text-right">12:30 PM</span>
                            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                                    <Coffee size={14} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-700">Lunch Break</h3>
                                    <p className="text-xs text-gray-400">Duration: 45m</p>
                                </div>
                            </div>
                        </div>

                         {/* Timeline Item 3: Actual Record */}
                         <div className="relative pl-8">
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ring-1 ${isRisk ? 'bg-red-500 ring-red-200' : 'bg-green-500 ring-green-200'}`}></div>
                            <span className="text-xs text-gray-400 absolute -left-20 top-1 w-12 text-right">
                                {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            
                            <div className={`p-5 rounded-lg border shadow-sm ${isRisk ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        {isRisk ? <ShieldAlert className="text-red-600" size={20} /> : <CheckCircle className="text-green-600" size={20} />}
                                        <h3 className={`text-sm font-bold ${isRisk ? 'text-red-900' : 'text-gray-900'}`}>
                                            {isRisk ? 'Health Risk Alert Detected' : 'Routine Health Check'}
                                        </h3>
                                    </div>
                                    {isRisk && (
                                        <button className="bg-white border border-red-200 text-red-600 px-3 py-1 rounded text-xs font-semibold hover:bg-red-50">
                                            Investigate
                                        </button>
                                    )}
                                </div>
                                
                                {/* Metrics Viz */}
                                <div className="flex items-end gap-1 h-12 mb-4 opacity-80">
                                    {Array.from({length: 20}).map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`w-full rounded-t-sm ${isRisk ? 'bg-red-400' : 'bg-green-400'}`}
                                            style={{ height: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.5 }}
                                        ></div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-sm">
                                        <span className="block text-xs text-gray-500 uppercase">Heart Rate</span>
                                        <span className={`font-mono font-bold ${isRisk ? 'text-red-700' : 'text-gray-900'}`}>{record.metrics.heartRate} bpm</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="block text-xs text-gray-500 uppercase">Stress Lvl</span>
                                        <span className={`font-mono font-bold ${isRisk ? 'text-red-700' : 'text-gray-900'}`}>{record.metrics.stressLevel}/100</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* Future Mock */}
                         <div className="relative pl-8 opacity-50">
                            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-gray-100 border border-gray-300"></div>
                            <span className="text-xs text-gray-300 absolute -left-20 top-1 w-12 text-right">05:00 PM</span>
                            <div className="p-3 rounded-lg border border-gray-100 bg-white">
                                <h3 className="text-sm font-medium text-gray-400">Scheduled Shift End</h3>
                                <p className="text-xs text-gray-300">Upcoming</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & Quality */}
                <div className="space-y-6">
                    
                    {/* Data Quality Card */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data Quality</h3>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">Good</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dataQuality}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={40}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {dataQuality.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-gray-900">92%</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Low Illumination</span>
                                        <span className="font-semibold text-gray-900">4%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-400 w-[4%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Motion Blur</span>
                                        <span className="font-semibold text-gray-900">2%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-400 w-[2%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis / Blackbox */}
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <div className="flex items-start gap-3 mb-3">
                            <Activity className="text-blue-600 mt-1" size={18} />
                            <h3 className="text-sm font-bold text-blue-900">AI Health Insight</h3>
                        </div>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            {record.aiAnalysis || "Algorithm weighting adjusted for Warehouse Logistics role. Strictness on 'Motion Blur' is reduced by 15% to account for rapid package handling movements."}
                        </p>
                        <div className="flex gap-2 mt-4">
                            <span className="px-2 py-1 bg-white border border-blue-200 text-blue-700 text-[10px] font-medium rounded">Confidence: High</span>
                            <span className="px-2 py-1 bg-white border border-blue-200 text-blue-700 text-[10px] font-medium rounded">Threshold: 0.65</span>
                        </div>
                    </div>

                    {/* Recent Attendance Mini Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Attendance</h3>
                            <button className="text-blue-600 text-xs font-medium hover:underline">View All</button>
                        </div>
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-5 py-2 font-medium">Date</th>
                                    <th className="px-5 py-2 font-medium">In</th>
                                    <th className="px-5 py-2 font-medium text-right">Out</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-5 py-3 text-gray-900 font-medium">Oct 23</td>
                                    <td className="px-5 py-3 text-gray-500">07:55</td>
                                    <td className="px-5 py-3 text-gray-500 text-right">17:05</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 text-gray-900 font-medium">Oct 22</td>
                                    <td className="px-5 py-3 text-gray-500">08:02</td>
                                    <td className="px-5 py-3 text-gray-500 text-right">17:00</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 text-gray-900 font-medium">Oct 21</td>
                                    <td className="px-5 py-3 text-gray-500">07:58</td>
                                    <td className="px-5 py-3 text-gray-500 text-right">16:55</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
      </div>
    );
  };


  // --- Main Render ---

  if (selectedRecord) {
      return renderDetailView(selectedRecord);
  }

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
                            <tr 
                                key={record.id} 
                                onClick={() => setSelectedRecord(record)}
                                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {record.status === 'RISK' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                            <ShieldAlert className="w-3.5 h-3.5" /> Risk Detected
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            <CheckCircle className="w-3.5 h-3.5" /> Good
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {/* Privacy Filter: No real photo in list, generic avatar unless detailed */}
                                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                                            <Lock size={14} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{record.employeeName}</div>
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
                                            HR: <span className={record.metrics.heartRate > 100 ? "text-red-600 font-bold" : "text-gray-900"}>{record.metrics.heartRate} bpm</span> 
                                            <span className="text-gray-300 mx-2">|</span> 
                                            Stress: <span className={record.metrics.stressLevel > 80 ? "text-red-600 font-bold" : "text-gray-900"}>{record.metrics.stressLevel}/100</span>
                                        </span>
                                        {record.aiAnalysis && (
                                            <div className="text-[10px] text-gray-400 bg-gray-50 p-1 rounded border border-gray-100 max-w-xs truncate" title={record.aiAnalysis}>
                                                AI: {record.aiAnalysis}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    {record.status === 'RISK' ? (
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm shadow-red-900/20 flex items-center gap-2 ml-auto">
                                            <Coffee size={14} /> Force Break
                                        </button>
                                    ) : (
                                        <div className="text-gray-400 hover:text-gray-600 cursor-pointer p-2 inline-block">
                                            <MoreHorizontal size={18} />
                                        </div>
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