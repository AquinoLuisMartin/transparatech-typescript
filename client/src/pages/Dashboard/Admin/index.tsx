import React, { useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import { useAuth } from '../../../hooks/useAuth';
import { ROLES } from '../../../permissions';

interface Submission {
  id: number;
  title: string;
  officer: string;
  organization: string;
  submittedDate: string;
  priority: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const { userRole } = useAuth();

  const isFullAdmin = userRole === ROLES.ADMIN_FULL;

  // Modal state management
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  // Handle approval/rejection clicks
  const handleActionClick = (submission: Submission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    setModalType(action);
    setShowModal(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (modalType === 'approve') {
      setToastMessage('Submission approved successfully!');
      setToastType('success');
    } else {
      // Check if rejection reason is provided
      if (rejectionReason.trim() === '') {
        return; // Don't proceed if no reason provided
      }
      setToastMessage('Submission rejected. The officer will be notified.');
      setToastType('info');
    }
    setShowModal(false);
    setShowToast(true);
    setRejectionReason('');
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
    setRejectionReason('');
  };

  // Handle alerts modal
  const handleViewAlerts = () => {
    setShowAlertsModal(true);
  };

  const handleCloseAlertsModal = () => {
    setShowAlertsModal(false);
  };

  // Mock data for dashboard metrics
  const dashboardData = {
    pendingSubmissions: 15,
    totalDocuments: 1247,
    recentApprovals: 8,
    activeUsers: 45,
    totalOrganizations: 12,
    systemAlerts: 3,
    monthlySubmissions: 342,
    approvalRate: 89
  };

  // System alerts data
  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Storage Space Low',
      message: 'Document storage is at 85% capacity. Consider archiving old files or upgrading storage.',
      timestamp: '2024-11-05T08:30:00Z',
      severity: 'medium',
      isResolved: false
    },
    {
      id: 2,
      type: 'error',
      title: 'Failed Backup Process',
      message: 'Daily backup process failed at 2:00 AM. System administrators should check backup configuration.',
      timestamp: '2024-11-05T02:15:00Z',
      severity: 'high',
      isResolved: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'System maintenance is scheduled for November 6, 2024 at 12:00 AM. Expected downtime: 2 hours.',
      timestamp: '2024-11-04T16:00:00Z',
      severity: 'low',
      isResolved: false
    }
  ];

  const recentSubmissions = [
    {
      id: 1,
      title: "Monthly Budget Report - October 2024",
      officer: "John Doe",
      organization: "Student Council",
      submittedDate: "2024-11-01",
      priority: "high",
      status: "pending"
    },
    {
      id: 2,
      title: "Equipment Purchase Receipt",
      officer: "Jane Smith", 
      organization: "Engineering Club",
      submittedDate: "2024-10-31",
      priority: "medium",
      status: "pending"
    },
    {
      id: 3,
      title: "Event Expense Report",
      officer: "Mike Johnson",
      organization: "Drama Society",
      submittedDate: "2024-10-30",
      priority: "low",
      status: "pending"
    }
  ];

  const recentApprovals = [
    {
      id: 1,
      title: "Quarterly Financial Report",
      officer: "Sarah Wilson",
      approvedDate: "2024-10-30",
      approvedBy: "Admin Team"
    },
    {
      id: 2,
      title: "Training Workshop Receipt",
      officer: "David Brown",
      approvedDate: "2024-10-29",
      approvedBy: "Finance Admin"
    },
    {
      id: 3,
      title: "Student Activity Budget",
      officer: "Maria Garcia",
      approvedDate: "2024-10-28",
      approvedBy: "Admin Team"
    },
    {
      id: 4,
      title: "Equipment Maintenance Receipt",
      officer: "Robert Chen",
      approvedDate: "2024-10-27",
      approvedBy: "Facility Admin"
    },
    {
      id: 5,
      title: "Conference Registration Fee",
      officer: "Lisa Anderson",
      approvedDate: "2024-10-26",
      approvedBy: "Finance Admin"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <>
      <PageMeta 
        title={`${isFullAdmin ? 'Full Control' : 'Approval'} Admin Dashboard | PUPSMB TransparaTech`}
        description={`${isFullAdmin ? 'Full system administration' : 'Document approval administration'} dashboard`}
      />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isFullAdmin ? 'Admin Dashboard - Full Control' : 'Admin Dashboard - Approval Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isFullAdmin 
              ? 'Complete system overview and management capabilities'
              : 'Review and approve document submissions from officers'
            }
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.pendingSubmissions}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recent Approvals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.recentApprovals}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.totalDocuments}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.activeUsers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions (Priority Items) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pending Submissions
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {submission.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <div>Officer: {submission.officer}</div>
                        <div>Organization: {submission.organization}</div>
                        <div>Submitted: {submission.submittedDate}</div>
                      </div>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(submission.priority)}`}>
                        {submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1)} Priority
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => handleActionClick(submission, 'approve')}
                        className="px-3 py-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50 rounded transition-colors text-sm"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleActionClick(submission, 'reject')}
                        className="px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Approvals
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentApprovals.map((approval) => (
                <div key={approval.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {approval.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div>Officer: {approval.officer}</div>
                        <div>Approved: {approval.approvedDate}</div>
                        <div>By: {approval.approvedBy}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-600 text-sm font-medium">Approved</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Alerts (Full Admin Only) */}
        {isFullAdmin && dashboardData.systemAlerts > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                  System Alerts ({dashboardData.systemAlerts})
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300">
                  There are {dashboardData.systemAlerts} system alerts that require your attention.
                </p>
              </div>
              <button 
                onClick={handleViewAlerts}
                className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                View Alerts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* System Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
          {/* Background overlay with blur effect */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out"
            onClick={handleCloseAlertsModal}
          ></div>
          
          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all duration-500 ease-out max-w-2xl w-full animate-slideUp">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        System Alerts ({systemAlerts.length})
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Review and manage system notifications
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseAlertsModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Alert Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          alert.severity === 'high' 
                            ? 'bg-red-100 dark:bg-red-900' 
                            : alert.severity === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900'
                            : 'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          {alert.type === 'error' ? (
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : alert.type === 'warning' ? (
                            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>

                        {/* Alert Content */}
                        <div className="flex-1">
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                              {alert.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {alert.message}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                alert.severity === 'high'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : alert.severity === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={handleCloseAlertsModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
          {/* Background overlay with blur effect */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out"
            onClick={handleCloseModal}
          ></div>
          
          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all duration-500 ease-out max-w-md w-full animate-slideUp">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {modalType === 'approve' ? (
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {modalType === 'approve' ? 'Approve Submission' : 'Reject Submission'}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to {modalType} the submission{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    "{selectedSubmission.title}"
                  </span>{' '}
                  by {selectedSubmission.officer} from {selectedSubmission.organization}?
                </p>

                {/* Rejection Reason Textarea */}
                {modalType === 'reject' && (
                  <div className="mt-4">
                    <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for rejection <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejecting this submission..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white resize-none transition-colors duration-200"
                      rows={4}
                      required
                    />
                    {rejectionReason.trim() === '' && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        Please provide a reason for rejection.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={modalType === 'reject' && rejectionReason.trim() === ''}
                  className={`px-4 py-2 text-white rounded-lg transition-all duration-200 ${
                    modalType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : rejectionReason.trim() === ''
                      ? 'bg-red-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  } focus:ring-2 focus:ring-offset-2`}
                >
                  {modalType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-lg shadow-lg p-4 text-white transform transition-all duration-300 ${
            toastType === 'success' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            <div className="flex items-center gap-3">
              {toastType === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
