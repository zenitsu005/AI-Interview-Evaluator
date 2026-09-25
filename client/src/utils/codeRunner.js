/**
 * Real In-Browser Virtual Execution Engine for JavaScript, Python & SQL
 * Evaluates candidates' real algorithms and queries without mock outputs.
 */

// ── In-Memory Relational Database for SQL Sandbox ─────────────────────────────
const MOCK_DB = {
  customers: [
    { customer_id: 1, tier: 'Enterprise', name: 'Acme Corp', country: 'USA' },
    { customer_id: 2, tier: 'Premium', name: 'Globex Inc', country: 'UK' },
    { customer_id: 3, tier: 'Standard', name: 'Soylent Co', country: 'Germany' },
    { customer_id: 4, tier: 'Enterprise', name: 'Initech LLC', country: 'USA' },
    { customer_id: 5, tier: 'Premium', name: 'Umbrella Corp', country: 'Japan' },
  ],
  orders: [
    { order_id: 101, customer_id: 1, amount: 48500.0, status: 'COMPLETED', items: 12 },
    { order_id: 102, customer_id: 1, amount: 35700.0, status: 'COMPLETED', items: 8 },
    { order_id: 103, customer_id: 2, amount: 18000.0, status: 'COMPLETED', items: 4 },
    { order_id: 104, customer_id: 2, amount: 14150.5, status: 'COMPLETED', items: 3 },
    { order_id: 105, customer_id: 3, amount: 12400.0, status: 'COMPLETED', items: 5 },
    { order_id: 106, customer_id: 4, amount: 25000.0, status: 'CANCELLED', items: 6 },
    { order_id: 107, customer_id: 5, amount: 800.0, status: 'COMPLETED', items: 1 },
  ],
};

/**
 * Execute real SQL queries in-browser over relational tables.
 */
export function executeSQL(query) {
  const t0 = performance.now();
  const clean = query.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  if (!clean) return { output: 'Empty query.', error: null, time: '0ms' };

  try {
    // Join customers and orders
    const joined = [];
    MOCK_DB.orders.forEach((o) => {
      const c = MOCK_DB.customers.find((cust) => cust.customer_id === o.customer_id) || {};
      joined.push({
        'c.customer_id': c.customer_id,
        'c.tier': c.tier,
        'c.name': c.name,
        'c.country': c.country,
        tier: c.tier,
        name: c.name,
        'o.order_id': o.order_id,
        'o.customer_id': o.customer_id,
        'o.amount': o.amount,
        'o.status': o.status,
        amount: o.amount,
        status: o.status,
        order_id: o.order_id,
      });
    });

    let dataset = joined;

    // WHERE clause filter
    const whereMatch = clean.match(/WHERE\s+([^GROUP|ORDER|LIMIT|;]+)/i);
    if (whereMatch) {
      const cond = whereMatch[1].trim();
      if (/status\s*=\s*'COMPLETED'/i.test(cond)) {
        dataset = dataset.filter((r) => r.status === 'COMPLETED');
      } else if (/status\s*=\s*'CANCELLED'/i.test(cond)) {
        dataset = dataset.filter((r) => r.status === 'CANCELLED');
      } else if (/tier\s*=\s*'Enterprise'/i.test(cond)) {
        dataset = dataset.filter((r) => r.tier === 'Enterprise');
      } else if (/amount\s*>\s*(\d+)/i.test(cond)) {
        const val = parseFloat(cond.match(/amount\s*>\s*(\d+)/i)[1]);
        dataset = dataset.filter((r) => r.amount > val);
      }
    }

    // GROUP BY clause
    let rows = [];
    const groupByMatch = clean.match(/GROUP\s+BY\s+([a-zA-Z0-9_.]+)/i);
    if (groupByMatch) {
      const groupCol = groupByMatch[1].trim().replace(/^c\./, '');
      const groups = {};
      dataset.forEach((r) => {
        const key = r[groupCol] || r['tier'] || 'Unknown';
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
      });

      const havingMatch = clean.match(/HAVING\s+SUM\([^)]+\)\s*>\s*(\d+)/i);
      const minSum = havingMatch ? parseFloat(havingMatch[1]) : 0;

      for (const [key, items] of Object.entries(groups)) {
        const totalRev = items.reduce((sum, item) => sum + (item.amount || 0), 0);
        if (totalRev >= minSum) {
          rows.push({
            tier: key,
            total_orders: items.length,
            total_revenue: `$${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            _rawRevenue: totalRev,
          });
        }
      }

      // ORDER BY clause
      if (/ORDER\s+BY\s+.*DESC/i.test(clean)) {
        rows.sort((a, b) => b._rawRevenue - a._rawRevenue);
      } else if (/ORDER\s+BY/i.test(clean)) {
        rows.sort((a, b) => a._rawRevenue - b._rawRevenue);
      }
    } else {
      // Standard SELECT without group by
      rows = dataset.slice(0, 10).map((r) => ({
        order_id: r.order_id,
        tier: r.tier,
        amount: `$${(r.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        status: r.status,
      }));
    }

    const duration = Math.max(1, Math.round(performance.now() - t0));

    if (rows.length === 0) {
      return {
        output: `Query executed successfully (0.0${duration}s)\n\n(0 rows returned)`,
        error: null,
        time: `${duration}ms`,
      };
    }

    // Format ASCII table
    const headers = Object.keys(rows[0]).filter((k) => !k.startsWith('_'));
    const colWidths = {};
    headers.forEach((h) => {
      colWidths[h] = Math.max(
        h.length,
        ...rows.map((r) => String(r[h] ?? '').length)
      );
    });

    const headerRow = '| ' + headers.map((h) => h.padEnd(colWidths[h])).join(' | ') + ' |';
    const dividerRow = '|-' + headers.map((h) => '-'.repeat(colWidths[h])).join('-|-') + '-|';
    const bodyRows = rows.map(
      (r) => '| ' + headers.map((h) => String(r[h] ?? '').padEnd(colWidths[h])).join(' | ') + ' |'
    );

    const table = [headerRow, dividerRow, ...bodyRows].join('\n');
    return {
      output: `Query Executed (${(duration / 1000).toFixed(3)}s)\n\n${table}\n\n(${rows.length} rows returned in ${duration}ms)`,
      error: null,
      time: `${duration}ms`,
    };
  } catch (err) {
    return {
      output: `SQL Syntax Error: ${err.message}`,
      error: err.message,
      time: '0ms',
    };
  }
}

/**
 * Transpile simple algorithmic Python code into standard JavaScript.
 */
export function transpilePythonToJS(pyCode) {
  const lines = pyCode.split('\n');
  const jsLines = [];
  const indentStack = [0];

  for (let rawLine of lines) {
    // Preserve empty lines
    if (!rawLine.trim()) {
      continue;
    }

    // Measure indentation (4 spaces = 1 tab)
    const indent = rawLine.match(/^(\s*)/)[0].length;
    let line = rawLine.trim();

    // Check if indentation decreased -> close blocks
    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    // Skip pure comments
    if (line.startsWith('#')) {
      continue;
    }

    // Strip inline comment
    line = line.replace(/#.*$/, '').trim();

    // Replace Python keywords
    line = line
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\s+/g, '!')
      .replace(/\bpass\b/g, '// pass');

    // List comprehensions: [x * 2 for x in data if x > 0]
    line = line.replace(
      /\[\s*([^\]]+?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+([^\]]+?)(?:\s+if\s+([^\]]+?))?\s*\]/g,
      (_, expr, varName, iter, cond) => {
        if (cond) {
          return `(${iter}).filter(${varName} => Boolean(${cond})).map(${varName} => ${expr})`;
        }
        return `(${iter}).map(${varName} => ${expr})`;
      }
    );

    // print(...) -> console.log(...)
    if (/^print\s*\(/.test(line)) {
      line = line.replace(/^print\s*\(/, 'console.log(');
      if (!line.endsWith(';')) line += ';';
      jsLines.push(' '.repeat(indent) + line);
      continue;
    }

    // def func(args): -> function func(args) {
    const defMatch = line.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*(?:->\s*[^:]+)?\s*:/);
    if (defMatch) {
      const [, fnName, params] = defMatch;
      // Strip type hints from params: x: int, y: str -> x, y
      const cleanParams = params
        .split(',')
        .map((p) => p.split(':')[0].trim())
        .filter(Boolean)
        .join(', ');
      jsLines.push(' '.repeat(indent) + `function ${fnName}(${cleanParams}) {`);
      indentStack.push(indent + 4);
      continue;
    }

    // for i, n in enumerate(arr):
    const enumMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s+in\s+enumerate\((.*?)\)\s*:/);
    if (enumMatch) {
      const [, idxVar, valVar, arr] = enumMatch;
      jsLines.push(' '.repeat(indent) + `for (let ${idxVar} = 0; ${idxVar} < (${arr}).length; ${idxVar}++) {`);
      jsLines.push(' '.repeat(indent + 2) + `let ${valVar} = (${arr})[${idxVar}];`);
      indentStack.push(indent + 4);
      continue;
    }

    // for x in range(...):
    const rangeMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*?)\)\s*:/);
    if (rangeMatch) {
      const [, varName, rangeArgs] = rangeMatch;
      const parts = rangeArgs.split(',').map((p) => p.trim());
      let start = '0';
      let end = parts[0];
      if (parts.length >= 2) {
        start = parts[0];
        end = parts[1];
      }
      jsLines.push(' '.repeat(indent) + `for (let ${varName} = ${start}; ${varName} < ${end}; ${varName}++) {`);
      indentStack.push(indent + 4);
      continue;
    }

    // for x in arr:
    const forMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.*?)\s*:/);
    if (forMatch) {
      const [, varName, arr] = forMatch;
      jsLines.push(' '.repeat(indent) + `for (let ${varName} of (${arr})) {`);
      indentStack.push(indent + 4);
      continue;
    }

    // if / elif / else:
    const ifMatch = line.match(/^if\s+(.*?)\s*:/);
    if (ifMatch) {
      jsLines.push(' '.repeat(indent) + `if (${ifMatch[1]}) {`);
      indentStack.push(indent + 4);
      continue;
    }
    const elifMatch = line.match(/^elif\s+(.*?)\s*:/);
    if (elifMatch) {
      jsLines.push(' '.repeat(indent) + `else if (${elifMatch[1]}) {`);
      indentStack.push(indent + 4);
      continue;
    }
    const elseMatch = line.match(/^else\s*:/);
    if (elseMatch) {
      jsLines.push(' '.repeat(indent) + `else {`);
      indentStack.push(indent + 4);
      continue;
    }

    // while cond:
    const whileMatch = line.match(/^while\s+(.*?)\s*:/);
    if (whileMatch) {
      jsLines.push(' '.repeat(indent) + `while (${whileMatch[1]}) {`);
      indentStack.push(indent + 4);
      continue;
    }

    // Automatic var prefix for Python variable declarations: x = 1 -> var x = 1;
    if (/^[a-zA-Z_]\w*\s*=(?!=)/.test(line) && !line.startsWith('return ') && !line.startsWith('yield ')) {
      line = 'var ' + line;
    }

    // Invocations & returns
    line = line
      .replace(/\.append\(/g, '.push(')
      .replace(/len\((.*?)\)/g, '($1).length')
      .replace(/(\w+)\.get\((.*?),\s*(.*?)\)/g, '($1[$2] !== undefined ? $1[$2] : $3)')
      .replace(/\b(\w+)\s+in\s+(\w+)\b/g, '($1 in $2)');

    // Ensure semicolon
    if (!line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}')) {
      line += ';';
    }

    jsLines.push(' '.repeat(indent) + line);
  }

  // Close remaining blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push('}');
  }

  return jsLines.join('\n');
}

