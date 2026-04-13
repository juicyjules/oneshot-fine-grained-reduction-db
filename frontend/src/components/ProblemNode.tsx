import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const ProblemNode: React.FC<NodeProps> = ({ data, selected }) => {
  const { title, complexity_class, current_runtime, is_assumption, isFilterActive, isHighlighted } = data;

  const renderMath = (math: string) => {
    try {
      return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { throwOnError: false }) }} />;
    } catch {
      return <span>{math}</span>;
    }
  };

  return (
    <div className={`px-5 py-3 shadow-lg rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${selected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'} ${is_assumption ? 'border-dashed border-orange-400 from-orange-50 to-orange-100/50' : ''} ${isFilterActive && !isHighlighted ? 'opacity-30 grayscale' : ''} ${isHighlighted ? 'ring-2 ring-yellow-400' : ''} min-w-[180px] max-w-[250px] w-[250px]`}>
      <Handle type="target" position={Position.Top} className="w-16 h-2 !bg-indigo-500 !rounded-full border-none shadow-sm" />
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="font-bold text-base text-gray-800 leading-tight break-words">{title}</div>
          {complexity_class && (
            <div className="text-[10px] font-semibold tracking-wider uppercase bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md text-indigo-700 whitespace-nowrap">
              {complexity_class}
            </div>
          )}
        </div>

        {current_runtime && (
          <div className="text-sm text-gray-600 mt-1 bg-white/60 p-1.5 rounded-md border border-gray-100/50">
            <span className="text-xs text-gray-400 font-medium mr-1 uppercase">Cost</span>
            {renderMath(`O(${current_runtime})`)}
          </div>
        )}

        {is_assumption && (
          <div className="text-xs text-orange-600 font-bold mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Assumption
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-16 h-2 !bg-indigo-500 !rounded-full border-none shadow-sm" />
    </div>
  );
};
