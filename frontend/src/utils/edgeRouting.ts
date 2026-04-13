import { Node, Edge } from 'reactflow';

export function getSpacedEdges(nodes: Node[], edges: Edge[]) {
  const nodeConnections = new Map<string, { in: string[], out: string[] }>();

  nodes.forEach(node => {
    nodeConnections.set(node.id, { in: [], out: [] });
  });

  edges.forEach(edge => {
    if (nodeConnections.has(edge.source)) {
      nodeConnections.get(edge.source)!.out.push(edge.id);
    }
    if (nodeConnections.has(edge.target)) {
      nodeConnections.get(edge.target)!.in.push(edge.id);
    }
  });

  const newEdges = edges.map(edge => {
    const sourceData = nodeConnections.get(edge.source);
    const targetData = nodeConnections.get(edge.target);

    let sourceX = 50;
    let targetX = 50;

    if (sourceData && sourceData.out.length > 1) {
      const index = sourceData.out.indexOf(edge.id);
      const step = 80 / (sourceData.out.length - 1);
      sourceX = Math.round((10 + (index * step)) / 10) * 10;
    }

    if (targetData && targetData.in.length > 1) {
      const index = targetData.in.indexOf(edge.id);
      const step = 80 / (targetData.in.length - 1);
      targetX = Math.round((10 + (index * step)) / 10) * 10;
    }

    return {
      ...edge,
      sourceHandle: `s-${sourceX}`,
      targetHandle: `t-${targetX}`,
    };
  });

  return newEdges;
}
