import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle, Activity, CameraOff, Clock } from 'lucide-react';
import { RPPGMetrics, AttendanceRecord, Employee } from '../types';
import { MOCK_EMPLOYEES, THRESHOLDS } from '../constants';
import { analyzeHealthMetrics } from '../services/geminiService';

interface AttendanceTerminalProps {
  onScanComplete: (record: AttendanceRecord) => void;
  onNavigateToApp?: () => void;
}

const AttendanceTerminal: React.FC<AttendanceTerminalProps> = ({ onScanComplete, onNavigateToApp }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("Initializing camera...");
  const [lastRecord, setLastRecord] = useState<AttendanceRecord | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Initialize Camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        setPermissionDenied(false);
        // Explicitly requesting video only
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setFeedbackMessage("Align your face within the frame");
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        if (isMounted) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setPermissionDenied(true);
            setFeedbackMessage("Camera access denied");
          } else {
            setFeedbackMessage("Camera unavailable: " + err.message);
          }
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); 

  // Simulate rPPG Data Generation
  const generateMetrics = (): RPPGMetrics => {
    // Randomly generate healthy or slightly risky data for demo purposes
    const isStressed = Math.random() > 0.8;
    
    return {
      heartRate: Math.floor(Math.random() * (isStressed ? 40 : 40) + (isStressed ? 90 : 60)),
      respirationRate: Math.floor(Math.random() * 8 + 12),
      spo2: Math.floor(Math.random() * 5 + 95),
      bloodPressureSys: Math.floor(Math.random() * 30 + 110),
      bloodPressureDia: Math.floor(Math.random() * 20 + 70),
      stressLevel: Math.floor(Math.random() * (isStressed ? 50 : 30) + (isStressed ? 50 : 10)),
    };
  };

  const handleScan = useCallback(async () => {
    if (isScanning || !stream) return;

    setIsScanning(true);
    setScanProgress(0);
    setFeedbackMessage("Keep still. Analyzing vital signs...");

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // 50 ticks * 2% = 100% ~ approx 2-3 seconds
      });
    }, 50);

    // After "scan" completes
    setTimeout(async () => {
      clearInterval(interval);
      
      // Capture Image
      let photoUrl = '';
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Mirror the context so the saved image matches the mirrored video feed
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            ctx.restore();
            photoUrl = canvas.toDataURL('image/jpeg');
        }
      }

      // DEMO MODE: Always pick the first employee (Tony Stark) so data accumulates for the demo user
      // This ensures when you log in as E001, you see a history of scans.
      const employee: Employee = MOCK_EMPLOYEES[0];
      
      // Generate Data
      const metrics = generateMetrics();
      
      // Determine Status logic
      const isRisk = 
        metrics.heartRate > THRESHOLDS.HEART_RATE_HIGH || 
        metrics.spo2 < THRESHOLDS.SPO2_LOW || 
        metrics.stressLevel > THRESHOLDS.STRESS_HIGH;

      // Get AI Analysis
      const analysis = await analyzeHealthMetrics(metrics, employee.name);

      const newRecord: AttendanceRecord = {
        id: crypto.randomUUID(),
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        timestamp: new Date(),
        photoUrl,
        metrics,
        status: isRisk ? 'RISK' : 'GOOD',
        aiAnalysis: analysis
      };

      setLastRecord(newRecord);
      onScanComplete(newRecord);
      setIsScanning(false);
      setFeedbackMessage(`Welcome, ${employee.name}. Scan Complete.`);
      
      // Reset after a delay
      setTimeout(() => {
        setLastRecord(null);
        setFeedbackMessage("Align your face within the frame");
        setScanProgress(0);
      }, 5000); 

    }, 2500);
  }, [isScanning, stream, onScanComplete]);

  const handleRetryPermission = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 relative">
      {/* HUD Overlay - pointer-events-none allows clicks to pass through to buttons underneath unless blocked */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
        {/* Permission Denied UI */}
        {permissionDenied && (
            <div className="bg-gray-900/90 p-8 rounded-2xl border border-red-500/50 flex flex-col items-center text-center max-w-md backdrop-blur-xl pointer-events-auto">
                <div className="bg-red-500/20 p-4 rounded-full mb-4">
                    <CameraOff className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Camera Access Required</h2>
                <p className="text-gray-400 mb-6">
                    This system requires camera access to scan biometrics. Please enable camera permissions in your browser settings.
                </p>
                <button 
                    onClick={handleRetryPermission}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 pointer-events-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reload Page
                </button>
            </div>
        )}

        {/* Face Frame (Only show if camera is active or initializing) */}
        {!permissionDenied && (
            <div className={`
            relative w-64 h-64 md:w-96 md:h-96 border-4 rounded-3xl transition-colors duration-300
            ${isScanning ? 'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.5)]' : 'border-gray-500/50'}
            ${lastRecord?.status === 'GOOD' ? '!border-green-500 !shadow-[0_0_50px_rgba(34,197,94,0.5)]' : ''}
            ${lastRecord?.status === 'RISK' ? '!border-red-500 !shadow-[0_0_50px_rgba(239,68,68,0.5)]' : ''}
            `}>
            {/* Scanning Line */}
            {isScanning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] animate-[scan_2s_ease-in-out_infinite]" />
            )}
            
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-lg -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-lg -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-lg -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-lg -mb-1 -mr-1"></div>
            </div>
        )}

        {/* Status Text */}
        {!permissionDenied && (
            <div className="mt-8 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700">
            <p className="text-xl font-mono text-blue-100 tracking-wider flex items-center gap-2">
                {isScanning && <Activity className="w-5 h-5 animate-pulse text-blue-400" />}
                {feedbackMessage}
            </p>
            </div>
        )}
      </div>

      {/* Video Feed - Added scale-x-[-1] for Mirror Effect */}
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute min-w-full min-h-full object-cover opacity-80 scale-x-[-1]" 
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* rPPG Grid Effect Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      </div>

      {/* Result Card (Pop-up) - pointer-events-auto ensures buttons inside are clickable */}
      {lastRecord && (
        <div className="absolute bottom-32 z-30 animate-[slideUp_0.5s_ease-out] w-full flex justify-center pointer-events-auto">
          <div className={`p-6 rounded-2xl backdrop-blur-xl border flex flex-col md:flex-row items-center gap-6 shadow-2xl max-w-lg
            ${lastRecord.status === 'GOOD' ? 'bg-green-900/90 border-green-500/50' : 'bg-red-900/90 border-red-500/50'}
          `}>
            <div className="flex items-center gap-4">
                <div className="relative">
                {/* Use captured photo if available, otherwise placeholder */}
                <img src={lastRecord.photoUrl} alt="Capture" className="w-20 h-20 rounded-full object-cover border-2 border-white/50" />
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${lastRecord.status === 'GOOD' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {lastRecord.status === 'GOOD' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                </div>
                </div>
                <div>
                <h2 className="text-2xl font-bold text-white">{lastRecord.employeeName}</h2>
                <div className="flex gap-4 mt-2 text-sm font-mono text-white/90">
                    <span className="flex items-center gap-1"><Clock size={14}/> {lastRecord.timestamp.toLocaleTimeString()}</span>
                    <span>Status: {lastRecord.status}</span>
                </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Trigger - pointer-events-auto and z-index ensures it catches clicks */}
      {!isScanning && !lastRecord && !permissionDenied && (
        <button 
          onClick={handleScan}
          disabled={!stream}
          className="absolute bottom-32 z-20 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 pointer-events-auto"
        >
          <Camera className="w-6 h-6" />
          {stream ? "Start Scan" : "Initializing..."}
        </button>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AttendanceTerminal;