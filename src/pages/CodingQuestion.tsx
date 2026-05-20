import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, ChevronRight, Terminal, Code2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

const codingQuestion = {
  title: "Two Sum Problem",
  description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to `target`.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]"
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]"
    }
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists."
  ],
  starterCode: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
  languages: ["javascript", "python", "java", "cpp"]
};

export default function CodingQuestion() {
  const navigate = useNavigate();
  const [code, setCode] = useState(codingQuestion.starterCode);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(`✓ Code executed successfully!

Output: [0,1]

Test Results:
✅ Example 1: Passed
✅ Example 2: Passed  
✅ Example 3: Passed

Time Complexity: O(n)
Space Complexity: O(n)

All test cases passed!`);
      setIsRunning(false);
      toast.success("Code execution completed!");
    }, 2000);
  };

  const handleSubmitCode = () => {
    toast.success("Solution submitted successfully!");
    setTimeout(() => navigate('/summary'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <div className="space-y-6">
            <Card>
              <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-blue-600" />
                {codingQuestion.title}
              </h1>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {codingQuestion.description}
                </p>
                
                <h3 className="font-semibold text-lg mb-3">Examples:</h3>
                {codingQuestion.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-3">
                    <p className="font-mono text-sm">Input: {example.input}</p>
                    <p className="font-mono text-sm mt-1">Output: {example.output}</p>
                    {example.explanation && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Explanation: {example.explanation}
                      </p>
                    )}
                  </div>
                ))}
                
                <h3 className="font-semibold text-lg mb-3 mt-6">Constraints:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {codingQuestion.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </Card>
            
            {/* Output Terminal */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Output Terminal</h3>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                {output || "Click 'Run Code' to see output"}
              </pre>
            </Card>
          </div>
          
          {/* Code Editor */}
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800"
                  >
                    {codingQuestion.languages.map(lang => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={handleRunCode} size="sm" variant="secondary">
                    <Play className="w-4 h-4 mr-1" />
                    Run Code
                  </Button>
                  <Button onClick={handleSubmitCode} size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Submit Code
                  </Button>
                </div>
              </div>
              
              <Editor
                height="500px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}