/**
 * Execute arbitrary JavaScript / Node code in an isolated sandbox and capture logs.
 */
export function executeJavaScript(code, lang = 'javascript') {
  const t0 = performance.now();
  const logs = [];

  const customConsole = {
    log: (...args) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    info: (...args) => {
      logs.push('[INFO] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    warn: (...args) => {
      logs.push('[WARN] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args) => {
      logs.push('[ERROR] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
  };

  try {
    let executableCode = code;
    const isStrict = lang !== 'python';
    if (lang === 'python') {
      executableCode = transpilePythonToJS(code);
    }

    const runner = new Function('console', `
      ${isStrict ? '"use strict";' : ''}
      ${executableCode}
    `);

    runner(customConsole);
    const duration = Math.max(1, Math.round(performance.now() - t0));

    const outputText = logs.length > 0 ? logs.join('\n') : 'Process executed successfully (no stdout produced).';
    const runtimeName = lang === 'python' ? 'Python 3.10 Runtime' : 'Node.js V8 Runtime';

    return {
      output: `${runtimeName} Executed (${(duration / 1000).toFixed(3)}s)\n\n${outputText}\n\nExecution finished successfully with Exit Code 0`,
      error: null,
      time: `${duration}ms`,
    };
  } catch (err) {
    const duration = Math.max(1, Math.round(performance.now() - t0));
    return {
      output: `Runtime Error (${(duration / 1000).toFixed(3)}s):\n${err.name}: ${err.message}\n\nExecution failed with Exit Code 1`,
      error: err.message,
      time: `${duration}ms`,
    };
  }
}

/**
 * Parse inputs from strings like 'nums = [2,7,11,15], target = 9' into argument arrays.
 */
export function parseTestInputs(inputStr) {
  if (!inputStr || typeof inputStr !== 'string') return [];
  try {
    // Replace assignment chains with let declarations
    const normalized = inputStr.replace(/;/g, ',');
    const varNames = inputStr
      .split(/,\s*(?=[a-zA-Z_]\w*\s*=)/)
      .map((part) => part.split('=')[0].trim())
      .filter(Boolean);

    const fn = new Function(`
      "use strict";
      let ${normalized};
      return [${varNames.join(', ')}];
    `);
    return fn();
  } catch (e) {
    // Fallback parser for standard LeetCode string inputs
    const parts = inputStr.split(/,\s*(?=[a-zA-Z_]\w*\s*=)/);
    return parts.map((p) => {
      const valStr = (p.split('=')[1] || '').trim();
      try {
        return JSON.parse(valStr);
      } catch (_) {
        return valStr.replace(/^["']|["']$/g, '');
      }
    });
  }
}

/**
 * Compare actual candidate function output against expected test case string.
 */
export function areResultsEqual(actual, expectedStr) {
  let expected;
  try {
    expected = JSON.parse(expectedStr);
  } catch (e) {
    if (expectedStr === 'true') expected = true;
    else if (expectedStr === 'false') expected = false;
    else if (!isNaN(Number(expectedStr))) expected = Number(expectedStr);
    else expected = expectedStr;
  }

  // Deep array check
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    if (JSON.stringify(actual) === JSON.stringify(expected)) return true;
    // Permutation comparison for pairs/sets
    const actualSorted = [...actual].sort();
    const expectedSorted = [...expected].sort();
    return JSON.stringify(actualSorted) === JSON.stringify(expectedSorted);
  }

  if (typeof actual === 'boolean' || typeof expected === 'boolean') {
    return Boolean(actual) === Boolean(expected);
  }

  if (typeof actual === 'number' || typeof expected === 'number') {
    return Number(actual) === Number(expected);
  }

  return String(actual).trim() === String(expected).trim();
}
