import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Activity, Calendar, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';

const tabs = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Gait', path: '/gait' },
  { name: 'Voice', path: '/voice' },
  { name: 'Smartwatch', path: '/smartwatch' },
  { name: 'Lifestyle', path: '/lifestyle' },
  { name: 'History', path: '/history' },
  { name: 'Appointments', path: '/appointments' },
  { name: 'Profile', path: '/profile' },
];

const FIREBASE_HISTORY_URL =
  "https://neurowatch-b3b08-default-rtdb.firebaseio.com/history";

interface DailyRecord {
  date: string;
  gaitScore: number;
  tremorLevel: number;
  voiceStability: number;
  heartRate: number;
  sleepHours: number;
  steps: number;
  medications: { name: string; dosage: string; time: string }[];
  symptoms: string[];
  activities: string[];
  meals: { type: string; description: string; time: string }[];
  notes: string;
}

export function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('History');
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }

    fetch(`${FIREBASE_HISTORY_URL}/${userId}.json`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          const recordsArray = Object.values(data) as DailyRecord[];
          setDailyRecords(recordsArray.reverse());
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div className="p-10">Loading history...</div>;
  }

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  const toggleRecord = (date: string) => {
    const newExpanded = new Set(expandedRecords);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedRecords(newExpanded);
  };

  const getComparisonIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-[#22C55E]" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-[#EF4444]" />;
    return <Minus className="w-4 h-4 text-[#64748B]" />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleExportReport = () => {
    alert('Downloading detailed patient report for doctor review...');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Navigation */}
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

          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`px-5 py-3 transition-colors whitespace-nowrap ${
                  activeTab === tab.name
                    ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[#0F172A] text-3xl mb-2" style={{ fontWeight: 600 }}>Daily Health History</h1>
            <p className="text-[#64748B]">Detailed records for doctor review and progress tracking</p>
          </div>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>

        <div className="space-y-4">
          {dailyRecords.map((record, index) => {
            const isExpanded = expandedRecords.has(record.date);
            const previousRecord = dailyRecords[index + 1];

            return (
              <div key={record.date} className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                <div
                  onClick={() => toggleRecord(record.date)}
                  className="p-6 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#2563EB]" />
                      <h3 className="text-[#0F172A] text-lg" style={{ fontWeight: 600 }}>
                        {formatDate(record.date)}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#64748B]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#64748B]" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#E2E8F0] p-6">
                    <p className="text-[#0F172A]">Notes: {record.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
