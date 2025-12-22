import React from 'react';
import { AttendanceRecord, Employee } from '../types';
import { Heart, Wind, Activity, Brain, User, Calendar, AlertCircle, CheckCircle2, Lock, History, TrendingUp, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface EmployeeViewProps {
  employee: Employee;
  latestRecord: AttendanceRecord | null;
  history: AttendanceRecord[];
  onLogout: () => void;
}

const MetricCard = ({ icon: Icon, title, value, unit, status, color }: any) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-2 shadow-lg">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${status === 'Normal' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
        {status}
      </span>
    </div>
    <div>
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-gray-500 text-sm">{unit}</span>
      </div>
    </div>
  </div>
);

const EmployeeView: React.FC<EmployeeViewProps> = ({ employee, latestRecord, history = [], onLogout }) => {
  
  // Render empty state if no data, but still show header to allow logout
  if (!latestRecord) {
    return (
      <div className="h-full bg-gray-900 text-white p-4 md:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Health Dashboard</h1>
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors border border-gray-700"
            >
                <LogOut size={16} /> Logout
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome, {employee.name}</h2>
            <p>No recent health records found.</p>
            <p className="text-sm mt-2">Please perform an attendance scan at the terminal to generate your first report.</p>
          </div>
      </div>
    );
  }

  const { metrics, employeeName, photoUrl, timestamp, status, aiAnalysis } = latestRecord;

  // Prepare data for current overview chart
  const healthData = [
    { name: 'HR', value: metrics.heartRate, full: 200, fill: '#ef4444' },
    { name: 'SpO2', value: metrics.spo2, full: 100, fill: '#3b82f6' },
    { name: 'Resp', value: metrics.respirationRate, full: 40, fill: '#10b981' },
    { name: 'Stress', value: metrics.stressLevel, full: 100, fill: '#8b5cf6' },
  ];

  // Prepare data for history trend chart
  const trendData = history.map(record => ({
    time: record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: record.metrics.heartRate,
    stress: record.metrics.stressLevel,
    spo2: record.metrics.spo2
  }));

  // Reverse history for the list view (newest first)
  const historyList = [...history].reverse();

  return (
    <div className="h-full overflow-y-auto bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        
        {/* Top Navigation / Header */}
        <div className="flex justify-between items-center">
            <h2 className="text-gray-400 text-sm font-mono uppercase tracking-wider">Secure Personal View</h2>
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-900/30 hover:text-red-300 hover:border-red-500/50 rounded-lg text-sm transition-all border border-gray-700"
            >
                <LogOut size={16} /> Logout
            </button>
        </div>

        {/* Header Profile Section */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden">
          {/* Privacy Badge */}
          <div className="absolute top-0 right-0 bg-gray-700 text-gray-300 text-[10px] px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <Lock size={10} /> Private Personal Record
          </div>

          <div className="relative">
            <img 
              src={photoUrl} 
              alt="Employee" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-2xl" 
            />
            <div className={`absolute bottom-0 right-0 p-2 rounded-full border-4 border-gray-800 ${status === 'GOOD' ? 'bg-green-500' : 'bg-red-500'}`}>
              {status === 'GOOD' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-1">{employeeName}</h1>
            <p className="text-gray-400 mb-4 flex items-center justify-center md:justify-start gap-2">
               {latestRecord.department} &bull; ID: {latestRecord.employeeId}
            </p>
            <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-sm text-blue-300">
                Latest: {timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="text-right hidden md:block mt-8 md:mt-0">
            <div className="text-sm text-gray-400">Current Status</div>
            <div className={`text-2xl font-bold ${status === 'GOOD' ? 'text-green-400' : 'text-red-400'}`}>
              {status === 'GOOD' ? 'FIT FOR DUTY' : 'ATTENTION REQUIRED'}
            </div>
          </div>
        </div>

        {/* AI Insight */}
        {aiAnalysis && (
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-4 rounded-xl flex items-start gap-3">
                <Brain className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                    <h3 className="text-indigo-300 font-bold text-sm mb-1">AI Health Insight</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">{aiAnalysis}</p>
                </div>
            </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            icon={Heart} 
            title="Heart Rate" 
            value={metrics.heartRate} 
            unit="BPM" 
            status={metrics.heartRate > 100 ? 'High' : 'Normal'} 
            color="bg-red-500" 
          />
          <MetricCard 
            icon={Wind} 
            title="SpO2" 
            value={metrics.spo2} 
            unit="%" 
            status={metrics.spo2 < 95 ? 'Low' : 'Normal'} 
            color="bg-blue-500" 
          />
           <MetricCard 
            icon={Activity} 
            title="Blood Pressure" 
            value={`${metrics.bloodPressureSys}/${metrics.bloodPressureDia}`} 
            unit="" 
            status={metrics.bloodPressureSys > 130 ? 'Elevated' : 'Normal'} 
            color="bg-green-500" 
          />
           <MetricCard 
            icon={Brain} 
            title="Stress Index" 
            value={metrics.stressLevel} 
            unit="/100" 
            status={metrics.stressLevel > 80 ? 'High' : 'Normal'} 
            color="bg-purple-500" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
             <h3 className="text-lg font-bold text-white mb-6">Vital Overview</h3>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={healthData} layout="vertical">
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" stroke="#9ca3af" width={50} />
                   <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                    cursor={{fill: 'transparent'}}
                   />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                     {healthData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.fill} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="flex flex-col gap-4">
             {/* Action Item */}
             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col justify-center items-center text-center flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Next Steps</h3>
                {status === 'RISK' ? (
                    <div className="p-4 bg-red-900/30 rounded-lg border border-red-500/30 w-full">
                        <p className="text-red-200 mb-2">Your vital signs indicate elevated stress or fatigue levels.</p>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
                            Request Wellness Break
                        </button>
                    </div>
                ) : (
                  <div className="p-4 bg-green-900/30 rounded-lg border border-green-500/30 w-full">
                      <p className="text-green-200 mb-2">You are in good condition.</p>
                      <p className="text-sm text-gray-400">Keep up the hydration and regular breaks.</p>
                  </div>
                )}
             </div>

             {/* Privacy Note */}
             <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex items-start gap-3">
               <Lock className="w-5 h-5 text-gray-500 mt-1" />
               <div className="text-xs text-gray-400">
                 <strong className="text-gray-300 block mb-1">Privacy Guarantee</strong>
                 Detailed metrics and your photo are visible ONLY to you.
               </div>
             </div>
           </div>
        </div>

        {/* History Trends Section */}
        {history.length > 1 && (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Health Trends</h3>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate" strokeWidth={2} />
                            <Line type="monotone" dataKey="stress" stroke="#8b5cf6" name="Stress Lvl" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* History List Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-white">Recent Checks</h3>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-400">Time</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-400">Heart Rate</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-400">Stress</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-400 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {historyList.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                                    {record.timestamp.toLocaleDateString()} <br/>
                                    <span className="text-xs text-gray-500">{record.timestamp.toLocaleTimeString()}</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-white">
                                    {record.metrics.heartRate} <span className="text-gray-500 text-xs">bpm</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-white">
                                    {record.metrics.stressLevel} <span className="text-gray-500 text-xs">/100</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        record.status === 'GOOD' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                                    }`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeView;