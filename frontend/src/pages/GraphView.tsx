import { getSpacedEdges } from '../utils/edgeRouting';
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
import { CoreService, ReductionTypeEnum } from '../api';
import { Node, Edge, Position, Connection } from 'reactflow';
import { Panel } from 'reactflow';
import { SubmitProblemForm } from '../components/SubmitProblemForm';
import { AddReductionModal } from '../components/AddReductionModal';


import { ProblemNode } from '../components/ProblemNode';

const nodeTypes = {
  problemNode: ProblemNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 300, height: 120 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - 300 / 2,
      y: nodeWithPosition.y - 120 / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const GraphView: React.FC = () => {



  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isProblemModalOpen, setIsProblemModalOpen] = React.useState(false);
  const [filterText, setFilterText] = React.useState('');
  const [rawProblems, setRawProblems] = React.useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [rawReductions, setRawReductions] = React.useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [pendingConnection, setPendingConnection] = React.useState<Connection | Edge | null>(null);





  const fetchData = useCallback(async () => {
    try {
      const [problems, reductions] = await Promise.all([
        CoreService.getProblemsApiProblemsGet(),
        CoreService.getReductionsApiReductionsGet()
      ]);
      setRawProblems(problems);
      setRawReductions(reductions);
    } catch (error) {
      console.error("Failed to load graph data", error);
    }
  }, []);

  const onConnect = useCallback((params: Connection | Edge) => {
    if (!params.source || !params.target) return;
    setPendingConnection(params);
  }, []);

  useEffect(() => {
    void fetchData(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchData]);

  useEffect(() => {
    if (rawProblems.length === 0 && rawReductions.length === 0) return;

    const initialNodes: Node[] = rawProblems.map((p) => {
      const isFilterActive = filterText.trim().length > 0;
      const matchesFilter = isFilterActive && (
        (p.title && p.title.toLowerCase().includes(filterText.toLowerCase())) ||
        (p.current_runtime && p.current_runtime.toLowerCase().includes(filterText.toLowerCase())) ||
        (p.complexity_class && p.complexity_class.toLowerCase().includes(filterText.toLowerCase()))
      );

      return {
        id: p.id,
        type: 'problemNode',
        data: { ...p, isFilterActive, isHighlighted: matchesFilter },
        position: { x: 0, y: 0 },
      };
    });

    const baseEdges: Edge[] = rawReductions.map((r) => ({
      id: r.id,
      source: r.source_id,
      target: r.target_id,
      label: r.technique || undefined,
      animated: r.type === ReductionTypeEnum.RANDOMIZED,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      style: {
        strokeWidth: 2,
        stroke: r.type === ReductionTypeEnum.RANDOMIZED ? '#f59e0b' : '#6366f1',
      }
    }));

    const initialEdges = getSpacedEdges(initialNodes, baseEdges);

    const layouted = getLayoutedElements(initialNodes, initialEdges);
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }, [rawProblems, rawReductions, filterText, setNodes, setEdges]);


  return (
    <div style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >

        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
        <Panel position="top-right" className="bg-white p-2 rounded shadow flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search problems, runtimes..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setIsProblemModalOpen(true)}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            Add Problem
          </button>
        </Panel>
      </ReactFlow>

      {isProblemModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Add New Problem</h2>
            <SubmitProblemForm
              isModal={true}
              onCancel={() => setIsProblemModalOpen(false)}
              onSuccess={() => {
                setIsProblemModalOpen(false);
                void fetchData();
              }}
            />
          </div>
        </div>
      )}

      {pendingConnection && (
        <AddReductionModal
          connection={pendingConnection}
          onSuccess={() => {
            setPendingConnection(null);
            void fetchData();
          }}
          onCancel={() => setPendingConnection(null)}
        />
      )}
    </div>
  );
};
