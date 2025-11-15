import React, { useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';

interface Submission {
  id: number;
  title: string;
  description: string;
  officer: string;
  organization: string;
  category: string;
  submittedDate: string;
  priority: string;
  status: string;
  files: string[];
  estimatedReviewTime: string;
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
  comments: Array<{
    id: number;
    author: string;
    content: string;
    timestamp: string;
  }>;
}

const DocumentApprovals: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state management
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  const [rejectionReason, setRejectionReason] = useState('');

  const submissions = [
    {
      id: 1,
      title: "Monthly Budget Report - October 2024",
      description: "Comprehensive monthly budget analysis including variance reports and Q4 projections for Student Council operations.",
      officer: "John Doe",
      organization: "Student Council",
      category: "Financial Report",
      submittedDate: "2024-11-01T10:30:00Z",
      priority: "high",
      status: "pending",
      files: ["budget_report_oct.pdf", "supporting_data.xlsx", "variance_analysis.docx"],
      estimatedReviewTime: "2-3 hours",
      comments: []
    },
    {
      id: 2,
      title: "Equipment Purchase Receipt - Laptops",
      description: "Purchase receipt and warranty documentation for 5 new laptops acquired for the Engineering Club development team.",
      officer: "Jane Smith",
      organization: "Engineering Club", 
      category: "Purchase Receipt",
      submittedDate: "2024-10-31T14:15:00Z",
      priority: "medium",
      status: "pending",
      files: ["laptop_receipt.pdf", "warranty_docs.pdf"],
      estimatedReviewTime: "30-45 minutes",
      comments: []
    },
    {
      id: 3,
      title: "Event Expense Report - Cultural Festival",
      description: "Complete expense breakdown for the annual cultural festival including vendor payments, equipment rental, and logistics costs.",
      officer: "Mike Johnson",
      organization: "Drama Society",
      category: "Event Expense",
      submittedDate: "2024-10-30T16:45:00Z",
      priority: "low",
      status: "pending",
      files: ["festival_expenses.pdf", "vendor_receipts.zip"],
      estimatedReviewTime: "1-2 hours",
      comments: []
    },
    {
      id: 4,
      title: "Training Workshop Receipt",
      description: "Receipt and documentation for leadership training workshop attended by organization officers.",
      officer: "Sarah Wilson",
      organization: "Student Government",
      category: "Training Expense",
      submittedDate: "2024-10-29T09:20:00Z",
      priority: "medium",
      status: "approved",
      files: ["training_receipt.pdf", "certificate.pdf"],
      estimatedReviewTime: "30 minutes",
      reviewedBy: "Admin Team",
      reviewedDate: "2024-10-30T11:00:00Z",
      comments: [
        {
          id: 1,
          author: "Admin Team",
          content: "All documentation complete. Training aligns with organizational development goals.",
          timestamp: "2024-10-30T11:00:00Z"
        }
      ]
    },
    {
      id: 5,
      title: "Office Supplies Purchase Order",
      description: "Purchase order for standard office supplies including stationery, printer cartridges, and organizational materials.",
      officer: "David Brown",
      organization: "Environmental Club",
      category: "Office Supplies",
      submittedDate: "2024-10-28T13:30:00Z",
      priority: "low",
      status: "rejected",
      files: ["purchase_order.pdf"],
      estimatedReviewTime: "15-20 minutes",
      reviewedBy: "Finance Admin",
      reviewedDate: "2024-10-29T10:15:00Z",
      rejectionReason: "Vendor not in approved supplier list. Please resubmit with approved vendor.",
      comments: [
        {
          id: 1,
          author: "Finance Admin",
          content: "Please use one of our pre-approved office supply vendors. Contact procurement for the approved vendor list.",
          timestamp: "2024-10-29T10:15:00Z"
        }
      ]
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || submission.priority === filterPriority;
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const handleApprove = (submissionId: number) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      handleActionClick(submission, 'approve');
    }
  };

  const handleReject = (submissionId: number) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (submission) {
      handleActionClick(submission, 'reject');
    }
  };

  // Handle file click to open dummy file
  const handleFileClick = (fileName: string) => {
    // Create a dummy file URL based on file type
    let dummyContent = '';
    let mimeType = 'text/plain';
    
    if (fileName.endsWith('.pdf')) {
      // Create a simple PDF-like content
      dummyContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
100 700 Td
(This is a dummy ${fileName} file for demonstration purposes.) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000179 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
380
%%EOF`;
      mimeType = 'application/pdf';
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      dummyContent = `File Name: ${fileName}
Type: Excel Spreadsheet
Status: Dummy file for demonstration

This is a placeholder for the actual Excel file.
In a real application, this would contain:
- Financial data
- Charts and graphs  
- Formulas and calculations
- Multiple worksheets

Current file: ${fileName}
Date accessed: ${new Date().toLocaleString()}`;
      mimeType = 'text/plain';
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      dummyContent = `Document: ${fileName}
Type: Word Document
Status: Dummy file for demonstration

This is a placeholder document that represents ${fileName}.

In a production environment, this would contain:
- Formatted text
- Images and tables
- Document metadata
- Version history

File accessed: ${new Date().toLocaleString()}
System: TransparaTech Document Management`;
      mimeType = 'text/plain';
    } else if (fileName.endsWith('.zip')) {
      dummyContent = `Archive: ${fileName}
Type: ZIP Archive
Status: Dummy file listing

Contents (simulated):
- receipt_001.pdf
- receipt_002.pdf  
- receipt_003.pdf
- summary.xlsx
- notes.txt

Total files: 5
Archive size: ~2.3 MB (simulated)
Created: ${new Date().toLocaleDateString()}

Note: This is a demonstration file for ${fileName}`;
      mimeType = 'text/plain';
    } else {
      dummyContent = `File: ${fileName}
Type: Document
Status: Dummy file for demonstration

This is a placeholder for ${fileName}.
In a real application, this would open the actual file.

Accessed: ${new Date().toLocaleString()}
System: TransparaTech Document Management System`;
      mimeType = 'text/plain';
    }

    // Create blob and open in new tab
    const blob = new Blob([dummyContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up the object URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  return (
    <>
      <PageMeta 
        title="Document Queue / Approvals | PUPSMB TransparaTech" 
        description="Review and approve document submissions from officers"
      />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Document Queue / Approvals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review, approve, or reject document submissions from officers
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search submissions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                id="priority-filter"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Submissions ({filteredSubmissions.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {submission.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(submission.priority)}`}>
                        {submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {submission.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div>
                        <span className="font-medium">Officer:</span>
                        <br />
                        {submission.officer}
                      </div>
                      <div>
                        <span className="font-medium">Organization:</span>
                        <br />
                        {submission.organization}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <br />
                        {submission.category}
                      </div>
                      <div>
                        <span className="font-medium">Est. Review Time:</span>
                        <br />
                        {submission.estimatedReviewTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>Submitted: {formatDate(submission.submittedDate)}</span>
                      {submission.reviewedDate && (
                        <>
                          <span>•</span>
                          <span>Reviewed: {formatDate(submission.reviewedDate)}</span>
                          <span>•</span>
                          <span>By: {submission.reviewedBy}</span>
                        </>
                      )}
                    </div>

                    {submission.rejectionReason && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          <strong>Rejection Reason:</strong> {submission.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {submission.files.map((file, index) => (
                        <button
                          key={index}
                          onClick={() => handleFileClick(file)}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {file}
                        </button>
                      ))}
                    </div>

                    {submission.comments.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Comments:
                        </h4>
                        {submission.comments.map((comment) => (
                          <div key={comment.id} className="mb-2 last:mb-0">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <span className="font-medium">{comment.author}</span>
                              <span>•</span>
                              <span>{formatDate(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    {submission.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(submission.id)}
                          className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(submission.id)}
                          className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No submissions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No submissions match your current filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

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

export default DocumentApprovals;