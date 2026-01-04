import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from '../../../components/ui/calendar';
import PageMeta from '../../../components/common/PageMeta';
import { ActivityCard } from '../../../components/ActivityCard';

// Define the interface locally to match ActivityCard requirements
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

const ActivityLog: React.FC = () => {
  const [activitiesList, setActivitiesList] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  // Default to "All time" on initial load
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

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

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('/api/v1/submissions/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const mappedActivities: Activity[] = response.data.data.map((item: any) => {
             const type = mapActivityType(item.message);
             return {
                id: parseInt(item.id),
                type: type,
                title: item.project,
                description: item.message,
                user: item.user.name,
                timestamp: item.timestamp,
                details: {
                    documentTitle: item.project,
                },
                icon: getIconForType(type),
                color: getColorForType(type)
             };
          });
          setActivitiesList(mappedActivities);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
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
            {loading ? (
              <div className="text-center py-12">Loading activities...</div>
            ) : filteredActivities.length > 0 ? (
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

export default ActivityLog;
