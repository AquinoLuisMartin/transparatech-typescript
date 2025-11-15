import { useState } from 'react';
import { 
  DocsIcon,
  UserIcon,
  GroupIcon,
  BoxIconLine
} from '../../../icons';

interface AnalyticsData {
  period: string;
  totalSubmissions: number;
  approvedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  totalUsers: number;
  activeUsers: number;
  organizationActivity: number;
}

interface OrganizationStats {
  name: string;
  acronym: string;
  submissions: number;
  approvalRate: number;
  avgProcessingTime: number;
  lastActivity: string;
}

const AnalyticsReports = () => {
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationStats | null>(null);

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    period: 'month',
    totalSubmissions: 156,
    approvedSubmissions: 134,
    pendingSubmissions: 15,
    rejectedSubmissions: 7,
    totalUsers: 1247,
    activeUsers: 892,
    organizationActivity: 87
  };

  const organizationStats: OrganizationStats[] = [
    {
      name: 'Alliance of Computer Engineering Students',
      acronym: 'ACES',
      submissions: 28,
      approvalRate: 92.8,
      avgProcessingTime: 2.3,
      lastActivity: '2025-11-02'
    },
    {
      name: 'Integrated Students in IT Education',
      acronym: 'iSITE',
      submissions: 35,
      approvalRate: 88.6,
      avgProcessingTime: 1.8,
      lastActivity: '2025-11-01'
    },
    {
      name: 'Association of Future Teachers',
      acronym: 'AFT',
      submissions: 22,
      approvalRate: 95.5,
      avgProcessingTime: 2.1,
      lastActivity: '2025-10-30'
    },
    {
      name: 'Chamber of Entrepreneurs and Managers',
      acronym: 'CEM',
      submissions: 31,
      approvalRate: 87.1,
      avgProcessingTime: 2.8,
      lastActivity: '2025-11-02'
    }
  ];

  const submissionTrends = [
    { month: 'Jul', submissions: 42, approved: 38, rejected: 4 },
    { month: 'Aug', submissions: 56, approved: 48, rejected: 8 },
    { month: 'Sep', submissions: 38, approved: 35, rejected: 3 },
    { month: 'Oct', submissions: 67, approved: 58, rejected: 9 },
    { month: 'Nov', submissions: 45, approved: 41, rejected: 4 }
  ];

  const approvalRate = (analyticsData.approvedSubmissions / analyticsData.totalSubmissions * 100).toFixed(1);
  const rejectionRate = (analyticsData.rejectedSubmissions / analyticsData.totalSubmissions * 100).toFixed(1);
  const pendingRate = (analyticsData.pendingSubmissions / analyticsData.totalSubmissions * 100).toFixed(1);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics & Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive transparency reporting and system analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center">
            <DocsIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Submissions</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{analyticsData.totalSubmissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <BoxIconLine className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Approval Rate</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{approvalRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Users</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{analyticsData.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center">
            <GroupIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Org Activity</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{analyticsData.organizationActivity}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Submission Status Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Submission Status Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Approved</span>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {analyticsData.approvedSubmissions} ({approvalRate}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {analyticsData.pendingSubmissions} ({pendingRate}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Rejected</span>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {analyticsData.rejectedSubmissions} ({rejectionRate}%)
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Submission Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Submission Trends
          </h3>
          <div className="space-y-3">
            {submissionTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{trend.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-green-600 dark:text-green-400">✓ {trend.approved}</span>
                  <span className="text-sm text-red-600 dark:text-red-400">✗ {trend.rejected}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{trend.submissions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Organization Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Organization Performance
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Detailed submission and approval statistics by organization
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {organizationStats.map((org, index) => (
                <tr 
                  key={index} 
                  onClick={() => {
                    setSelectedOrg(org);
                    setShowOrgModal(true);
                  }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {org.acronym}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {org.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {org.submissions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(org.lastActivity).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Details Modal */}
      {showOrgModal && selectedOrg && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedOrg.name} ({selectedOrg.acronym})
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Organization Details & Activity Overview
                </p>
              </div>
              <button
                onClick={() => {
                  setShowOrgModal(false);
                  setSelectedOrg(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Organization Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Organization Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name:</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedOrg.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Acronym:</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedOrg.acronym}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type:</span>
                      <p className="text-sm text-gray-900 dark:text-white">Student Organization</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Metrics */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Activity Metrics
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Submissions:</span>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedOrg.submissions}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Approval Rate:</span>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">{selectedOrg.approvalRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Processing Time:</span>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{selectedOrg.avgProcessingTime} days</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Activity:</span>
                      <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedOrg.lastActivity).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Transparency Reports
                </h4>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Financial Report Q3 2025</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Submitted on November 1, 2025</p>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Approved
                        </span>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Activity Report October 2025</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Submitted on October 28, 2025</p>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Approved
                        </span>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Membership Update Report</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Submitted on October 15, 2025</p>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Under Review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Contact Information</h5>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Email: {selectedOrg.acronym.toLowerCase()}@university.edu
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Office: Student Center Room {100 + selectedOrg.submissions}
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h5 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">Performance Rating</h5>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedOrg.approvalRate >= 90 ? 'bg-green-600' : 
                            selectedOrg.approvalRate >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${selectedOrg.approvalRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedOrg.approvalRate >= 90 ? 'Excellent' : 
                       selectedOrg.approvalRate >= 80 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl flex-shrink-0">
              <button
                onClick={() => {
                  setShowOrgModal(false);
                  setSelectedOrg(null);
                }}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsReports;