import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Employee } from '../types';
import { MOCK_EMPLOYEES } from '../constants';

interface LoginScreenProps {
  onLogin: (employee: Employee) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulate backend authentication
    const employee = MOCK_EMPLOYEES.find(emp => emp.id === id && emp.password === password);

    if (employee) {
      onLogin(employee);
    } else {
      setError('Invalid ID or Password. (Try ID: E001, Pass: 1234)');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="bg-gray-800 p-8 text-center border-b border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-4">
            <User className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Employee Login</h2>
          <p className="text-gray-400 text-sm mt-2">Access your personal health history</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Employee ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. E001"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>
        
        <div className="bg-gray-900/50 p-4 text-center border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Authorized personnel only. All access is logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;