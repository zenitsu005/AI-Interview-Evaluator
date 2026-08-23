import React, { useState, useRef } from 'react';
import {
  IconLayoutGrid as LayoutGrid,
  IconRotateClockwise2 as RotateCcw,
  IconTrash as Trash2,
  IconStack2 as Layers,
  IconCpu as Cpu,
  IconDatabase as Database,
  IconServer as Server,
  IconDeviceFloppy as HardDrive,
  IconDeviceMobile as Smartphone,
  IconScale as Scale,
  IconNetwork as Network,
  IconBolt as Zap,
} from '@tabler/icons-react';

const ARCHITECTURE_BLOCKS = [
  { type: 'client', label: 'Client / Web App', icon: Smartphone, color: 'border-blue-500/40 bg-blue-950/60 text-blue-300' },
  { type: 'lb', label: 'Load Balancer (ALB)', icon: Scale, color: 'border-amber-500/40 bg-amber-950/60 text-amber-300' },
  { type: 'api', label: 'API Gateway', icon: Network, color: 'border-teal-500/40 bg-teal-950/60 text-teal-300' },
  { type: 'service', label: 'Microservice (App)', icon: Server, color: 'border-purple-500/40 bg-purple-950/60 text-purple-300' },
  { type: 'cache', label: 'Redis / Memcached', icon: Zap, color: 'border-rose-500/40 bg-rose-950/60 text-rose-300' },
  { type: 'db', label: 'Postgres (SQL)', icon: Database, color: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300' },
  { type: 'queue', label: 'Kafka / Event Bus', icon: Layers, color: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300' },
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
    <div className="bg-[#131823] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full font-sans text-left">
      {/* Top Toolbar */}
      <div className="bg-[#0D111A] px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-teal-400" />
            <span>Interactive System Design Canvas</span>
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline font-mono">
            (Click 2 components to link with an arrow)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-[#171E2D] border border-white/10 hover:bg-[#1E273A] transition-colors cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Grid</span>
          </button>
        </div>
      </div>

      {/* Palette Toolbar */}
      <div className="bg-[#131823] px-4 py-2.5 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mr-1 flex-shrink-0 font-mono">
          + Add Block:
        </span>
        {ARCHITECTURE_BLOCKS.map((b) => {
          const Icon = b.icon;
          return (
            <button
              key={b.type}
              type="button"
              onClick={() => addBlock(b)}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#0D111A] hover:bg-[#171E2D] border border-white/10 text-slate-200 flex items-center gap-1.5 flex-shrink-0 transition-all active:scale-95 shadow-sm cursor-pointer font-medium"
            >
              <Icon className="w-3.5 h-3.5 text-teal-400" />
              <span>{b.label}</span>
            </button>
          );
        })}
      </div>

      {/* SVG Canvas Grid */}
      <div
        ref={canvasAreaRef}
        className="flex-1 relative bg-[#0B0D13] bg-grid-pattern [background-size:24px_24px] min-h-[260px] overflow-hidden"
      >
        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#14b8a6" />
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
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 5}
                  fill="#5eead4"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-mono font-bold"
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
          const Icon = blockCfg.icon;
          const isSelected = selectedNode === n.id;

          return (
            <div
              key={n.id}
              onClick={() => handleConnect(n.id)}
              onMouseDown={() => setDraggedNodeId(n.id)}
              onMouseMove={(e) => draggedNodeId === n.id && handleNodeDrag(e, n.id)}
              onMouseUp={() => setDraggedNodeId(null)}
              style={{ left: `${n.x}px`, top: `${n.y}px` }}
              className={`absolute cursor-move select-none px-3.5 py-2.5 rounded-2xl border shadow-xl text-xs font-bold flex items-center gap-2 transition-transform active:scale-95 ${
                isSelected
                  ? 'ring-2 ring-teal-400 border-teal-400 bg-teal-950 text-teal-200 shadow-teal-500/20'
                  : blockCfg.color
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{n.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
