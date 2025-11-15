import React, { useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import Calendar from '../../../components/ui/calendar';

export const reports = [
    {
      id: 1,
      title: "Annual Transparency Report 2024",
      category: "Financial Report",
      period: "January - December 2024",
      publishDate: "2024-01-30",
      status: "Published",
      summary: "Comprehensive annual report covering all transparency initiatives and accountability measures implemented throughout 2024.",
      size: "4.2 MB",
      downloadUrl: '/files/annual-transparency-report-2024.pdf'
    },
    {
      id: 2,
      title: "Q4 2023 Transparency Update",
      category: "Expense Summary",
      period: "October - December 2023",
      publishDate: "2024-01-15",
      status: "Published",
      summary: "Quarterly transparency report highlighting key developments, policy changes, and public engagement activities.",
      size: "2.8 MB",
      downloadUrl: '/files/q4-2023-transparency-update.pdf'
    },
    {
      id: 3,
      title: "Q3 2023 Transparency Update",
      category: "Turnover of Assets",
      period: "July - September 2023",
      publishDate: "2023-10-15",
      status: "Published",
      summary: "Third quarter report detailing transparency measures, public consultation outcomes, and operational improvements.",
      size: "2.4 MB",
      downloadUrl: '/files/q3-2023-transparency-update.pdf'
    }
];

const TransparencyReportViewer: React.FC = () => {
  const metrics = [
    {
      title: "Total Reports Published",
      value: "24",
      change: "+12%",
      changeType: "increase",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Public Requests Processed",
      value: "156",
      change: "+18%",
      changeType: "increase",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Average Response Time",
      value: "3.2 days",
      change: "-24%",
      changeType: "decrease",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Transparency Score",
      value: "94%",
      change: "+6%",
      changeType: "increase",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  // Filters / UI state (mirrors Officer MySubmissions behaviour)
  // Use a fixed category list for the reports dropdown per request
  const categories = ["All", "Financial Report", "Turnover of Assets", "Expense Summary"];

  const [filterStatus, setFilterStatus] = useState('All'); // using category-like status for reports (compared against downloads field)
  const [searchTerm, setSearchTerm] = useState('');
  const [nameSort, setNameSort] = useState('default'); // 'default' | 'ascending' | 'descending'
  const [dateRange, setDateRange] = useState('all'); // 'today' | '7' | '30' | 'year' | 'all' | 'custom'
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const statusOptions = [{ value: 'All', label: 'All Categories' }, ...categories.filter(c => c !== 'All').map((c: any) => ({ value: c, label: c }))];

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

  const filteredReports = reports
    .filter(report => {
      // Use the new `category` field on each report for filtering.
      const reportCategory = (report as any).category || '';
      const matchesStatus = filterStatus === 'All' || reportCategory === filterStatus;
      const lower = searchTerm.toLowerCase();
      const matchesSearch = report.title.toLowerCase().includes(lower) || (report.summary || '').toLowerCase().includes(lower) || reportCategory.toLowerCase().includes(lower);
      const matchesDate = isWithinDateRange(report.publishDate);
      return matchesStatus && matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (nameSort === 'ascending') return a.title.localeCompare(b.title);
      if (nameSort === 'descending') return b.title.localeCompare(a.title);
      return 0;
    });

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  const handlePreview = (url?: string) => {
    if (!url) return;
    let previewUrl = url;
    const isDirectPreviewable = /\.pdf$|\.(png|jpg|jpeg|gif)$/i.test(url);
    if (!isDirectPreviewable) {
      previewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    }
    setSelectedFileUrl(previewUrl);
    setIsPreviewOpen(true);
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
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <PageMeta 
        title="Transparency Reports | PUPSMB TransparaTech" 
        description="Access comprehensive transparency reports and accountability metrics from PUPSMB TransparaTech"
      />
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transparency Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive reports on transparency initiatives and accountability measures
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {metric.icon}
                  </div>
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  metric.changeType === 'increase' 
                    ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900' 
                    : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {metric.title}
              </p>
            </div>
          ))}
        </div>

        {/* Filters and Search - 4 column responsive grid: Search, Status, Name Sort, Date Range (copied from DocumentsViewer) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Transparency Reports</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Transparency Reports"
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

        {/* Featured Report (moved below filters) */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Latest Transparency Report</h2>
              <p className="text-blue-100 mb-4">
                Annual Transparency Report 2024 - Our most comprehensive report to date
              </p>
                      <div className="flex items-center gap-4 text-sm text-blue-100">
                        <span>Published: January 30, 2024</span>
                        <span>•</span>
                        <span>Category: Financial Report</span>
                        <span>•</span>
                        <span>4.2 MB</span>
                      </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                View Report
              </button>
              <button className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Reports List / Grid with view toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Transparency Reports ({filteredReports.length})</h2>
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
            {filteredReports.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
                <p className="text-gray-600 dark:text-gray-400">No transparency reports match your current filter criteria.</p>
              </div>
            ) : (
              viewMode === 'list' ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium rounded-full">{report.status}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{report.summary}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <span>Period: {report.period}</span>
                            <span>Published: {report.publishDate}</span>
                            <span>Category: {(report as any).category}</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-6">
                          <button
                            onClick={() => handlePreview((report as any).downloadUrl)}
                            className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleDownload((report as any).downloadUrl, report.title + '.pdf')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  {filteredReports.map((report) => (
                    <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{(report as any).category}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{report.title}</h3>
                        <p
                          className="text-gray-600 dark:text-gray-400 text-sm mb-4"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {report.summary}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span>{report.publishDate}</span>
                          <span>{report.size}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className={`text-sm text-gray-500 dark:text-gray-400 ${viewMode === 'grid' ? 'invisible' : ''}`}>{report.period}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreview((report as any).downloadUrl)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleDownload((report as any).downloadUrl, report.title + '.pdf')}
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

        {/* Preview Modal */}
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg w-[90%] h-[85%] shadow-lg overflow-hidden">
              <button
                onClick={() => { setIsPreviewOpen(false); setSelectedFileUrl(null); }}
                className="absolute top-3 right-3 text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white text-2xl font-bold z-10"
                aria-label="Close preview"
              >
                ✕
              </button>

              <iframe
                src={selectedFileUrl ?? ''}
                className="w-full h-full border-0"
                title="File Preview"
              />
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                About Transparency Reports
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                Our transparency reports provide comprehensive insights into our organization's accountability measures, 
                public engagement activities, and commitment to open governance. These reports are published quarterly 
                and annually to ensure stakeholders have access to timely and accurate information about our operations, 
                decision-making processes, and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransparencyReportViewer;