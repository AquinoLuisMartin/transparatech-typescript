import React, { useState } from 'react';
import Calendar from '../../../components/ui/calendar';
import PageMeta from '../../../components/common/PageMeta';
import { ActivityCard } from '../../../components/ActivityCard.tsx';

// Activities array at module top-level; exported as a named export at the bottom.
const activities = [
  {
    id: 1,
    type: 'submission',
    title: 'Document Submitted',
    description: 'Monthly Budget Report - October 2024 submitted for review',
    user: 'You',
    timestamp: '2024-10-31T14:30:00Z',
    details: {
      documentTitle: 'Monthly Budget Report - October 2024',
      category: 'Financial Report',
      reviewer: 'Admin Department'
    },
    icon: 'upload',
    color: 'blue'
  },
  {
    id: 2,
    type: 'approval',
    title: 'Document Approved',
    description: 'Equipment Purchase Receipt - Laptops has been approved',
    user: 'Finance Team',
    timestamp: '2024-10-30T16:45:00Z',
    details: {
      documentTitle: 'Equipment Purchase Receipt - Laptops',
      approver: 'Finance Team',
      comments: 'All documentation is complete and accurate.'
    },
    icon: 'check',
    color: 'green'
  },
  {
    id: 3,
    type: 'comment',
    title: 'Review Comment Added',
    description: 'New comment on Monthly Budget Report - October 2024',
    user: 'Admin Department',
    timestamp: '2024-10-30T11:15:00Z',
    details: {
      documentTitle: 'Monthly Budget Report - October 2024',
      comment: 'Please provide additional breakdown for Q4 projections.',
      commenter: 'Admin Department'
    },
    icon: 'message',
    color: 'yellow'
  },
  {
    id: 4,
    type: 'download',
    title: 'Document Downloaded',
    description: 'You downloaded Quarterly Performance Report Q3',
    user: 'You',
    timestamp: '2024-10-29T09:20:00Z',
    details: {
      documentTitle: 'Quarterly Performance Report Q3',
      fileSize: '2.4 MB',
      format: 'PDF'
    },
    icon: 'download',
    color: 'indigo'
  },
  {
    id: 5,
    type: 'rejection',
    title: 'Document Rejected',
    description: 'Travel Expense Report - Conference has been rejected',
    user: 'Accounting',
    timestamp: '2024-10-27T13:30:00Z',
    details: {
      documentTitle: 'Travel Expense Report - Conference',
      rejector: 'Accounting',
      reason: 'Missing required receipts for hotel accommodation'
    },
    icon: 'x',
    color: 'red'
  },
  {
    id: 6,
    type: 'edit',
    title: 'Document Updated',
    description: 'You updated Travel Expense Report - Conference',
    user: 'You',
    timestamp: '2024-10-25T10:45:00Z',
    details: {
      documentTitle: 'Travel Expense Report - Conference',
      changes: 'Added additional receipts and expense breakdown'
    },
    icon: 'edit',
    color: 'purple'
  },
  {
    id: 7,
    type: 'submission',
    title: 'Document Submitted',
    description: 'Travel Expense Report - Conference submitted for review',
    user: 'You',
    timestamp: '2024-10-25T08:00:00Z',
    details: {
      documentTitle: 'Travel Expense Report - Conference',
      category: 'Expense Report',
      reviewer: 'Accounting'
    },
    icon: 'upload',
    color: 'blue'
  },
  {
    id: 8,
    type: 'approval',
    title: 'Document Approved',
    description: 'Quarterly Performance Report Q3 has been approved',
    user: 'Management',
    timestamp: '2024-10-22T15:20:00Z',
    details: {
      documentTitle: 'Quarterly Performance Report Q3',
      approver: 'Management',
      comments: 'Excellent work on meeting all quarterly targets.'
    },
    icon: 'check',
    color: 'green'
  },
  {
    id: 9,
    type: 'comment',
    title: 'Review Comment Added',
    description: 'New comment on Quarterly Performance Report Q3',
    user: 'Management',
    timestamp: '2024-10-21T14:10:00Z',
    details: {
      documentTitle: 'Quarterly Performance Report Q3',
      comment: 'Please clarify the variance in customer satisfaction metrics.',
      commenter: 'Management'
    },
    icon: 'message',
    color: 'yellow'
  },
  {
    id: 10,
    type: 'submission',
    title: 'Document Submitted',
    description: 'Quarterly Performance Report Q3 submitted for review',
    user: 'You',
    timestamp: '2024-10-20T16:30:00Z',
    details: {
      documentTitle: 'Quarterly Performance Report Q3',
      category: 'Performance Report',
      reviewer: 'Management'
    },
    icon: 'upload',
    color: 'blue'
  },
  {
    id: 11,
    type: 'system',
    title: 'Account Settings Updated',
    description: 'You updated your notification preferences',
    user: 'You',
    timestamp: '2024-10-18T12:00:00Z',
    details: {
      setting: 'Notification Preferences',
      changes: 'Enabled email notifications for approvals'
    },
    icon: 'settings',
    color: 'gray'
  },
  {
    id: 12,
    type: 'approval',
    title: 'Document Approved',
    description: 'Annual Audit Report 2024 has been approved',
    user: 'Audit Committee',
    timestamp: '2024-10-17T11:45:00Z',
    details: {
      documentTitle: 'Annual Audit Report 2024',
      approver: 'Audit Committee',
      comments: 'Report is comprehensive and meets all regulatory requirements.'
    },
    icon: 'check',
    color: 'green'
  }
];

