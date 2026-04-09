import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CoreService } from '../api';

const problemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  latex_definition: z.string().optional(),
  complexity_class: z.string().optional(),
  is_assumption: z.boolean().optional().default(false),
  current_runtime: z.string().optional(),
});

type ProblemForm = z.infer<typeof problemSchema>;

export const SubmitProblem: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<any>({
    resolver: zodResolver(problemSchema),
  });

  const onSubmit = async (data: ProblemForm) => {
    try {
      await CoreService.createProblemApiProblemsPost(data);
      alert('Problem submitted successfully!');
      reset();
    } catch (error) {
      console.error(error);
      alert('Failed to submit problem');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Submit New Problem</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug (e.g. 3sat)</label>
              <input type="text" {...register('slug')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{String(errors.slug.message)}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" {...register('title')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{String(errors.title.message)}</p>}
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description (Markdown)</label>
          <textarea {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{String(errors.description.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">LaTeX Definition (Optional)</label>
          <input type="text" {...register('latex_definition')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Complexity Class (e.g. NP-complete)</label>
              <input type="text" {...register('complexity_class')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Runtime (e.g. n^2 log n)</label>
              <input type="text" {...register('current_runtime')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
        </div>

        <div className="flex items-center">
            <input type="checkbox" {...register('is_assumption')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label className="ml-2 block text-sm text-gray-900">This is an Assumption (e.g. SETH)</label>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700">
          Submit Problem
        </button>
      </form>
    </div>
  );
};
