'use client';

import { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Display' },
    position: { x: 250, y: 0 },
    style: {
      background: '#8aadf4',
      color: '#24273a',
      border: '2px solid #8aadf4',
      borderRadius: '8px',
      padding: '10px',
      fontWeight: 'bold',
    },
  },
  {
    id: '2',
    data: { label: 'Debug' },
    position: { x: 100, y: 100 },
    style: {
      background: '#a6da95',
      color: '#24273a',
      border: '2px solid #a6da95',
      borderRadius: '8px',
      padding: '10px',
      fontWeight: 'bold',
    },
  },
  {
    id: '3',
    data: { label: 'Clone' },
    position: { x: 400, y: 100 },
    style: {
      background: '#f5a97f',
      color: '#24273a',
      border: '2px solid #f5a97f',
      borderRadius: '8px',
      padding: '10px',
      fontWeight: 'bold',
    },
  },
  {
    id: '4',
    data: { label: 'Copy' },
    position: { x: 400, y: 200 },
    style: {
      background: '#eed49f',
      color: '#24273a',
      border: '2px solid #eed49f',
      borderRadius: '8px',
      padding: '10px',
      fontWeight: 'bold',
    },
  },
  {
    id: '5',
    data: { label: 'MyStruct' },
    position: { x: 250, y: 300 },
    style: {
      background: '#c6a0f6',
      color: '#24273a',
      border: '3px solid #c6a0f6',
      borderRadius: '8px',
      padding: '12px',
      fontWeight: 'bold',
      fontSize: '16px',
    },
  },
  {
    id: '6',
    data: { label: 'Iterator' },
    position: { x: 50, y: 200 },
    style: {
      background: '#91d7e3',
      color: '#24273a',
      border: '2px solid #91d7e3',
      borderRadius: '8px',
      padding: '10px',
      fontWeight: 'bold',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-5',
    source: '5',
    target: '1',
    label: 'implements',
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#8aadf4',
    },
    style: { stroke: '#8aadf4', strokeWidth: 2 },
    labelStyle: { fill: '#cad3f5', fontSize: 12 },
    labelBgStyle: { fill: '#1e2030' },
  },
  {
    id: 'e2-5',
    source: '5',
    target: '2',
    label: 'implements',
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#a6da95',
    },
    style: { stroke: '#a6da95', strokeWidth: 2 },
    labelStyle: { fill: '#cad3f5', fontSize: 12 },
    labelBgStyle: { fill: '#1e2030' },
  },
  {
    id: 'e3-5',
    source: '5',
    target: '3',
    label: 'implements',
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#f5a97f',
    },
    style: { stroke: '#f5a97f', strokeWidth: 2 },
    labelStyle: { fill: '#cad3f5', fontSize: 12 },
    labelBgStyle: { fill: '#1e2030' },
  },
  {
    id: 'e4-3',
    source: '4',
    target: '3',
    label: 'extends',
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#eed49f',
    },
    style: { stroke: '#eed49f', strokeWidth: 2, strokeDasharray: '5,5' },
    labelStyle: { fill: '#cad3f5', fontSize: 12 },
    labelBgStyle: { fill: '#1e2030' },
  },
  {
    id: 'e6-5',
    source: '5',
    target: '6',
    label: 'implements',
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#91d7e3',
    },
    style: { stroke: '#91d7e3', strokeWidth: 2 },
    labelStyle: { fill: '#cad3f5', fontSize: 12 },
    labelBgStyle: { fill: '#1e2030' },
  },
];

export default function TraitRelationship() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="my-8 w-full h-96 bg-mantle rounded-lg border border-overlay0/30 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
        style={{ background: '#24273a' }}
      >
        <Controls
          style={{
            background: '#1e2030',
            border: '1px solid #363a4f',
            borderRadius: '8px',
          }}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#363a4f"
        />
      </ReactFlow>

      <div className="absolute bottom-4 left-4 bg-surface0/90 backdrop-blur px-4 py-2 rounded-lg border border-overlay0/30">
        <div className="text-xs font-semibold text-text mb-2">Trait 继承关系</div>
        <div className="text-xs text-subtext1 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue"></div>
            <span>实现（implements）</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-yellow" style={{ borderTop: '2px dashed' }}></div>
            <span>继承（trait bounds）</span>
          </div>
        </div>
      </div>
    </div>
  );
}