const ActivityLog: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  // Default to "All time" on initial load
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Use the module-level activities as the data source
  const activitiesList = activities;

  const typeOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'submission', label: 'Submissions' },
    { value: 'approval', label: 'Approvals' },
    { value: 'rejection', label: 'Rejections' },
    { value: 'comment', label: 'Comments' },
    { value: 'download', label: 'Downloads' },
    { value: 'edit', label: 'Edits' },
    { value: 'system', label: 'System' }
  ];

  const dateRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: 'all', label: 'All time' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const getFilteredActivities = () => {
    let filtered = activitiesList;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      if (dateRange === 'custom') {
        // customStartDate/customEndDate handling
        if (!customStartDate && !customEndDate) {
          // no custom filter
        } else {
          const start = customStartDate ? new Date(customStartDate) : null;
          const end = customEndDate ? new Date(customEndDate) : null;
          if (start && end) {
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            filtered = filtered.filter(a => {
              const t = new Date(a.timestamp).getTime();
              return t >= start.getTime() && t <= end.getTime();
            });
          } else if (start) {
            start.setHours(0,0,0,0);
            filtered = filtered.filter(a => new Date(a.timestamp).getTime() >= start.getTime());
          } else if (end) {
            end.setHours(23,59,59,999);
            filtered = filtered.filter(a => new Date(a.timestamp).getTime() <= end.getTime());
          }
        }
      } else {
        const daysAgo = parseInt(dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        filtered = filtered.filter(activity => new Date(activity.timestamp) >= cutoffDate);
      }
    }

    // Always sort by timestamp descending so newest items appear first
    filtered = filtered.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filtered;
  };

  const filteredActivities = getFilteredActivities();

  

  // summary counts removed — not used in simplified layout

  return (
    <>
      <PageMeta 
        title="Activity Log | PUPSMB TransparaTech" 
        description="View detailed activity log of all document submissions and system interactions"
      />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Activity Log
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all your activities and system interactions
          </p>
        </div>

        {/* Filters (Activity Type, Date Range, Search) - moved to top */}

        {/* Filters (Activity Type, Date Range, Search) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/4">
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activity Type
              </label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:w-1/4">
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                id="date-range"
                value={dateRange}
                onChange={(e) => {
                  const v = e.target.value;
                  setDateRange(v);
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
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="activity-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  id="activity-search"
                  type="text"
                  placeholder="Search activities, documents, users..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {dateRange === 'custom' && (
          <div data-open={String(showCustomDatePicker)} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <Calendar
                  selected={customStartDate}
                  onSelect={(d) => {
                    setCustomStartDate(d);
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
          </div>
        )}

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Activity Timeline ({filteredActivities.length})
            </h2>
          </div>
          
          <div className="p-6">
            {filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No activities found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No activities match your current filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Re-export activities as a named export (kept here to avoid modifier-in-block parser issues)
export { activities };

export default ActivityLog;