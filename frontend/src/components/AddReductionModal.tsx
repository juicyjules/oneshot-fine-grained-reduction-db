import React, { useState } from 'react';
import { CoreService, ReductionTypeEnum } from '../api';
import { Connection, Edge } from 'reactflow';

interface AddReductionModalProps {
  connection: Connection | Edge;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddReductionModal: React.FC<AddReductionModalProps> = ({ connection, onSuccess, onCancel }) => {
  const [technique, setTechnique] = useState('');
  const [isRandomized, setIsRandomized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connection.source || !connection.target) return;
    setIsSubmitting(true);
    try {
      await CoreService.createReductionApiReductionsPost({
        source_id: connection.source,
        target_id: connection.target,
        technique: technique || null,
        type: isRandomized ? ReductionTypeEnum.RANDOMIZED : ReductionTypeEnum.DETERMINISTIC,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create reduction", error);
      alert("Failed to create reduction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add New Reduction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Technique (optional)</label>
            <input
              type="text"
              value={technique}
              onChange={(e) => setTechnique(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g. Gadget reduction"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isRandomized}
              onChange={(e) => setIsRandomized(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Is this a randomized reduction?
            </label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
