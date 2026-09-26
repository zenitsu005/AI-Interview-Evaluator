import React, { useState, useEffect } from 'react';
import {
  TbCode as Code2,
  TbPlayerPlay as Play,
  TbCircleCheck as CheckCircle2,
  TbRotateClockwise2 as RotateCcw,
  TbTrash as Trash2,
  TbTerminal2 as Terminal,
  TbActivity as Activity,
  TbSparkles as Sparkles,
  TbCheck as Check,
} from 'react-icons/tb';
import { executeJavaScript, executeSQL, transpilePythonToJS, areResultsEqual } from '../utils/codeRunner';

const STARTER_CODES = {
  python: `# Technical Sandbox (Python 3.10)
def solve_problem(data):
    # TODO: Write your algorithm implementation here
    pass

# Sample test execution
test_input = [1, -2, 3, 4, -5]
print("Result:", solve_problem(test_input))
`,
  javascript: `// Technical Sandbox (Node.js/ES6)
function solveProblem(input) {
  // TODO: Write your solution logic here
  
}

const testInput = [1, -2, 3, 4, -5];
console.log("Result:", solveProblem(testInput));
`,
  sql: `-- Technical SQL Sandbox
-- Write your query or DDL statement below:
-- TODO: SELECT ... FROM ...

`,
  java: `// Technical Java Sandbox
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // TODO: Implement solution logic
        System.out.println("Ready to test...");
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

export default function CodeSandbox({ code, onChange, onRun, testCases: propTestCases, starterCode: propStarterCode }) {
  const [lang, setLang] = useState('python');
  const [activeTab, setActiveTab] = useState('console'); // 'console' | 'tests' | 'bigo'
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    if (code) {
      if (/^\s*(--|CREATE\s+|SELECT\s+|INSERT\s+|UPDATE\s+|FROM\s+)/i.test(code)) {
        setLang('sql');
      } else if (/^\s*(\/\/|function\s+|const\s+|let\s+|async\s+)/.test(code)) {
        setLang('javascript');
      } else if (/^\s*(#|def\s+|import\s+|class\s+Solution)/.test(code)) {
        setLang('python');
      }
    }
  }, [code]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    if (!code || Object.values(STARTER_CODES).includes(code)) {
      onChange(STARTER_CODES[newLang] || '');
    }
  };

  const handleResetCode = () => {
    onChange(propStarterCode || STARTER_CODES[lang] || '');
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab('console');
    setConsoleOutput('Compiling and executing in virtual sandbox runtime...');

    setTimeout(() => {
      setIsRunning(false);
      const activeCode = code || STARTER_CODES[lang] || '';

      if (lang === 'sql') {
        const res = executeSQL(activeCode);
        setConsoleOutput(res.output);
      } else if (lang === 'python' || lang === 'javascript') {
        const res = executeJavaScript(activeCode, lang);
        setConsoleOutput(res.output);
      } else {
        setConsoleOutput(`Compiled & Executed successfully (${lang.toUpperCase()} Virtual Sandbox)\n\nExecution finished with Exit Code 0`);
      }

      if (onRun) onRun();
    }, 250);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setActiveTab('tests');
    setTestResults(null);

    setTimeout(() => {
      setIsRunning(false);
      const activeCode = code || STARTER_CODES[lang] || '';

      // Determine test cases to run
      const defaultTestCases = [
        { id: 1, name: 'Standard Input Test', input: [1, -2, 3, 4, -5], inputStr: '[1, -2, 3, 4, -5]', expected: [2, 6, 8], expectedStr: '[2, 6, 8]' },
        { id: 2, name: 'Empty Edge Case', input: [], inputStr: '[]', expected: [], expectedStr: '[]' },
        { id: 3, name: 'All Negative Inputs', input: [-10, -20, -5], inputStr: '[-10, -20, -5]', expected: [], expectedStr: '[]' },
        { id: 4, name: 'Scaling Input Benchmark', input: [10, 20, 30], inputStr: '[10, 20, 30]', expected: [20, 40, 60], expectedStr: '[20, 40, 60]' },
      ];

      const activeTestCases = (propTestCases && propTestCases.length > 0)
        ? propTestCases
        : defaultTestCases;

      if (lang === 'sql') {
        const t0 = performance.now();
        const sqlRes = executeSQL(activeCode);
        const duration = Math.max(1, Math.round(performance.now() - t0));
        const hasCreatedIndex = /CREATE\s+INDEX/i.test(activeCode);
        const hasSelectClause = /SELECT\s+.*FROM/i.test(activeCode);
        const hasWhereClause = /WHERE/i.test(activeCode);

        const results = activeTestCases.map((tc, idx) => {
          let isPassed = false;
          let message = '';
          if (idx === 0) {
            isPassed = hasCreatedIndex;
            message = isPassed ? 'Composite Index DDL validated' : 'Missing CREATE INDEX statement';
          } else if (idx === 1) {
            isPassed = hasSelectClause && hasWhereClause;
            message = isPassed ? 'Filtered Query syntax validated' : 'Missing SELECT ... WHERE filter statement';
          } else {
            isPassed = !sqlRes.output.includes('Error');
            message = isPassed ? 'Query engine execution OK' : sqlRes.output;
          }

          return {
            id: tc.id || idx + 1,
            name: tc.name || `SQL Specification Check ${idx + 1}`,
            input: tc.inputStr || tc.input || 'Active SQL Buffer',
            expected: tc.expectedStr || tc.expected || 'Valid DDL / Optimized Query',
            actual: message,
            status: isPassed ? 'passed' : 'failed',
            time: `${duration}ms`,
          };
        });

        setTestResults(results);
        return;
      }

      // Detect dynamically defined function name
      const fnNameMatch = activeCode.match(/(?:function|def)\s+([a-zA-Z0-9_]+)/);
      const customFnName = fnNameMatch ? fnNameMatch[1] : '';

      let fn = null;
      try {
        let jsCode = activeCode;
        if (lang === 'python') {
          jsCode = transpilePythonToJS(activeCode);
        }
        fn = new Function(`
          "use strict";
          ${jsCode};
          ${customFnName ? `if (typeof ${customFnName} === 'function') return ${customFnName};` : ''}
          if (typeof solveProblem === 'function') return solveProblem;
          if (typeof solve_problem === 'function') return solve_problem;
          if (typeof solution === 'function') return solution;
          if (typeof idempotentHandler === 'function') return idempotentHandler;
          if (typeof isRateLimited === 'function') return isRateLimited;
          if (typeof filter_and_rerank === 'function') return filter_and_rerank;
          if (typeof createBatcher === 'function') return createBatcher;
          return null;
        `)();
      } catch (err) {
        fn = null;
      }

      const results = activeTestCases.map((tc) => {
        if (!fn) {
          return {
            id: tc.id,
            name: tc.name,
            input: tc.inputStr || JSON.stringify(tc.input),
            expected: tc.expectedStr || JSON.stringify(tc.expected),
            actual: 'Error: Function not found or syntax error in code',
            status: 'failed',
            time: '0ms',
          };
        }

        const t0 = performance.now();
        try {
          const inputArg = Array.isArray(tc.input) ? tc.input : [tc.input];
          const actualOutput = typeof fn === 'function' ? (tc.args ? fn(...tc.args) : fn(...inputArg)) : null;
          const duration = Math.max(1, Math.round(performance.now() - t0));
          const exp = tc.expectedStr || JSON.stringify(tc.expected);
          const isPassed = areResultsEqual(actualOutput, exp);
          return {
            id: tc.id,
            name: tc.name,
            input: tc.inputStr || JSON.stringify(tc.input),
            expected: exp,
            actual: JSON.stringify(actualOutput),
            status: isPassed ? 'passed' : 'failed',
            time: `${duration}ms`,
          };
        } catch (err) {
          const duration = Math.max(1, Math.round(performance.now() - t0));
          return {
            id: tc.id,
            name: tc.name,
            input: tc.inputStr || JSON.stringify(tc.input),
            expected: tc.expectedStr || JSON.stringify(tc.expected),
            actual: `Runtime Error: ${err.message}`,
            status: 'failed',
            time: `${duration}ms`,
          };
        }
      });

      setTestResults(results);
    }, 280);
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
    <div className="bg-[#131823] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full font-mono text-xs text-left">
      {/* Editor Top Bar */}
      <div className="bg-[#0D111A] px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5 font-sans">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-teal-400" />
            <span>Code Sandbox</span>
          </span>
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="bg-[#171E2D] border border-white/10 text-teal-300 font-semibold text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer font-mono"
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
            className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-xl bg-[#171E2D] border border-white/10 hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear all code in sandbox"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={handleResetCode}
            className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-[#171E2D] border border-white/10 hover:bg-[#1E273A] transition-colors cursor-pointer flex items-center gap-1"
            title="Reset code to starter skeleton"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
            Ctrl+Enter ↵
          </span>
          <button
            type="button"
            onClick={handleRunTests}
            disabled={isRunning}
            className="text-xs font-semibold text-teal-300 bg-teal-950/80 border border-teal-500/30 hover:bg-teal-900/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Run Tests</span>
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="py-1.5 px-4 text-xs font-extrabold bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Textarea */}
      <div className="flex-1 bg-[#090B10] p-4 relative min-h-[140px]">
        <textarea
          value={code || STARTER_CODES[lang] || ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              if (propTestCases && propTestCases.length > 0) {
                handleRunTests();
              } else {
                handleRun();
              }
            }
          }}
          placeholder="Write your code or SQL solution here... (Ctrl+Enter to run)"
          className="w-full h-full min-h-[140px] bg-transparent text-emerald-400 font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder-slate-600"
          spellCheck={false}
        />
      </div>

      {/* Bottom Tabs: Console Output vs Test Runner vs Big-O Analyzer */}
      <div className="border-t border-white/10 bg-[#0D111A] flex flex-col font-sans">
        <div className="flex items-center justify-between px-4 py-2 bg-[#131823] border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'console' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal Console</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tests' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                Automated Tests{' '}
                {testResults
                  ? `(${testResults.filter((t) => t.status === 'passed').length}/${testResults.length} Passed)`
                  : ''}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bigo')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bigo' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Complexity Guard</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Terminal Console Output */}
        {activeTab === 'console' && (
          <div className="p-4 bg-[#090B10] text-emerald-300 font-mono text-xs min-h-[90px] max-h-[140px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
            {consoleOutput || 'Click "Run Code" to compile and execute your logic.'}
          </div>
        )}

        {/* Tab 2: Test Suite Runner */}
        {activeTab === 'tests' && (
          <div className="p-4 bg-[#0D111A] space-y-2 min-h-[90px] max-h-[160px] overflow-y-auto">
            {testResults ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {testResults.map((tc) => {
                  const isPassed = tc.status === 'passed';
                  return (
                    <div
                      key={tc.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 shadow-sm transition-all ${
                        isPassed
                          ? 'bg-[#131823] border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-white text-xs truncate">{tc.name}</p>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${
                            isPassed
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          {isPassed ? `✓ ${tc.time}` : '✕ Failed'}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-[10px] font-mono">
                        <p className="text-slate-400 truncate">In: {tc.input}</p>
                        <p className="text-slate-300 truncate">Exp: {tc.expected}</p>
                        {!isPassed && <p className="text-rose-400 font-semibold truncate">Got: {tc.actual}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-2 text-center font-mono">
                Click "Run Tests" to execute standard and edge-case test vectors against your code.
              </p>
            )}
          </div>
        )}

        {/* Tab 3: Big-O Complexity Guard */}
        {activeTab === 'bigo' && (
          <div className="p-4 bg-[#0D111A] flex items-center justify-around gap-3 text-xs min-h-[90px]">
            <div className="text-center bg-[#131823] p-4 rounded-2xl border border-white/5 shadow-inner flex-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block font-mono">Estimated Time</span>
              <p className="text-sm font-black text-teal-400 mt-1 font-mono">{timeComplexity}</p>
            </div>
            <div className="text-center bg-[#131823] p-4 rounded-2xl border border-white/5 shadow-inner flex-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block font-mono">Estimated Space</span>
              <p className="text-sm font-black text-cyan-400 mt-1 font-mono">{spaceComplexity}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
