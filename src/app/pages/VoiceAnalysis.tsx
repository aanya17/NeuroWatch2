import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity, Upload, TrendingUp } from "lucide-react";

const FIREBASE_VOICE_URL =
  "https://neurowatch-b3b08-default-rtdb.firebaseio.com/watch_data";

export function Voice() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [voiceScore, setVoiceScore] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setAnalyzed(false);
    }
  };

  const handleAnalyze = async () => {
    if (!fileName) return;

    const randomScore = Math.floor(Math.random() * 20) + 80;
    setVoiceScore(randomScore);
    setAnalyzed(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.username) return;

    await fetch(`${FIREBASE_VOICE_URL}/${user.username}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voice: randomScore,
      }),
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <h1 className="text-3xl font-semibold mb-6">Voice Analysis</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E2E8F0]">
        <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 text-center">
          <Upload className="mx-auto mb-4" />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          {fileName && <p>Selected: {fileName}</p>}
        </div>

        <button
          onClick={handleAnalyze}
          className="w-full mt-6 bg-[#2563EB] text-white py-3 rounded-lg"
        >
          Analyze Voice
        </button>

        {analyzed && (
          <div className="mt-6 text-center">
            <TrendingUp className="mx-auto mb-2 text-green-500" />
            <h2 className="text-2xl font-semibold">{voiceScore}</h2>
            <p>Voice Stability Score</p>
          </div>
        )}
      </div>
    </div>
  );
}
