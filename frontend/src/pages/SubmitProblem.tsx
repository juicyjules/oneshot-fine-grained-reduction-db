import React from 'react';
import { SubmitProblemForm } from '../components/SubmitProblemForm';

export const SubmitProblem: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Submit New Problem</h2>
      <SubmitProblemForm />
    </div>
  );
};
