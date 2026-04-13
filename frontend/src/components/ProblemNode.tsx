import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const ProblemNode: React.FC<NodeProps> = ({ data, selected }) => {
  const { title, complexity_class, current_runtime, is_assumption } = data;

  const renderMath = (math: string) => {
    try {
      return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { throwOnError: false }) }} />;
    } catch {
      return <span>{math}</span>;
    }
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-indigo-500' : 'border-gray-200'} ${is_assumption ? 'border-dashed border-orange-400 bg-orange-50' : ''} min-w-[150px]`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-indigo-500" />
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <div className="font-bold text-sm text-gray-800">{title}</div>
          {complexity_class && (
            <div className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
              {complexity_class}
            </div>
          )}
        </div>

        {current_runtime && (
          <div className="text-xs text-gray-500 mt-1">
            Cost: {renderMath(`O(${current_runtime})`)}
          </div>
        )}

        {is_assumption && (
          <div className="text-xs text-orange-600 font-medium mt-1">
            Assumption
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-indigo-500" />
    </div>
  );
};
