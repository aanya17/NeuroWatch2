import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const FIREBASE_WATCH_URL =
  "https://neurowatch-b3b08-default-rtdb.firebaseio.com/watch_data";

const FIREBASE_LIFESTYLE_URL =
  "https://neurowatch-b3b08-default-rtdb.firebaseio.com/lifestyle";

const tabs = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Gait", path: "/gait" },
  { name: "Voice", path: "/voice" },
  { name: "Smartwatch", path: "/smartwatch" },
  { name: "Lifestyle", path: "/lifestyle" },
  { name: "History", path: "/history" },
  { name: "Appointments", path: "/appointments" },
  { name: "Profile", path: "/profile" },
];

interface MedicalRecord {
  date: string;
  heartRate?: number;
  gait?: number;
  tremor?: string;
  voice?: number;
  muscleMovement?: string;
  sleepHours?: number;
  activity?: string;
  breakfast?: string;
  lunch?: string;
  snack?: string;
  dinner?: string;
}

export function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("History");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(
    new Set()
  );

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?.username) return;

        const watchRes = await fetch(
          `${FIREBASE_WATCH_URL}/${user.username}.json`
        );
        const watchData = await watchRes.json();

        const lifeRes = await fetch(
          `${FIREBASE_LIFESTYLE_URL}/${user.username}.json`
        );
        const lifestyleData = await lifeRes.json();

        const today = new Date().toISOString().split("T")[0];

        const combined: MedicalRecord = {
          date: today,
          heartRate: watchData?.heartRate,
          gait: watchData?.gait,
          tremor: watchData?.tremor,
          voice: watchData?.voice,
          muscleMovement: watchData?.muscleMovement,
          sleepHours: lifestyleData?.sleepHours,
          activity: lifestyleData?.activity,
          breakfast: lifestyleData?.breakfast,
          lunch: lifestyleData?.lunch,
          snack: lifestyleData?.snack,
          dinner: lifestyleData?.dinner,
        };

        setRecords([combined]);
      } catch (error) {
        console.error("Error fetching medical history:", error);
      }
    };

    fetchAllData();
  }, []);

  const toggleRecord = (date: string) => {
    const newExpanded = new Set(expandedRecords);
    newExpanded.has(date)
      ? newExpanded.delete(date)
      : newExpanded.add(date);
    setExpandedRecords(newExpanded);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleExportReport = () => {
    alert("Downloading full medical report...");
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F8FAFC", fontFamily: "Inter, sans-serif" }}
    >
      {/* Top Nav */}
      <div className="bg-white shadow-sm border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#0F172A]">
                NeuroWatch
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`px-5 py-3 ${
                  activeTab === tab.name
                    ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                    : "text-[#64748B]"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-[#0F172A]">
              Complete Medical History
            </h1>
            <p className="text-[#64748B]">
              Combined smartwatch + lifestyle health report
            </p>
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8]"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        {records.map((record) => {
          const isExpanded = expandedRecords.has(record.date);

          return (
            <div
              key={record.date}
              className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] mb-4"
            >
              <div
                onClick={() => toggleRecord(record.date)}
                className="p-6 cursor-pointer hover:bg-[#F8FAFC]"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#2563EB]" />
                    <h3 className="text-lg font-semibold text-[#0F172A]">
                      {formatDate(record.date)}
                    </h3>
                  </div>
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#E2E8F0] p-6 space-y-4">
                  <div><strong>Heart Rate:</strong> {record.heartRate ?? "--"} bpm</div>
                  <div><strong>Gait Score:</strong> {record.gait ?? "--"}</div>
                  <div><strong>Tremor:</strong> {record.tremor ?? "--"}</div>
                  <div><strong>Voice Stability:</strong> {record.voice ?? "--"}</div>
                  <div><strong>Muscle Movement:</strong> {record.muscleMovement ?? "--"}</div>

                  <hr />

                  <div><strong>Sleep Hours:</strong> {record.sleepHours ?? "--"} hrs</div>
                  <div><strong>Activity:</strong> {record.activity ?? "--"}</div>
                  <div><strong>Breakfast:</strong> {record.breakfast ?? "--"}</div>
                  <div><strong>Lunch:</strong> {record.lunch ?? "--"}</div>
                  <div><strong>Snack:</strong> {record.snack ?? "--"}</div>
                  <div><strong>Dinner:</strong> {record.dinner ?? "--"}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
