import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  Mic,
  Wifi,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  FileText,
  Settings,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import toast from "react-hot-toast";

const StatusIcon = ({ status }: { status: boolean | null | string }) => {
  if (status === true || status === "excellent" || status === "good")
    return <CheckCircle className="w-6 h-6 text-green-500" />;
  if (status === false || status === "poor")
    return <XCircle className="w-6 h-6 text-red-500" />;
  return <AlertCircle className="w-6 h-6 text-yellow-500 animate-pulse" />;
};

const StatusText = ({ status }: { status: boolean | null | string }) => {
  if (status === true)
    return (
      <span className="text-green-600 dark:text-green-400">Connected</span>
    );
  if (status === false)
    return (
      <span className="text-red-600 dark:text-red-400">Access Denied</span>
    );
  if (status === "excellent")
    return (
      <span className="text-green-600 dark:text-green-400">Excellent</span>
    );
  if (status === "good")
    return <span className="text-blue-600 dark:text-blue-400">Good</span>;
  if (status === "poor")
    return <span className="text-red-600 dark:text-red-400">Poor</span>;
  return (
    <span className="text-yellow-600 dark:text-yellow-400">Testing...</span>
  );
};

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null,
  );
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [internetSpeed, setInternetSpeed] = useState<string>("testing");
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micLevel, setMicLevel] = useState<number>(0);

  async function requestPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setCameraStream(stream);
      setCameraPermission(true);

      // Monitor microphone levels
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkMic = () => {
        analyser.getByteTimeDomainData(dataArray);
        let max = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128;
          max = Math.max(max, Math.abs(v));
        }
        setMicLevel(max);
        requestAnimationFrame(checkMic);
      };
      checkMic();

      setMicPermission(true);
      await audioContext.resume();
    } catch (error) {
      console.error("Permission error:", error);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setCameraPermission(false);
          setMicPermission(false);
          toast.error("Please allow camera and microphone access");
        }
      }
    }
  }

  function checkInternetSpeed() {
    if (!navigator.onLine) {
      setIsOnline(false);
      setInternetSpeed("poor");
      return;
    }

    const startTime = Date.now();
    fetch("/favicon.ico?cache=" + Date.now(), { cache: "no-store" })
      .then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        if (duration < 200) {
          setInternetSpeed("excellent");
        } else if (duration < 500) {
          setInternetSpeed("good");
        } else {
          setInternetSpeed("poor");
        }
      })
      .catch(() => {
        setInternetSpeed("poor");
      });
  }

  useEffect(() => {
    const init = async () => {
      checkInternetSpeed();
      await requestPermissions();
    };

    init();

    const handleOnline = () => {
      setIsOnline(true);
      checkInternetSpeed();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const allChecksPassed = cameraPermission === true && micPermission === true && internetSpeed !== "poor" && isOnline;

  const startInterview = () => {
    if (!allChecksPassed) {
      toast.error(
        "Please complete camera and microphone access before starting",
      );
      return;
    }

    if (internetSpeed === "poor" || !isOnline) {
      const proceed = window.confirm(
        "Your internet is weak or offline. The interview may still work, but audio/video may be affected. Continue anyway?",
      );
      if (!proceed) return;
      toast("Continuing on low network - this may impact quality", {
        icon: "⚠️",
      });
    }

    toast.success("Setup complete! Starting interview...");
    setTimeout(() => navigate("/interview"), 1500);
  };

  const interviewGuidelines = [
    "Find a quiet, well-lit room with a neutral background",
    "Dress professionally as you would for an in-person interview",
    "Ensure your camera is at eye level",
    "Speak clearly and at a moderate pace",
    "Have your ID ready for verification",
    "Close all unnecessary applications and tabs",
    "Keep a notepad and pen nearby if needed",
    "You cannot pause or restart the interview once started",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interview Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete these checks before starting your AI interview
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - System Checks */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Requirements Check
                </h2>

                <div className="space-y-4">
                  {/* Camera Check */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-semibold">Camera</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <StatusText status={cameraPermission} />
                        </p>
                      </div>
                    </div>
                    <StatusIcon status={cameraPermission} />
                  </div>

                  {/* Microphone Check */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-semibold">Microphone</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <StatusText status={micPermission} />
                        </p>
                      </div>
                    </div>
                    <StatusIcon status={micPermission} />
                  </div>

                  {/* Microphone Level Indicator */}
                  {micPermission && (
                    <div className="ml-11">
                      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-100"
                          style={{ width: `${micLevel * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {micLevel > 0.1
                          ? "Microphone working"
                          : "Speak to test microphone"}
                      </p>
                    </div>
                  )}

                  {/* Internet Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-semibold">Internet Connection</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <StatusText status={internetSpeed} />
                        </p>
                      </div>
                    </div>
                    <StatusIcon status={internetSpeed} />
                  </div>
                </div>
              </Card>

              {/* Camera Preview */}
              {cameraStream && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Camera Preview
                  </h3>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                    <video
                      autoPlay
                      muted
                      playsInline
                      ref={(video) => {
                        if (video && cameraStream)
                          video.srcObject = cameraStream;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Guidelines */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Interview Guidelines
                </h2>
                <ul className="space-y-3">
                  {interviewGuidelines.map((guideline, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                <h3 className="font-bold text-lg mb-3">
                  Interview Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    📊 <strong>Total Questions:</strong> 10 (5 Behavioral + 5
                    Technical)
                  </p>
                  <p>
                    💻 <strong>Coding Challenge:</strong> 1 Problem to solve
                  </p>
                  <p>
                    ⏱️ <strong>Time Limit:</strong> 30-45 minutes total
                  </p>
                  <p>
                    🎯 <strong>Passing Score:</strong> 70%
                  </p>
                  <p>
                    📝 <strong>AI Evaluation:</strong> Instant feedback after
                    completion
                  </p>
                </div>
              </Card>

              {/* Start Button */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={startInterview}
                  disabled={!allChecksPassed}
                  className="w-full py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Interview
                </Button>
                {!allChecksPassed && (
                  <p className="text-center text-sm text-red-600 dark:text-red-400">
                    Please complete all system checks before starting
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
