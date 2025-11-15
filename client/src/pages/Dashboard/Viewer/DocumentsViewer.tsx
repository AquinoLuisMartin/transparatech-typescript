import React, { useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import Calendar from '../../../components/ui/calendar';

const DocumentsViewer: React.FC = () => {
  const documents = [
    {
      id: 1,
      title: "Annual Financial Report 2024",
      category: "Financial Report",
      uploadDate: "2024-01-15",
      size: "2.3 MB",
      type: "PDF",
      description: "Comprehensive financial overview for fiscal year 2024",
      fileUrl: '/files/annual-financial-report-2024.pdf'
    },
    {
      id: 2,
      title: "Budget Allocation Summary",
      category: "Expense Summary",
      uploadDate: "2024-01-10",
      size: "1.8 MB",
      type: "PDF",
      description: "Detailed breakdown of budget allocations across departments",
      fileUrl: '/files/budget-allocation-summary.pdf'
    },
    {
      id: 3,
      title: "Procurement Guidelines",
      category: "Turnover of Assets",
      uploadDate: "2024-01-08",
      size: "950 KB",
      type: "PDF",
      description: "Updated procurement policies and procedures",
      fileUrl: '/files/procurement-guidelines.pdf'
    },
    {
      id: 4,
      title: "Performance Metrics Q4 2023",
      category: "Expense Summary",
      uploadDate: "2024-01-05",
      size: "1.5 MB",
      type: "PDF",
      description: "Quarterly performance indicators and achievements",
      fileUrl: '/files/performance-metrics-q4-2023.pdf'
    },
    {
      id: 5,
      title: "Organizational Structure",
      category: "Turnover of Assets",
      uploadDate: "2024-01-03",
      size: "720 KB",
      type: "PDF",
      description: "Current organizational chart and reporting structure",
      fileUrl: '/files/organizational-structure.pdf'
    },
    {
      id: 6,
      title: "Audit Report 2023",
      category: "Financial Report",
      uploadDate: "2023-12-28",
      size: "3.1 MB",
      type: "PDF",
      description: "Annual audit findings and recommendations",
      fileUrl: '/files/audit-report-2023.pdf'
    }
  ];

  const categories = ["All", "Financial Report", "Turnover of Assets", "Expense Summary"];

  // Filters / UI state (mirrors Officer MySubmissions behaviour)
  const [filterStatus, setFilterStatus] = useState('All'); // using category-like status for documents
  const [searchTerm, setSearchTerm] = useState('');
  const [nameSort, setNameSort] = useState('default'); // 'default' | 'ascending' | 'descending'
  const [dateRange, setDateRange] = useState('all'); // 'today' | '7' | '30' | 'year' | 'all' | 'custom'
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const statusOptions = [{ value: 'All', label: 'All Categories' }, ...categories.filter(c => c !== 'All').map(c => ({ value: c, label: c }))];

  const isWithinDateRange = (dateStr: string) => {
    if (dateRange === 'all') return true;
    const date = new Date(dateStr);
    const now = new Date();

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

  const filteredDocuments = documents
    .filter(doc => {
      const matchesStatus = filterStatus === 'All' || doc.category === filterStatus;
      const lower = searchTerm.toLowerCase();
      const matchesSearch = doc.title.toLowerCase().includes(lower) || doc.description.toLowerCase().includes(lower) || doc.category.toLowerCase().includes(lower);
      const matchesDate = isWithinDateRange(doc.uploadDate);
      return matchesStatus && matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (nameSort === 'ascending') return a.title.localeCompare(b.title);
      if (nameSort === 'descending') return b.title.localeCompare(a.title);
      return 0;
    });

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const handleView = (url?: string) => {
    if (!url) return;
    try {
      window.open(url, '_blank');
    } catch (err) {
      // fallback - open in same tab
      window.location.href = url;
    }
  };

  const handleDownload = (url: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      // Fallback: open in new tab if download fails
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <PageMeta 
        title="View Documents | PUPSMB TransparaTech" 
        description="Access and download official documents and reports from PUPSMB TransparaTech"
      />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Document Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Access and download official documents and reports
          </p>
        </div>

        {/* Filters and Search - 4 column responsive grid: Search, Status, Name Sort, Date Range */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Documents</label>
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
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Category</label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="name-sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by Name</label>
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
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
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

        {/* Documents List / Grid with view toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Documents ({filteredDocuments.length})</h2>
              <div className="flex items-center gap-2">
                <button
                  aria-pressed={viewMode === 'list'}
                  aria-label="Switch to list view"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md border ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
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
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents found</h3>
                <p className="text-gray-600 dark:text-gray-400">No documents match your current filter criteria.</p>
              </div>
            ) : (
              viewMode === 'list' ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{document.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              document.category === 'Financial Report' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              document.category === 'Turnover of Assets' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              document.category === 'Expense Summary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>{document.category}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{document.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <span>Uploaded: {document.uploadDate}</span>
                            <span>Size: {document.size}</span>
                            <span>Type: {document.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          <button
                            onClick={() => handleView(document.fileUrl)}
                            className="px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded transition-colors text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(document.fileUrl, document.title + '.pdf')}
                            className="px-3 py-1 text-white bg-gray-600 rounded hover:bg-gray-700 text-sm"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col h-full"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-red-600 dark:text-red-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          document.category === 'Financial Report' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          document.category === 'Turnover of Assets' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          document.category === 'Expense Summary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}> 
                          {document.category}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{document.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{document.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span>{document.uploadDate}</span>
                          <span>{document.size}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{document.type}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(document.fileUrl)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(document.fileUrl, document.title + '.pdf')}
                            className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No documents match your current filter criteria.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentsViewer;