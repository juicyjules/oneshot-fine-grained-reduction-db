import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { CoreService } from '../api';

import { ProblemNode } from '../components/ProblemNode';

const nodeTypes = {
  problemNode: ProblemNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 150, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    node.position = {
      x: nodeWithPosition.x - 150 / 2,
      y: nodeWithPosition.y - 80 / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const GraphView: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const fetchData = useCallback(async () => {
    try {
      const [problems, reductions] = await Promise.all([
        CoreService.getProblemsApiProblemsGet(),
        CoreService.getReductionsApiReductionsGet()
      ]);

      const initialNodes = problems.map((p: any) => ({
        id: p.id,
        type: 'problemNode',
        data: { ...p },
        position: { x: 0, y: 0 },
      }));

      const initialEdges = reductions.map((r: any) => ({
        id: r.id,
        source: r.source_id,
        target: r.target_id,
        label: r.technique || undefined,
        animated: r.type === 'Randomized',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        style: {
          strokeWidth: 2,
          stroke: r.type === 'Randomized' ? '#f59e0b' : '#6366f1',
        }
      }));

      const layouted = getLayoutedElements(initialNodes, initialEdges);
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

    } catch (error) {
      console.error("Failed to load graph data", error);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};
