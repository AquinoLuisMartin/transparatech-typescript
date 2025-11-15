import React, { useState } from 'react';
import Calendar from '../../../components/ui/calendar';
import PageMeta from '../../../components/common/PageMeta';
import SubmissionCard from '../../../components/SubmissionCard';
import SubmissionDetailsModal from '../../../components/SubmissionDetailsModal';
import { Submission } from '../../../types/submission';

// Export submissions at module top-level so other pages can import them as a source of truth.
export const submissions: Submission[] = [
  {
    id: 1,
    title: 'Monthly Budget Report - October 2024',
    category: 'Financial Report',
    submittedDate: '2024-10-31',
    status: 'pending',
    reviewer: 'Admin Department',
    files: ['budget_report_oct.pdf', 'supporting_docs.xlsx'],
    priority: 'high',
    description: 'Comprehensive monthly budget analysis including variance reports and projections.'
  },
  {
    id: 2,
    title: 'Equipment Purchase Receipt - Laptops',
    category: 'Receipt',
    submittedDate: '2024-10-28',
    status: 'approved',
    reviewer: 'Finance Team',
    approvedDate: '2024-10-30',
    files: ['laptop_receipt.pdf', 'warranty_info.pdf'],
    priority: 'medium',
    description: 'Purchase receipt for 5 new laptops for the development team.'
  },
  {
    id: 3,
    title: 'Travel Expense Report - Conference',
    category: 'Expense Report',
    submittedDate: '2024-10-25',
    status: 'rejected',
    reviewer: 'Accounting',
    rejectionReason: 'Missing required receipts for hotel accommodation',
    rejectedDate: '2024-10-27',
    files: ['travel_expenses.pdf'],
    priority: 'medium',
    description: 'Expense report for attending the annual transparency conference in Cebu.'
  },
  {
    id: 4,
    title: 'Quarterly Performance Report Q3',
    category: 'Performance Report',
    submittedDate: '2024-10-20',
    status: 'approved',
    reviewer: 'Management',
    approvedDate: '2024-10-22',
    files: ['q3_performance.docx', 'metrics_data.xlsx'],
    priority: 'high',
    description: 'Third quarter performance metrics and achievement analysis.'
  },
  {
    id: 5,
    title: 'Office Supplies Purchase Order',
    category: 'Purchase Order',
    submittedDate: '2024-10-18',
    status: 'pending',
    reviewer: 'Procurement',
    files: ['purchase_order.pdf'],
    priority: 'low',
    description: 'Purchase order for office supplies including stationery and printer cartridges.'
  },
  {
    id: 6,
    title: 'Annual Audit Report 2024',
    category: 'Audit Report',
    submittedDate: '2024-10-15',
    status: 'approved',
    reviewer: 'Audit Committee',
    approvedDate: '2024-10-17',
    files: ['audit_report_2024.pdf', 'recommendations.docx'],
    priority: 'urgent',
    description: 'Comprehensive annual audit report with findings and recommendations.'
  },
  {
    id: 7,
    title: 'IT Equipment Maintenance Receipt',
    category: 'Receipt',
    submittedDate: '2024-10-12',
    status: 'rejected',
    reviewer: 'IT Department',
    rejectionReason: 'Service provider not in approved vendor list',
    rejectedDate: '2024-10-14',
    files: ['maintenance_receipt.pdf'],
    priority: 'medium',
    description: 'Receipt for server maintenance and hardware upgrades.'
  },
  {
    id: 8,
    title: 'Training Workshop Expense Report',
    category: 'Expense Report',
    submittedDate: '2024-10-10',
    status: 'approved',
    reviewer: 'HR Department',
    approvedDate: '2024-10-12',
    files: ['training_expenses.pdf', 'certificates.pdf'],
    priority: 'low',
    description: 'Expenses for staff training workshop on data privacy and security.'
  }
];

