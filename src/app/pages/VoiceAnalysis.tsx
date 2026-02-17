import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Activity, Mic, Upload, Play, Pause, X, CheckCircle2, AlertCircle, TrendingUp, Volume2 } from 'lucide-react';

const FIREBASE_URL =
  "https://neurowatch-b3b08-default-rtdb.firebaseio.com/watch_data.json";

const tabs = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Gait', path: '/gait' },
  { name: 'Voice', path: '/voice' },
  { name: 'Smartwatch', path: '/smartwatch' },
  { name: 'Lifestyle', path: '/lifestyle' },
  { name: 'Appointments', path: '/appointments' },
  { name: 'Profile', path: '/profile' },
  { name: 'Suggestions', path: '/suggestions' },
];

interface VoiceAnalysisResult {
  overallScore: number;
  pitch: { value: number; status: 'normal' | 'concern' };
  volume: { value: number; status: 'normal' | 'concern' };
  clarity: { value: number; status: 'normal' | 'concern' };
  tremor: { value: number; status: 'normal' | 'concern' };
  fluency: { value: number; status: 'normal' | 'concern' };
  recommendations: string[];
}

export function VoiceAnalysis() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    const blob = new Blob([''], { type: 'audio/wav' });
    const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
    setUploadedFile(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(file);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);

    setTimeout(async () => {
      const mockResult: VoiceAnalysisResult = {
        overallScore: 82,
        pitch: { value: 88, status: 'normal' },
        volume: { value: 75, status: 'concern' },
        clarity: { value: 90, status: 'normal' },
        tremor: { value: 78, status: 'concern' },
        fluency: { value: 85, status: 'normal' },
        recommendations: [
          'Your voice pitch variation is within normal range.',
          'Volume consistency shows slight variations.',
          'Speech clarity is excellent.',
          'Minor tremor detected in sustained sounds.',
          'Speech fluency is good.',
        ],
      };

      setAnalysisResult(mockResult);
      setIsAnalyzing(false);

      // ✅ SAVE VOICE SCORE TO FIREBASE
      try {
        await fetch(FIREBASE_URL, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            voice: mockResult.overallScore
          })
        });
      } catch (error) {
        console.error("Firebase update error:", error);
      }

    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: 'normal' | 'concern') => {
    return status === 'normal' ? 'text-[#22C55E]' : 'text-[#F59E0B]';
  };

  const getStatusIcon = (status: 'normal' | 'concern') => {
    return status === 'normal'
      ? <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
      : <AlertCircle className="w-5 h-5 text-[#F59E0B]" />;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white shadow-sm border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#0F172A] text-xl" style={{ fontWeight: 600 }}>NeuroWatch</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-[#0F172A] text-3xl mb-6" style={{ fontWeight: 600 }}>
          Voice Analysis
        </h1>

        {uploadedFile && !analysisResult && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full px-6 py-4 bg-[#22C55E] text-white rounded-lg"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Voice"}
          </button>
        )}

        {analysisResult && (
          <div className="mt-6 p-6 bg-white rounded-xl border border-[#E2E8F0]">
            <h2 className="text-xl mb-4">Voice Stability Score</h2>
            <div className="text-5xl font-semibold">
              {analysisResult.overallScore}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
