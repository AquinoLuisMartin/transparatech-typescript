import React, { useEffect, useRef } from 'react';
import { Submission } from '../types/submission';

type Props = {
  submission: Submission | null;
  open: boolean;
  onClose: () => void;
};

const statusColor = (status?: string) => {
  if (status === 'pending') return 'text-yellow-700 bg-yellow-100';
  if (status === 'approved') return 'text-green-700 bg-green-100';
  if (status === 'rejected') return 'text-red-700 bg-red-100';
  return 'text-gray-700 bg-gray-100';
};

const SubmissionDetailsModal: React.FC<Props> = ({ submission, open, onClose }) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const prevActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      prevActive.current = document.activeElement as HTMLElement;
      setTimeout(() => closeRef.current?.focus(), 0);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab' && modalRef.current) {
          // simple trap: keep focus within modal
          const focusable = modalRef.current.querySelectorAll<HTMLElement>('button,a,[tabindex]:not([tabindex="-1"])');
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    } else {
      prevActive.current?.focus();
    }
  }, [open, onClose]);

  if (!open || !submission) return null;

  const mainFile = submission.files && submission.files.length > 0 ? submission.files[0] : null;

  const handleView = () => {
    if (mainFile) window.open(`/${mainFile}`, '_blank');
  };

  const handleDownload = () => {
    if (!mainFile) return;
    const a = document.createElement('a');
    a.href = `/${mainFile}`;
    a.download = mainFile;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-title"
        onClick={(e) => e.stopPropagation()}
        className="relative z-[10000] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out p-6 md:p-8 max-w-lg w-full space-y-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${statusColor(submission.status)} mr-2`} aria-hidden />
            <div>
              <h3 id="submission-title" className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">{submission.title}</h3>
              <span className={`ml-0 px-2 py-1 text-xs md:text-sm font-medium rounded-full ${submission.status === 'approved' ? 'bg-green-100 text-green-800' : submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={closeRef}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close details"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-200">
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 space-y-1">
            <div><strong>Category:</strong> {submission.category}</div>
            <div><strong>Submitted:</strong> {submission.submittedDate}</div>
            {submission.reviewer && <div><strong>Reviewer:</strong> {submission.reviewer}</div>}
            {submission.priority && <div><strong>Priority:</strong> {submission.priority}</div>}
          </div>

          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">Description</h4>
            <p className="whitespace-pre-line">{submission.description}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {submission.files.map((f, idx) => (
                <div key={idx} className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm md:text-base">
                  <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v-8"/></svg>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={handleView} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            View Document
          </button>

          <button onClick={handleDownload} className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7-7 7-7-7"/></svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailsModal;