const MySubmissions: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [nameSort, setNameSort] = useState('default'); // 'default' | 'ascending' | 'descending'
  const [dateRange, setDateRange] = useState('all'); // 'today' | '7' | '30' | 'year' | 'all' | 'custom'
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];


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
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
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

  const statusSummary = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  };

  const isWithinDateRange = (dateStr: string) => {
    if (dateRange === 'all') return true;
    const date = new Date(dateStr);
    const now = new Date();

    // Helper to clear time portion for day comparisons
    const sameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    if (dateRange === 'today') return sameDay(date, now);

    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (dateRange === '7') return diffDays <= 7;
    if (dateRange === '30') return diffDays <= 30;
    if (dateRange === 'year') return date.getFullYear() === now.getFullYear();

    if (dateRange === 'custom') {
      if (!customStartDate && !customEndDate) return true;
      const start = customStartDate ? new Date(customStartDate) : null;
      const end = customEndDate ? new Date(customEndDate) : null;
      if (start && end) {
        // normalize times
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
      }
      if (start) {
        start.setHours(0,0,0,0);
        return date.getTime() >= start.getTime();
      }
      if (end) {
        end.setHours(23,59,59,999);
        return date.getTime() <= end.getTime();
      }
      return true;
    }

    return true;
  };

  const filteredSubmissions = submissions
    .filter(submission => {
      const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
      const lower = searchTerm.toLowerCase();
      const matchesSearch =
        submission.title.toLowerCase().includes(lower) ||
        submission.category.toLowerCase().includes(lower) ||
        (submission.description || '').toLowerCase().includes(lower);
      const matchesDate = isWithinDateRange(submission.submittedDate);
      return matchesStatus && matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (nameSort === 'ascending') return a.title.localeCompare(b.title);
      if (nameSort === 'descending') return b.title.localeCompare(a.title);
      return 0; // default preserves original order
    });

  return (
    <>
      <PageMeta 
        title="My Submissions | PUPSMB TransparaTech" 
        description="Track and manage your document submissions and their approval status"
      />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your submitted documents and their approval status
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[88px]">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusSummary.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[88px]">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusSummary.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[88px]">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusSummary.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[88px]">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusSummary.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search - 4 column responsive grid: Search, Status, Name Sort, Date Range */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Submissions
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
                  placeholder="Search by title, category, or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
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
              <label htmlFor="name-sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort by Name
              </label>
              <select
                id="name-sort"
                value={nameSort}
                onChange={(e) => setNameSort(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="default">Default (original order)</option>
                <option value="ascending">Ascending (A–Z)</option>
                <option value="descending">Descending (Z–A)</option>
              </select>
            </div>

            <div>
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                id="date-range"
                value={dateRange}
                onChange={(e) => {
                  const v = e.target.value;
                  setDateRange(v);
                  // if leaving custom range, clear selected custom dates and hide picker
                  if (v !== 'custom') {
                    setCustomStartDate(undefined);
                    setCustomEndDate(undefined);
                    setShowCustomDatePicker(false);
                  } else {
                    setShowCustomDatePicker(true);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="today">Today</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {dateRange === 'custom' && (
            <div data-open={String(showCustomDatePicker)} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <Calendar
                  selected={customStartDate}
                  onSelect={(d) => {
                    setCustomStartDate(d);
                    // if end is before start, clear end
                    if (customEndDate && d && customEndDate.getTime() < d.getTime()) {
                      setCustomEndDate(undefined);
                    }
                  }}
                  placeholder="Select start date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <Calendar
                  selected={customEndDate}
                  onSelect={(d) => setCustomEndDate(d)}
                  minDate={customStartDate}
                  placeholder="Select end date"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submissions List / Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Submissions ({filteredSubmissions.length})</h2>
              <div className="flex items-center gap-2">
                <button
                  aria-pressed={viewMode === 'list'}
                  aria-label="Switch to list view"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md border ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  {/* list icon */}
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  aria-pressed={viewMode === 'grid'}
                  aria-label="Switch to grid view"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md border ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  {/* grid icon */}
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No submissions found</h3>
              <p className="text-gray-600 dark:text-gray-400">No submissions match your current filter criteria.</p>
            </div>
          ) : (
            <div className="p-6">
              {viewMode === 'list' ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{submission.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(submission.priority || '')}`}>{submission.priority ? submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1) : ''}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{submission.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <span>Category: {submission.category}</span>
                            <span>Submitted: {submission.submittedDate}</span>
                            <span>Reviewer: {submission.reviewer}</span>
                            {submission.status === 'approved' && submission.approvedDate && (<span className="text-green-600">Approved: {submission.approvedDate}</span>)}
                            {submission.status === 'rejected' && submission.rejectedDate && (<span className="text-red-600">Rejected: {submission.rejectedDate}</span>)}
                          </div>
                          {submission.status === 'rejected' && submission.rejectionReason && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                              <p className="text-sm text-red-800 dark:text-red-200"><strong>Rejection Reason:</strong> {submission.rejectionReason}</p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {submission.files.map((file, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                {file}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-6">
                          {getStatusIcon(submission.status)}
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedSubmission(submission); setIsModalOpen(true); }} className="px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded transition-colors text-sm">View Details</button>
                            {submission.status === 'rejected' && (
                              <button className="px-3 py-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50 rounded transition-colors text-sm">Resubmit</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSubmissions.map((submission) => (
                    <SubmissionCard key={submission.id} submission={submission as Submission} onOpen={(s) => { setSelectedSubmission(s); setIsModalOpen(true); }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <SubmissionDetailsModal submission={selectedSubmission} open={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedSubmission(null); }} />
      </div>
    </>
  );
};

export default MySubmissions;