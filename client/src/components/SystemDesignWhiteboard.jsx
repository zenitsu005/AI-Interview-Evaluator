import React, { useState, useRef } from 'react';

const ARCHITECTURE_BLOCKS = [
  { type: 'client', label: 'Client / Web App', icon: '📱', color: 'border-blue-300 bg-blue-50 text-blue-900' },
  { type: 'lb', label: 'Load Balancer (ALB)', icon: '⚖️', color: 'border-amber-300 bg-amber-50 text-amber-900' },
  { type: 'api', label: 'API Gateway', icon: '🚪', color: 'border-teal-300 bg-teal-50 text-teal-900' },
  { type: 'service', label: 'Microservice (App)', icon: '⚙️', color: 'border-purple-300 bg-purple-50 text-purple-900' },
  { type: 'cache', label: 'Redis / Memcached', icon: '⚡', color: 'border-red-300 bg-red-50 text-red-900' },
  { type: 'db', label: 'Postgres (Primary/Replica)', icon: '🗄️', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
  { type: 'queue', label: 'Kafka / Event Bus', icon: '📬', color: 'border-indigo-300 bg-indigo-50 text-indigo-900' },
];

export default function SystemDesignWhiteboard({ onSnapshot }) {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'client', label: 'Client / React App', x: 40, y: 110 },
    { id: 2, type: 'lb', label: 'Load Balancer', x: 220, y: 110 },
    { id: 3, type: 'service', label: 'Auth & API Service', x: 400, y: 50 },
    { id: 4, type: 'cache', label: 'Redis Cache Cluster', x: 580, y: 50 },
    { id: 5, type: 'db', label: 'PostgreSQL Database', x: 580, y: 170 },
  ]);

  const [connections, setConnections] = useState([
    { from: 1, to: 2, label: 'HTTPS / TLS' },
    { from: 2, to: 3, label: 'Internal RPC' },
    { from: 3, to: 4, label: 'Read-Through' },
    { from: 3, to: 5, label: 'Write / Query' },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const canvasAreaRef = useRef(null);

  const addBlock = (block) => {
    const newNode = {
      id: Date.now(),
      type: block.type,
      label: block.label,
      x: 200 + Math.floor(Math.random() * 200),
      y: 80 + Math.floor(Math.random() * 100),
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleNodeDrag = (e, id) => {
    if (!canvasAreaRef.current) return;
    const rect = canvasAreaRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(rect.width - 150, e.clientX - rect.left - 60));
    const newY = Math.max(10, Math.min(rect.height - 60, e.clientY - rect.top - 20));

    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleConnect = (targetId) => {
    if (!selectedNode || selectedNode === targetId) {
      setSelectedNode(targetId);
      return;
    }

    const exists = connections.some(
      (c) => (c.from === selectedNode && c.to === targetId) || (c.from === targetId && c.to === selectedNode)
    );

    if (!exists) {
      setConnections((prev) => [...prev, { from: selectedNode, to: targetId, label: 'Data Flow' }]);
    }
    setSelectedNode(null);
  };

  const clearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full font-sans text-left">
      {/* Top Toolbar */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span>📐</span> Interactive System Design Canvas
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline font-mono">
            (Click 2 components to link with an arrow)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Clear Grid
          </button>
        </div>
      </div>

      {/* Palette Toolbar */}
      <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mr-1 flex-shrink-0">
          + Add Block:
        </span>
        {ARCHITECTURE_BLOCKS.map((b) => (
          <button
            key={b.type}
            type="button"
            onClick={() => addBlock(b)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5 flex-shrink-0 transition-all active:scale-95 shadow-xs cursor-pointer font-medium"
          >
            <span>{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      {/* SVG Canvas Grid */}
      <div
        ref={canvasAreaRef}
        className="flex-1 relative bg-slate-50/50 [background-size:16px_16px] min-h-[260px] overflow-hidden"
      >
        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
            </marker>
          </defs>
          {connections.map((c, i) => {
            const fromNode = nodes.find((n) => n.id === c.from);
            const toNode = nodes.find((n) => n.id === c.to);
            if (!fromNode || !toNode) return null;
            const x1 = fromNode.x + 65;
            const y1 = fromNode.y + 20;
            const x2 = toNode.x + 65;
            const y2 = toNode.y + 20;

            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#0d9488"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 5}
                  fill="#0f766e"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-sans font-bold"
                >
                  {c.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((n) => {
          const blockCfg = ARCHITECTURE_BLOCKS.find((b) => b.type === n.type) || ARCHITECTURE_BLOCKS[0];
          const isSelected = selectedNode === n.id;

          return (
            <div
              key={n.id}
              onClick={() => handleConnect(n.id)}
              onMouseDown={() => setDraggedNodeId(n.id)}
              onMouseMove={(e) => draggedNodeId === n.id && handleNodeDrag(e, n.id)}
              onMouseUp={() => setDraggedNodeId(null)}
              style={{ left: `${n.x}px`, top: `${n.y}px` }}
              className={`absolute cursor-move select-none px-3 py-2 rounded-xl border shadow-sm text-xs font-bold flex items-center gap-2 transition-transform active:scale-95 ${
                isSelected
                  ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50 text-teal-950 shadow-md'
                  : blockCfg.color
              }`}
            >
              <span>{blockCfg.icon}</span>
              <span>{n.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
