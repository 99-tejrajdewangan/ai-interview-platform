import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../contexts/InterviewContext";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Send,
  SkipForward,
  Flag,
  Loader,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Timer from "../components/ui/Timer";
import ProgressBar from "../components/ui/ProgressBar";
import AIPanel from "../components/interview/AIPanel";
import toast from "react-hot-toast";

type SpeechRecognitionEventResult = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionEventResult[];
};

interface SpeechRecognitionInterface {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInterface;
}

export default function InterviewScreen() {
  const navigate = useNavigate();
  const { currentQuestion, interviewState, nextQuestion, submitAnswer } =
    useInterview();
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [showThinking, setShowThinking] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const baseTranscriptRef = useRef<string>("");

  const setupMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Please allow camera and microphone access");
    }
  }, []);

  useEffect(() => {
    setupMedia();
  }, [setupMedia]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.warn("Error stopping speech recognition", err);
        }
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !cameraEnabled;
      });
      setCameraEnabled(!cameraEnabled);
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !micEnabled;
      });
      setMicEnabled(!micEnabled);
    }
  };

  const startRecording = () => {
    if (!micEnabled) {
      toast.error("Enable the microphone before recording.");
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition =
      win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      baseTranscriptRef.current = answer || "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        const combined = `${baseTranscriptRef.current}${baseTranscriptRef.current ? " " : ""}${finalTranscript}${interimTranscript ? " " + interimTranscript : ""}`;
        setAnswer(combined.trim());
      };

      recognition.onerror = (event: { error?: string }) => {
        console.error("Speech recognition error", event);
        toast.error(`Speech recognition error: ${event.error || "unknown"}`);
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start speech recognition", error);
      toast.error("Unable to start voice recording.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Error stopping recognition", err);
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }

    submitAnswer(answer);
    setShowThinking(true);
    setTimeout(() => {
      setShowThinking(false);
      setAnswer("");
      if (interviewState.currentQuestion + 1 >= interviewState.totalQuestions) {
        toast.success(
          "Interview completed! Redirecting to coding challenge...",
        );
        setTimeout(() => navigate("/coding"), 2000);
      } else {
        nextQuestion();
        toast.success("Answer submitted! Moving to next question");
      }
    }, 2000);
  };

  const handleSkipQuestion = () => {
    submitAnswer("[Skipped]");
    if (interviewState.currentQuestion + 1 >= interviewState.totalQuestions) {
      navigate("/coding");
    } else {
      nextQuestion();
      toast("Question skipped", { icon: "⏭️" });
    }
  };

  const handleEndInterview = () => {
    if (window.confirm("Are you sure you want to end the interview early?")) {
      navigate("/summary");
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Question {interviewState.currentQuestion + 1} of{" "}
              {interviewState.totalQuestions}
            </span>
            <Timer
              duration={currentQuestion.timeLimit}
              onTimeEnd={handleSubmitAnswer}
            />
          </div>
          <ProgressBar
            progress={
              ((interviewState.currentQuestion + 1) /
                interviewState.totalQuestions) *
              100
            }
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - AI Interviewer */}
          <div>
            <AIPanel isThinking={showThinking} />

            {/* Current Question Card */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Current Question</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                {currentQuestion.text}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    currentQuestion.difficulty === "Easy"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : currentQuestion.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                  {currentQuestion.type}
                </span>
              </div>
            </Card>
          </div>

          {/* Right Column - Candidate Video & Answer */}
          <div>
            {/* Video Preview */}
            <Card className="mb-6">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {stream ? (
                  <video
                    autoPlay
                    muted
                    playsInline
                    ref={(video) => {
                      if (video && stream) video.srcObject = stream;
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader className="w-12 h-12 text-gray-500 animate-spin" />
                  </div>
                )}

                {/* Controls Overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <button
                    onClick={toggleCamera}
                    className={`p-3 rounded-full ${
                      cameraEnabled
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white transition-all`}
                  >
                    {cameraEnabled ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <VideoOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={toggleMicrophone}
                    className={`p-3 rounded-full ${
                      micEnabled
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white transition-all`}
                  >
                    {micEnabled ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      isRecording ? stopRecording() : startRecording()
                    }
                    className={`p-3 rounded-full ${
                      isRecording
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white transition-all`}
                    title={
                      isRecording ? "Stop recording" : "Start voice answer"
                    }
                  >
                    {isRecording ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
                {cameraEnabled ? "Camera active" : "Camera disabled"} |{" "}
                {micEnabled ? "Microphone active" : "Microphone disabled"}
              </div>
            </Card>

            {/* Answer Input */}
            <Card>
              <label className="block text-sm font-semibold mb-2">
                Your Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or speak into the microphone..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
              {isRecording && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Recording... speak now and your answer will appear here.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Button onClick={handleSubmitAnswer} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Answer
                </Button>
                <Button
                  onClick={handleSkipQuestion}
                  variant="secondary"
                  className="flex-1"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Question
                </Button>
                <Button onClick={handleEndInterview} variant="danger">
                  <Flag className="w-4 h-4 mr-2" />
                  End
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
