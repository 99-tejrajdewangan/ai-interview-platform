import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import Button from '../ui/Button';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onRun?: (code: string) => void;
  onSubmit?: (code: string) => void;
  readOnly?: boolean;
}

const LANGUAGE_TEMPLATES: Record<string, string> = {
  javascript: `function solution(nums, target) {
    // Write your solution here
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
  python: `def solution(nums, target):
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`
};

export default function CodeEditor({ 
  initialCode, 
  language = 'javascript', 
  onRun, 
  onSubmit,
  readOnly = false 
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || LANGUAGE_TEMPLATES[language]);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [output, setOutput] = useState('');

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    setCode(LANGUAGE_TEMPLATES[newLanguage]);
  };

  const handleRunCode = () => {
    setOutput('Running code...\n');
    setTimeout(() => {
      setOutput(`✓ Code executed successfully!

Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Test Results:
✅ Test Case 1: Passed
✅ Test Case 2: Passed
✅ Test Case 3: Passed

Time Complexity: O(n)
Space Complexity: O(n)

All test cases passed!`);
      onRun?.(code);
    }, 1500);
  };

  const handleSubmitCode = () => {
    setOutput('Submitting solution...\n');
    setTimeout(() => {
      setOutput(`✓ Solution submitted successfully!

Score: 95/100
Feedback:
- Correct solution
- Optimal time complexity
- Good variable naming
- Consider edge cases

Status: Accepted`);
      onSubmit?.(code);
    }, 1500);
  };

  const handleReset = () => {
    setCode(LANGUAGE_TEMPLATES[currentLanguage]);
    setOutput('');
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900 p-4' : ''}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            disabled={readOnly}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          
          <div className="flex gap-2">
            <Button onClick={handleRunCode} size="sm" variant="secondary">
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
            <Button onClick={handleSubmitCode} size="sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Submit
            </Button>
            <Button onClick={handleReset} size="sm" variant="secondary">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Editor */}
      <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px]'}`}>
        <Editor
          height="100%"
          language={currentLanguage}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            readOnly: readOnly,
            scrollBeyondLastLine: false,
            wordWrap: 'on'
          }}
        />
      </div>

      {/* Output Console */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-400">Output</h3>
          <button
            onClick={() => setOutput('')}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Clear
          </button>
        </div>
        <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap overflow-x-auto">
          {output || 'Click "Run" to see output'}
        </pre>
      </div>
    </div>
  );
}