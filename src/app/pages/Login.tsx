import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Activity } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const FIREBASE_URL =
  "https://neurowatch-b3b08-default-rtdb.firebaseio.com/users.json";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(FIREBASE_URL);
      const data = await res.json();

      if (!data) {
        setError("No users found");
        return;
      }

      const users = Object.entries(data);

      const matchedUser = users.find(([_, value]: any) => {
        return (
          (value.username === username || value.email === username) &&
          value.password === password
        );
      });

      if (matchedUser) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }

    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-[#0F172A] mb-2" style={{ fontWeight: 600 }}>NeuroWatch</h1>
            <p className="text-[#64748B]">AI-Powered Neurodegenerative Monitoring</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-[#0F172A] mb-2">
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="Enter your username or email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#0F172A] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[#2563EB] text-sm hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#2563EB] text-white py-3 rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#64748B]">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-[#2563EB] hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
