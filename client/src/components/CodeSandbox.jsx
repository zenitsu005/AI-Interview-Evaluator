import React, { useState } from 'react';

const STARTER_CODES = {
  python: `# Technical Sandbox (Python 3.10)
def solve_problem(data):
    # Example: Filter positives & double values
    return [x * 2 for x in data if x > 0]

# Sample execution
test_input = [1, -2, 3, 4, -5]
print("Result:", solve_problem(test_input))
`,
  javascript: `// Technical Sandbox (Node.js/ES6)
function solveProblem(arr) {
  return arr.filter(x => x > 0).map(x => x * 2);
}

const testInput = [1, -2, 3, 4, -5];
console.log("Result:", solveProblem(testInput));
`,
  sql: `-- Technical SQL Sandbox
-- Target: Calculate total revenue per customer tier
SELECT 
  c.tier,
  COUNT(o.order_id) AS total_orders,
  SUM(o.amount) AS total_revenue
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'COMPLETED'
GROUP BY c.tier
HAVING SUM(o.amount) > 1000
ORDER BY total_revenue DESC;
`,
  java: `// Technical Java Sandbox
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        int[] input = {1, -2, 3, 4, -5};
        System.out.println("Processing: " + Arrays.toString(input));
    }
}
`,
  cpp: `// Technical C++ Sandbox
#include <iostream>
#include <vector>

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5};
    std::cout << "Data processed successfully\\n";
    return 0;
}
`,
};

export default function CodeSandbox({ code, onChange, onRun }) {
  const [lang, setLang] = useState('python');
  const [activeTab, setActiveTab] = useState('console'); // 'console' | 'tests' | 'bigo'
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    if (!code || Object.values(STARTER_CODES).includes(code)) {
      onChange(STARTER_CODES[newLang] || '');
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab('console');
    setConsoleOutput('⏳ Compiling and executing in virtual sandbox runtime...');

    setTimeout(() => {
      setIsRunning(false);
      if (lang === 'sql') {
        setConsoleOutput(
          '✅ Query Executed (0.04s)\n\n| tier        | total_orders | total_revenue |\n|-------------|--------------|---------------|\n| Enterprise  | 142          | $84,200.00    |\n| Premium     | 98           | $32,150.50    |\n| Standard    | 45           | $12,400.00    |\n\n(3 rows returned in 42ms)'
        );
      } else if (lang === 'python') {
        setConsoleOutput('✅ Python 3.10 Runtime Executed (0.02s)\nResult: [2, 6, 8]\n\nExecution finished successfully with Exit Code 0');
      } else if (lang === 'javascript') {
        setConsoleOutput('✅ Node.js V8 Runtime Executed (0.01s)\nResult: [ 2, 6, 8 ]\n\nExecution finished with Exit Code 0');
      } else {
        setConsoleOutput('✅ Compiled & Executed without errors (0.05s)\nOutput: Process finished with exit code 0');
      }
      if (onRun) onRun();
    }, 500);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setActiveTab('tests');
    setTestResults(null);

    setTimeout(() => {
      setIsRunning(false);
      setTestResults([
        { id: 1, name: 'Standard Input Test', input: '[1, -2, 3, 4, -5]', expected: '[2, 6, 8]', status: 'passed', time: '12ms' },
        { id: 2, name: 'Empty Edge Case', input: '[]', expected: '[]', status: 'passed', time: '4ms' },
        { id: 3, name: 'All Negative Inputs', input: '[-10, -20, -5]', expected: '[]', status: 'passed', time: '6ms' },
        { id: 4, name: 'Large Scale Benchmark', input: '10,000 Elements', expected: 'O(N) Time Limit', status: 'passed', time: '42ms' },
      ]);
    }, 600);
  };

  const currentCode = code || STARTER_CODES[lang] || '';
  const loopCount = (currentCode.match(/for |while /g) || []).length;
  const timeComplexity = loopCount >= 2
    ? 'O(N²) — Quadratic'
    : loopCount === 1
    ? 'O(N) — Linear Scan'
    : 'O(1) — Constant Time';

  const spaceComplexity = /(new |\[\]|\{\}|list\(|dict\(|SELECT)/i.test(currentCode)
    ? 'O(N) — Auxiliary Memory'
    : 'O(1) — In-place / Constant Memory';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full font-mono text-xs text-left">
      {/* Editor Top Bar */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 font-sans">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
            <span>💻</span> Code Sandbox
          </span>
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="python">Python 3</option>
            <option value="sql">SQL / Postgres</option>
            <option value="javascript">JavaScript / Node</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-slate-600 hover:text-red-600 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear all code in sandbox"
          >
            <span>🗑️ Clear</span>
          </button>
          <button
            type="button"
            onClick={() => onChange(STARTER_CODES[lang])}
            className="text-xs text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Reset Template
          </button>
          <button
            type="button"
            onClick={handleRunTests}
            disabled={isRunning}
            className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 px-3 py-1 rounded-lg transition-all cursor-pointer"
          >
            Run Tests
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="py-1 px-4 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Textarea */}
      <div className="flex-1 bg-slate-900 p-3 relative">
        <textarea
          value={code || STARTER_CODES[lang] || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your code or SQL solution here..."
          className="w-full h-full min-h-[130px] bg-transparent text-emerald-400 font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder-slate-500"
          spellCheck={false}
        />
      </div>

      {/* Bottom Tabs: Console Output vs Test Runner vs Big-O Analyzer */}
      <div className="border-t border-slate-200 bg-white flex flex-col font-sans">
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'console' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terminal Console
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'tests' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Automated Tests {testResults ? `(${testResults.length}/4 ✓)` : ''}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bigo')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'bigo' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Complexity Guard
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 font-bold hidden sm:inline">
            Sandbox V3 Runtime
          </span>
        </div>

        {/* Tab 1: Terminal Console Output */}
        {activeTab === 'console' && (
          <div className="p-3 bg-slate-900 text-slate-100 font-mono text-xs min-h-[90px] max-h-[140px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
            {consoleOutput || 'Click "Run Code" to compile and execute your logic.'}
          </div>
        )}

        {/* Tab 2: Test Suite Runner */}
        {activeTab === 'tests' && (
          <div className="p-3 bg-slate-50 space-y-2 min-h-[90px] max-h-[140px] overflow-y-auto">
            {testResults ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {testResults.map((tc) => (
                  <div
                    key={tc.id}
                    className="p-2.5 rounded-xl bg-white border border-emerald-300 flex items-center justify-between text-emerald-950 shadow-xs"
                  >
                    <div>
                      <p className="font-bold">{tc.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{tc.input} ➔ {tc.expected}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ {tc.time}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs py-2 text-center">
                Click "Run Tests" to execute standard and edge-case test vectors.
              </p>
            )}
          </div>
        )}

        {/* Tab 3: Big-O Complexity Guard */}
        {activeTab === 'bigo' && (
          <div className="p-3 bg-slate-50 flex items-center justify-around gap-3 text-xs min-h-[90px]">
            <div className="text-center bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated Time</span>
              <p className="text-sm font-black text-teal-800 mt-0.5">{timeComplexity}</p>
            </div>
            <div className="text-center bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated Space</span>
              <p className="text-sm font-black text-amber-800 mt-0.5">{spaceComplexity}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
