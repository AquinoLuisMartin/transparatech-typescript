import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PageMeta from '../../../components/common/PageMeta';
import UploadDocuments from './UploadDocuments';
import { submissions as mySubmissionsData } from './MySubmissions';
import { activities as activityLogData } from './ActivityLog';
import SubmissionDetailsModal from '../../../components/SubmissionDetailsModal';
import { Submission, OfficerSubmission, ActivityLogItem } from '../../../types/submission';

const OfficerDashboard: React.FC = () => {
  // Mock data for submission status
  const statusOverview = {
    pending: { count: 8, percentage: 40 },
    approved: { count: 10, percentage: 50 },
    rejected: { count: 2, percentage: 10 }
  };

  const [recentSubmissions, setRecentSubmissions] = useState<(OfficerSubmission | Submission)[]>([
    {
      id: 1,
      title: "Monthly Budget Report - October 2024",
      type: "Financial Report",
      submittedDate: "2024-10-31",
      status: "pending",
      reviewer: "Admin Department"
    },
    {
      id: 2,
      title: "Equipment Purchase Receipt - Laptops",
      type: "Receipt",
      submittedDate: "2024-10-28",
      status: "approved",
      reviewer: "Finance Team",
      approvedDate: "2024-10-30"
    },
    {
      id: 3,
      title: "Travel Expense Report - Conference",
      type: "Expense Report",
      submittedDate: "2024-10-25",
      status: "rejected",
      reviewer: "Accounting",
      rejectionReason: "Missing required receipts"
    },
    {
      id: 4,
      title: "Quarterly Performance Report Q3",
      type: "Performance Report",
      submittedDate: "2024-10-20",
      status: "approved",
      reviewer: "Management",
      approvedDate: "2024-10-22"
    },
    {
      id: 5,
      title: "Office Supplies Purchase Order",
      type: "Purchase Order",
      submittedDate: "2024-10-18",
      status: "pending",
      reviewer: "Procurement"
    }
  ]);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Show Recent Submissions by default on initial load, but do NOT mark any quick-action button as "active" until clicked
  const [showMySubmissions, setShowMySubmissions] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  // Track which quick-action (if any) the user has explicitly activated. null means none yet.
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  // Preload recent activity data so the Activity panel can be shown quickly when requested
  const [recentActivity, setRecentActivity] = useState<ActivityLogItem[]>(activityLogData);

  useEffect(() => {
    if (isUploadOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isUploadOpen]);

  useEffect(() => {
    // Modal should only close when the X is clicked; do not close on Escape
    return () => {};
  }, [isUploadOpen]);

  const handleSubmitSuccess = (submission: OfficerSubmission | Submission) => {
    // Prepend new submission and close modal handled by UploadDocuments when it calls onClose
    setRecentSubmissions(prev => [submission, ...prev]);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'approved':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageMeta 
        title="Officer Dashboard | PUPSMB TransparaTech" 
        description="Officer submission status overview and document management"
      />
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Officer Dashboard
            </h1>
            <button onClick={() => setIsUploadOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor your document submissions and approval status
          </p>
        </div>
        {/* Upload Modal: full-viewport wrapper so it always sits above header/sidebar */}
        {isUploadOpen && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div
              className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 dark:bg-gray-800"
            >
              <button
                onClick={() => setIsUploadOpen(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:font-semibold transition-all duration-200 cursor-pointer hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                ✕
              </button>

              <div onClick={(e) => e.stopPropagation()}>
                <UploadDocuments embedded onClose={() => setIsUploadOpen(false)} onSubmitSuccess={handleSubmitSuccess} />
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[96px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{statusOverview.pending.count}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[96px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-gray-500 dark:text-gray-400">Approved</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{statusOverview.approved.count}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[96px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-gray-500 dark:text-gray-400">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{statusOverview.rejected.count}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Officer) - Announcements removed for Officer role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => { 
              setShowMySubmissions(true); 
              setShowActivity(false); 
              setRecentSubmissions(mySubmissionsData); 
              setActiveQuickAction('submissions'); 
            }}
            aria-pressed={activeQuickAction === 'submissions'}
            className={`w-full text-white p-4 rounded-lg transition-all duration-200 transform flex items-center justify-center ${activeQuickAction === 'submissions' ? 'bg-green-700 hover:bg-green-800 scale-105 shadow-lg ring-4 ring-green-200 dark:ring-green-900 font-semibold' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Submissions
          </button>
          <button
            onClick={() => { setShowActivity(true); setShowMySubmissions(false); setRecentActivity(activityLogData); setActiveQuickAction('activity'); }}
            aria-pressed={activeQuickAction === 'activity'}
            className={`w-full text-white p-4 rounded-lg transition-all duration-200 transform flex items-center justify-center ${activeQuickAction === 'activity' ? 'bg-purple-700 hover:bg-purple-800 scale-105 shadow-lg ring-4 ring-purple-200 dark:ring-purple-900 font-semibold' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Activity Log
          </button>
        </div>

        {/* Recent Submissions (visible after clicking View Submissions) */}
        {showMySubmissions && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Submissions
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {submission.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Type: {'type' in submission ? submission.type : submission.category}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <span>Submitted: {submission.submittedDate}</span>
                      <span>Reviewer: {submission.reviewer}</span>
                      {submission.status === 'approved' && submission.approvedDate && (
                        <span className="text-green-600">Approved: {submission.approvedDate}</span>
                      )}
                      {submission.status === 'rejected' && submission.rejectionReason && (
                        <span className="text-red-600">Reason: {submission.rejectionReason}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-6">
                    {getStatusIcon(submission.status)}
                    <button
                      onClick={() => {
                        // normalize to Submission shape expected by SubmissionDetailsModal
                        const normalized: Submission = {
                          id: submission.id,
                          title: submission.title,
                          category: ('category' in submission ? submission.category : submission.type) ?? '',
                          submittedDate: submission.submittedDate ?? '',
                          status: submission.status ?? '',
                          reviewer: submission.reviewer,
                          files: ('files' in submission ? submission.files : []) ?? [],
                          priority: ('priority' in submission ? submission.priority : '') ?? '',
                          description: ('description' in submission ? submission.description : '') ?? '',
                          approvedDate: submission.approvedDate,
                          rejectedDate: ('rejectedDate' in submission ? submission.rejectedDate : undefined),
                          rejectionReason: submission.rejectionReason
                        };
                        setSelectedSubmission(normalized);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          
          </div>
        )}
  <SubmissionDetailsModal submission={selectedSubmission} open={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedSubmission(null); }} />

        {/* Recent Activity (visible after clicking Activity Log) */}
        {showActivity && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivity.slice(0, 8).map((act) => (
                <div key={act.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{act.title}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{act.type}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{act.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <span>{act.user}</span>
                        <span>•</span>
                        <span>{formatTimestamp(act.timestamp)}</span>
                      </div>
                    </div>

                    {/* right-side controls removed to simplify activity items (no indicator or View button) */}
                  </div>
                </div>
              ))}
            </div>

            
          </div>
        )}
      </div>
    </>
  );
};

export default OfficerDashboard;
