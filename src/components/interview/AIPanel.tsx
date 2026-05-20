import { motion } from 'framer-motion';
import { Brain, Volume2, Loader } from 'lucide-react';

interface AIPanelProps {
  isThinking: boolean;
}

export default function AIPanel({ isThinking }: AIPanelProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-white/20 rounded-full p-2">
          <Brain className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">AI Interviewer</h3>
      </div>
      
      <div className="relative">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 mt-1 flex-shrink-0" />
            <div className="flex-1">
              {isThinking ? (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <p className="text-sm opacity-80">AI is analyzing your response...</p>
                </div>
              ) : (
                <p className="text-lg leading-relaxed">
                  I'll be conducting your interview today. Take your time with each question, 
                  and feel free to ask for clarification if needed.
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Voice Wave Animation */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-4 bg-white/60 rounded-full"
              animate={{
                height: [4, 16, 4],
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}