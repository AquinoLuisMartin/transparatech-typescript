import React from 'react';
import { Submission } from '../types/submission';

type Props = {
  submission: Submission;
  onOpen: (s: Submission) => void;
};

const getStatusBadge = (status: string) => {
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (status === 'approved') return 'bg-green-100 text-green-800';
  if (status === 'rejected') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

const SubmissionCard: React.FC<Props> = ({ submission, onOpen }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(submission);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => onOpen(submission)}
      className="bg-white border rounded-lg p-4 hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium line-clamp-2 text-gray-900 dark:text-white">{submission.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(submission.status)}`}>{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{submission.description}</p>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{submission.category}</span>
          <span className="text-xs">{submission.submittedDate}</span>
        </div>
        <div className="text-xs text-gray-600">{submission.priority && <span className="px-2 py-1 bg-gray-50 rounded">{submission.priority}</span>}</div>
      </div>
    </div>
  );
};

export default SubmissionCard;
