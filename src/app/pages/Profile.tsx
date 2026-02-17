import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Activity, Save, User, Mail, Bell, LogOut } from 'lucide-react';

const FIREBASE_BASE_URL =
  "https://neurowatch-b3b08-default-rtdb.firebaseio.com/users";

const tabs = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Gait', path: '/gait' },
  { name: 'Voice', path: '/voice' },
  { name: 'Smartwatch', path: '/smartwatch' },
  { name: 'Lifestyle', path: '/lifestyle' },
  { name: 'History', path: '/history' },
  { name: 'Appointments', path: '/appointments' },
  { name: 'Support', path: '/support' },
  { name: 'Profile', path: '/profile' },
];

export function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');

  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate('/');
      return;
    }

    setUserId(storedUserId);

    fetch(`${FIREBASE_BASE_URL}/${storedUserId}.json`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setName(data.fullName || '');
          setAge(data.age || '');
          setGender(data.gender || 'Male');
          setEmail(data.email || '');
          setUsername(data.username || '');
          setEmailNotifications(data.emailNotifications ?? true);
        }
      });
  }, [navigate]);

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  const handleSave = async () => {
    if (!userId) return;

    await fetch(`${FIREBASE_BASE_URL}/${userId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: name,
        age,
        gender,
        emailNotifications
      })
    });

    alert("Profile saved successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate('/');
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
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-[#64748B] hover:text-[#EF4444] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`px-5 py-3 transition-colors ${
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

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-[#0F172A] text-3xl mb-2" style={{ fontWeight: 600 }}>Profile Settings</h1>
          <p className="text-[#64748B]">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E2E8F0] mb-6">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-[#2563EB] rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[#0F172A] mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[#0F172A] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-11 pr-4 py-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0F172A] mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[#0F172A] mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="border-t border-[#E2E8F0] pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#2563EB]" />
                  <p>Email Notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white py-4 rounded-lg"
            >
              <Save className="w-5 h-5" />
              Save Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
          <h3 className="text-[#0F172A] mb-4" style={{ fontWeight: 600 }}>Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-[#E2E8F0]">
              <span>Username</span>
              <span>{username}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E2E8F0]">
              <span>Member Since</span>
              <span>January 2026</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Status</span>
              <span className="text-[#22C55E]">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
