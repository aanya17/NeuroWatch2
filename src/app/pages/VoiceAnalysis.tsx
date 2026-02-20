import { useState, useRef } from "react";
import { Upload, Mic, TrendingUp } from "lucide-react";

const FIREBASE_VOICE_URL =
  "https://neurowatch-b3b08-default-rtdb.firebaseio.com/watch_data";

export function VoiceAnalysis() {
  const [fileName, setFileName] = useState("");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [voiceScore, setVoiceScore] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Upload file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setAudioURL(URL.createObjectURL(file));
      setAnalyzed(false);
    }
  };

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setFileName("Recorded Audio");
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // Analyze
  const handleAnalyze = async () => {
    if (!audioURL) return;

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

        {/* RECORD + UPLOAD SECTION */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Record */}
          <div className="border rounded-xl p-6 text-center">
            <Mic className="mx-auto mb-4 text-blue-600" size={40} />
            <h3 className="font-semibold mb-4">Record Voice</h3>

            {!recording ? (
              <button
                onClick={startRecording}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Stop Recording
              </button>
            )}
          </div>

          {/* Upload */}
          <div className="border rounded-xl p-6 text-center">
            <Upload className="mx-auto mb-4 text-gray-600" size={40} />
            <h3 className="font-semibold mb-4">Upload Audio</h3>

            <input
              type="file"
              accept="audio/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Choose File
            </button>

            {fileName && <p className="mt-3 text-sm">Selected: {fileName}</p>}
          </div>
        </div>

        {/* Audio Preview */}
        {audioURL && (
          <div className="mt-6 text-center">
            <audio controls src={audioURL} className="mx-auto" />
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          className="w-full mt-6 bg-[#2563EB] text-white py-3 rounded-lg"
        >
          Analyze Voice
        </button>

        {/* Result */}
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
