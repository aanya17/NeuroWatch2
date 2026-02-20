import { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

import {
  Activity,
  Heart,
  Brain,
  Footprints,
  Watch,
  Wind,
  Moon,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-[#64748B] mb-1">{title}</h3>
      <p className="text-[#0F172A] text-2xl font-semibold">{value}</p>
    </div>
  );
}

export function Dashboard() {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [muscleMovement, setMuscleMovement] = useState<string>("--");
  const [gait, setGait] = useState<number | null>(null);
  const [voice, setVoice] = useState<number | null>(null);
  const [tremor, setTremor] = useState<number | null>(null);
  const [breathing, setBreathing] = useState<number | null>(null);
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [fallDetected, setFallDetected] = useState<boolean>(false);

  useEffect(() => {
    const watchRef = ref(database, "watch_data");

    const unsubscribe = onValue(watchRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGait(data.gait ?? null);
        setHeartRate(data.heartRate ?? null);
        setMuscleMovement(data.muscleMovement ?? "--");
        setTremor(data.tremor ?? null);
        setVoice(data.voice ?? null);
        setBreathing(data.breathing ?? null);
        setSleepQuality(data.sleepQuality ?? null);
        setFallDetected(data.fallDetected ?? false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Dynamic Risk Calculation
  const calculateRisk = () => {
    let score = 0;

    if (tremor && tremor > 60) score += 2;
    if (gait && gait < 60) score += 2;
    if (voice && voice < 70) score += 1;
    if (heartRate && (heartRate > 110 || heartRate < 55)) score += 1;
    if (fallDetected) score += 3;

    if (score >= 6) return "High Risk";
    if (score >= 3) return "Moderate Risk";
    return "Low Risk";
  };

  const riskLevel = calculateRisk();

  const progressData = [
    {
      date: "Now",
      gait: gait ?? 0,
      tremor: tremor ?? 0,
      voice: voice ?? 0,
      muscle: muscleMovement === "Stable" ? 90 : 60,
    },
  ];

  return (
    <div className="min-h-screen px-8 py-10 bg-[#F8FAFC]">
      <h1 className="text-3xl font-semibold text-[#0F172A] mb-8">
        Live Health Dashboard
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <MetricCard
          title="Heart Rate"
          value={heartRate ? `${heartRate} bpm` : "--"}
          icon={<Heart size={18} />}
        />

        <MetricCard
          title="Gait Score"
          value={gait !== null ? gait.toString() : "--"}
          icon={<Footprints size={18} />}
        />

        <MetricCard
          title="Tremor Score"
          value={tremor !== null ? tremor.toString() : "--"}
          icon={<Watch size={18} />}
        />

        <MetricCard
          title="Voice Score"
          value={voice !== null ? voice.toString() : "--"}
          icon={<Brain size={18} />}
        />

        <MetricCard
          title="Breathing Rate"
          value={breathing ? `${breathing} rpm` : "--"}
          icon={<Wind size={18} />}
        />

        <MetricCard
          title="Sleep Quality"
          value={sleepQuality ? `${sleepQuality}%` : "--"}
          icon={<Moon size={18} />}
        />

        <MetricCard
          title="Fall Detected"
          value={fallDetected ? "Yes ⚠️" : "No"}
          icon={<AlertTriangle size={18} />}
        />

        <MetricCard
          title="Risk Level"
          value={riskLevel}
          icon={<Activity size={18} />}
        />

      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0] mb-10">
        <h2 className="text-xl font-semibold mb-6">Live Progress</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gait" stroke="#2563EB" />
            <Line type="monotone" dataKey="tremor" stroke="#22C55E" />
            <Line type="monotone" dataKey="voice" stroke="#8B5CF6" />
            <Line type="monotone" dataKey="muscle" stroke="#38BDF8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
        <h2 className="text-xl font-semibold mb-6">AI Insights</h2>

        <div className="space-y-3">
          <p>• Data updates every 3 seconds from smartwatch.</p>
          <p>• Risk level calculated dynamically from live metrics.</p>
          <p>• Fall detection instantly increases risk priority.</p>
          <p>• Tremor and gait directly influence neurological stability score.</p>
        </div>
      </div>
    </div>
  );
}
