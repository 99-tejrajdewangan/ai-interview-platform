import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import { CheckCircle, XCircle, Clock, Trophy, TrendingUp, Target, Download, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function InterviewSummary() {
  const navigate = useNavigate();
  const { candidate, interviewState } = useInterview();

  const stats = {
    totalQuestions: interviewState.totalQuestions,
    attempted: interviewState.answers.size,
    timeTaken: "32 minutes",
    score: 85,
    strengths: ["Problem Solving", "Communication", "Technical Knowledge"],
    improvements: ["Code Optimization", "System Design", "Time Management"]
  };

  const feedback = {
    overall: "Strong performance with good technical understanding. Shows potential for the role.",
    aiRecommendation: "Highly Recommended for next round",
    confidence: 0.88
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Interview Completed!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Thank you for completing the interview, {candidate?.fullName}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Performance Stats */}
          <Card>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Performance Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Questions Attempted</span>
                <span className="font-semibold text-lg">{stats.attempted}/{stats.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Time Taken</span>
                <span className="font-semibold text-lg">{stats.timeTaken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Overall Score</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-2xl text-green-600">{stats.score}%</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">AI Confidence Score</span>
                  <span className="font-semibold">{(feedback.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${feedback.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Strengths & Improvements */}
          <div className="space-y-6">
            <Card className="border-l-4 border-green-500">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {stats.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-l-4 border-yellow-500">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-600" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {stats.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* AI Evaluation */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          <h2 className="text-xl font-bold mb-4">🤖 AI Evaluation Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {feedback.overall}
          </p>
          <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Final Status:</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                {feedback.aiRecommendation}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Submitted for review</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/')} variant="secondary">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}