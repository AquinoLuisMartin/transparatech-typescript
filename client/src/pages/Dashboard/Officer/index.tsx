import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import Select from '../../../components/form/Select';
import Input from '../../../components/form/input/InputField';
import PageMeta from '../../../components/common/PageMeta';
import UploadDocuments from './UploadDocuments';
import SubmissionDetailsModal from '../../../components/SubmissionDetailsModal';
import { Submission } from '../../../types/submission';

// Define Activity interface locally
interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  user: string;
  timestamp: string;
  details: any;
  icon: string;
  color: string;
}

const OfficerDashboard: React.FC = () => {
  const [statusOverview, setStatusOverview] = useState({
    pending: { count: 0, percentage: 0 },
    approved: { count: 0, percentage: 0 },
    rejected: { count: 0, percentage: 0 }
  });

  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [filterType, setFilterType] = useState('submissions');
  const [searchQuery, setSearchQuery] = useState('');

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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Stats
        const statsRes = await axios.get('/api/v1/submissions/stats', { headers });
        if (statsRes.data.success) {
            const stats = statsRes.data.data;
            setStatusOverview({
                pending: { count: parseInt(stats.pending_submissions), percentage: 0 },
                approved: { count: parseInt(stats.public_documents), percentage: 0 },
                rejected: { count: 0, percentage: 0 } // Backend doesn't return rejected count yet
            });
        }

        // Fetch Recent Submissions
        const submissionsRes = await axios.get('/api/v1/submissions?limit=5', { headers });
        if (submissionsRes.data.success) {
             const mappedSubmissions = submissionsRes.data.data.map((s: any) => ({
                id: s.id,
                title: s.title,
                category: s.category || s.type,
                submittedDate: s.created_at ? s.created_at.split('T')[0] : '',
                status: s.status,
                reviewer: s.reviewer_first_name ? `${s.reviewer_first_name} ${s.reviewer_last_name}` : 'Pending',
                files: s.files || [],
                priority: s.priority,
                description: s.description,
                approvedDate: s.approved_date ? s.approved_date.split('T')[0] : undefined,
                rejectedDate: s.rejected_date ? s.rejected_date.split('T')[0] : undefined,
                rejectionReason: s.rejection_reason
              }));
            setRecentSubmissions(mappedSubmissions);
        }

        // Fetch Recent Activity
        const activityRes = await axios.get('/api/v1/submissions/notifications', { headers });
        if (activityRes.data.success) {
             const mappedActivities: Activity[] = activityRes.data.data.map((item: any) => {
                 const type = mapActivityType(item.message);
                 return {
                    id: parseInt(item.id),
                    type: type,
                    title: item.project,
                    description: item.message,
                    user: item.user.name,
                    timestamp: item.timestamp,
                    details: { documentTitle: item.project },
                    icon: getIconForType(type),
                    color: getColorForType(type)
                 };
             });
             setRecentActivity(mappedActivities);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mapActivityType = (message: string): string => {
    const msg = message.toLowerCase();
    if (msg.includes('submitted')) return 'submission';
    if (msg.includes('approved')) return 'approval';
    if (msg.includes('rejected')) return 'rejection';
    if (msg.includes('updated')) return 'edit';
    return 'system';
  };

  const getIconForType = (type: string): string => {
      switch(type) {
          case 'submission': return 'upload';
          case 'approval': return 'check';
          case 'rejection': return 'x';
          case 'edit': return 'edit';
          default: return 'info';
      }
  };

  const getColorForType = (type: string): string => {
      switch(type) {
          case 'submission': return 'blue';
          case 'approval': return 'green';
          case 'rejection': return 'red';
          case 'edit': return 'purple';
          default: return 'gray';
      }
  };

  const handleSubmitSuccess = (submission: Submission) => {
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Officer Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              
              <button onClick={() => setIsUploadOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center flex-grow sm:flex-grow-0">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor your document submissions and approval status
          </p>
        </div>
        {/* Upload Modal */}
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

        {/* Filter and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by</label>
              <Select
                options={[
                  { value: 'submissions', label: 'View submissions' },
                  { value: 'activity', label: 'Activity log' }
                ]}
                onChange={(value) => setFilterType(value)}
                defaultValue="submissions"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                      fill=""
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        {filterType === 'submissions' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Submissions
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
                <div className="p-6 text-center text-gray-500">Loading submissions...</div>
            ) : recentSubmissions.filter(s => 
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.category || s.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (s.reviewer && s.reviewer.toLowerCase().includes(searchQuery.toLowerCase()))
            ).length === 0 ? (
                <div className="p-6 text-center text-gray-500">No submissions found matching your search.</div>
            ) : (
                recentSubmissions.filter(s => 
                    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (s.category || s.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (s.reviewer && s.reviewer.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {submission.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Type: {submission.category || submission.type}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
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
                    
                    <div className="flex items-center gap-3 sm:ml-6">
                        {getStatusIcon(submission.status)}
                        <button
                        onClick={() => {
                            setSelectedSubmission(submission);
                            setIsModalOpen(true);
                        }}
                        className="px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded transition-colors"
                        >
                        View Details
                        </button>
                    </div>
                    </div>
                </div>
                ))
            )}
          </div>
          </div>
        )}
        <SubmissionDetailsModal submission={selectedSubmission} open={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedSubmission(null); }} />

        {/* Recent Activity */}
        {filterType === 'activity' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading activity...</div>
              ) : recentActivity.filter(act => 
                  act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  act.user.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No activity found matching your search.</div>
              ) : (
                  recentActivity.filter(act => 
                      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      act.user.toLowerCase().includes(searchQuery.toLowerCase())
                  ).slice(0, 8).map((act) => (
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
                    </div>
                    </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OfficerDashboard;
