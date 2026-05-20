import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Clock, Mic, Video, Shield, Award } from "lucide-react";
import Button from "../components/ui/Button";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, text: "AI-Powered Interviews" },
    { icon: Clock, text: "30-45 Minutes Duration" },
    { icon: Mic, text: "Voice Recognition" },
    { icon: Video, text: "Video Recording" },
    { icon: Shield, text: "Secure Platform" },
    { icon: Award, text: "Instant Feedback" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 shadow-lg">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Interview Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the future of hiring with our AI-powered interview
            platform. Get real-time feedback, technical assessments, and
            comprehensive evaluation.
          </p>
          <Button
            onClick={() => navigate("/candidate-details")}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Start Interview →
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
            >
              <feature.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {feature.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Instructions Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Before You Begin
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-lg">📋 Instructions</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Ensure stable internet connection</li>
                <li>• Find a quiet, well-lit environment</li>
                <li>• Test your camera and microphone</li>
                <li>• Complete all questions thoroughly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-lg">
                ⏱️ Interview Details
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Duration: 30-45 minutes</li>
                <li>• Questions: 10 total (5 behavioral + 5 technical)</li>
                <li>• Coding challenge included</li>
                <li>• Immediate AI evaluation</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
