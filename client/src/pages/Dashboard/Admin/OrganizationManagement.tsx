import { useState } from 'react';
import { 
  PencilIcon, 
  TrashBinIcon,
  GroupIcon,
  DocsIcon,
  BoxIconLine
} from '../../../icons';

interface Organization {
  id: string;
  name: string;
  acronym: string;
  description: string;
  status: 'active' | 'inactive';
  memberCount: number;
  officerCount: number;
  submissionCount: number;
  establishedDate: string;
  contactEmail: string;
  president: string;
  adviser: string;
  lastActivity: string;
}

const OrganizationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Organization options from signup form
  const organizationOptions = [
    { value: 'Alliance of Computer Engineering Students', label: 'Alliance of Computer Engineering Students', acronym: 'ACES' },
    { value: 'Integrated Students in Information Technology Education', label: 'Integrated Students in Information Technology Education', acronym: 'iSITE' },
    { value: 'Junior Philippine Institute of Accountancy - Sta Maria', label: 'Junior Philippine Institute of Accountancy - Sta Maria', acronym: 'JPIA' },
    { value: 'Association of Future Teachers', label: 'Association of Future Teachers', acronym: 'AFT' },
    { value: 'Hospitality Management Society', label: 'Hospitality Management Society', acronym: 'HMSOC' },
    { value: 'Chamber of Entrepreneurs and Managers', label: 'Chamber of Entrepreneurs and Managers', acronym: 'CEM' },
    { value: 'Diploma in Office Management SY-Quest', label: 'Diploma in Office Management SY-Quest', acronym: 'DOMT' }
  ];

  // Mock data based on provided organizations
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Alliance of Computer Engineering Students',
      acronym: 'ACES',
      description: 'Student organization for Computer Engineering students promoting technical excellence and innovation.',
      status: 'active',
      memberCount: 156,
      officerCount: 8,
      submissionCount: 23,
      establishedDate: '2018-08-15',
      contactEmail: 'aces@pupsmb.edu.ph',
      president: 'Maria Santos',
      adviser: 'Prof. John Dela Cruz',
      lastActivity: '2025-11-01'
    },
    {
      id: '2',
      name: 'Integrated Students in Information Technology Education',
      acronym: 'iSITE',
      description: 'Organization dedicated to advancing IT education and fostering technological innovation among students.',
      status: 'active',
      memberCount: 203,
      officerCount: 10,
      submissionCount: 31,
      establishedDate: '2017-09-20',
      contactEmail: 'isite@pupsmb.edu.ph',
      president: 'Carlos Rodriguez',
      adviser: 'Prof. Anna Reyes',
      lastActivity: '2025-10-30'
    },
    {
      id: '3',
      name: 'Association of Future Teachers',
      acronym: 'AFT',
      description: 'Professional development organization for education students preparing for teaching careers.',
      status: 'active',
      memberCount: 189,
      officerCount: 9,
      submissionCount: 18,
      establishedDate: '2016-06-10',
      contactEmail: 'aft@pupsmb.edu.ph',
      president: 'Jennifer Garcia',
      adviser: 'Prof. Michael Torres',
      lastActivity: '2025-10-28'
    },
    {
      id: '4',
      name: 'Hospitality Management Society',
      acronym: 'HMSOC',
      description: 'Organization promoting excellence in hospitality and tourism management education.',
      status: 'active',
      memberCount: 134,
      officerCount: 7,
      submissionCount: 15,
      establishedDate: '2019-03-12',
      contactEmail: 'hmsoc@pupsmb.edu.ph',
      president: 'Patricia Cruz',
      adviser: 'Prof. Roberto Mendoza',
      lastActivity: '2025-10-25'
    },
    {
      id: '5',
      name: 'Chamber of Entrepreneurs and Managers',
      acronym: 'CEM',
      description: 'Business-focused organization developing entrepreneurial skills and management expertise.',
      status: 'active',
      memberCount: 167,
      officerCount: 8,
      submissionCount: 27,
      establishedDate: '2017-11-08',
      contactEmail: 'cem@pupsmb.edu.ph',
      president: 'Ricardo Fernandez',
      adviser: 'Prof. Carmen Villanueva',
      lastActivity: '2025-11-02'
    },
    {
      id: '6',
      name: 'Junior Philippine Institute of Accountancy - Sta Maria',
      acronym: 'JPIA',
      description: 'Professional organization for accounting students promoting ethical practice and excellence.',
      status: 'active',
      memberCount: 145,
      officerCount: 9,
      submissionCount: 22,
      establishedDate: '2015-05-18',
      contactEmail: 'jpia@pupsmb.edu.ph',
      president: 'Stephanie Lim',
      adviser: 'Prof. Eduardo Santos',
      lastActivity: '2025-10-29'
    },
    {
      id: '7',
      name: 'Diploma in Office Management SY-Quest',
      acronym: 'DOMT',
      description: 'Organization for office management students focusing on administrative excellence and professional development.',
      status: 'inactive',
      memberCount: 78,
      officerCount: 5,
      submissionCount: 8,
      establishedDate: '2020-01-22',
      contactEmail: 'domt@pupsmb.edu.ph',
      president: 'Angela Rivera',
      adviser: 'Prof. Francis Aquino',
      lastActivity: '2025-09-15'
    }
  ]);

  const [newOrg, setNewOrg] = useState({
    name: '',
    description: '',
    contactEmail: '',
    president: '',
    adviser: ''
  });

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.acronym.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddOrganization = () => {
    const selectedOrgOption = organizationOptions.find(opt => opt.value === newOrg.name);
    const organization: Organization = {
      id: Date.now().toString(),
      name: newOrg.name,
      acronym: selectedOrgOption?.acronym || '',
      description: newOrg.description,
      status: 'active',
      memberCount: 0,
      officerCount: 0,
      submissionCount: 0,
      establishedDate: new Date().toISOString().split('T')[0],
      contactEmail: newOrg.contactEmail,
      president: newOrg.president,
      adviser: newOrg.adviser,
      lastActivity: new Date().toISOString().split('T')[0]
    };

    setOrganizations([...organizations, organization]);
    setNewOrg({ name: '', description: '', contactEmail: '', president: '', adviser: '' });
    setShowAddModal(false);
  };

  const handleEditOrganization = () => {
    if (selectedOrg) {
      setOrganizations(organizations.map(org => 
        org.id === selectedOrg.id ? selectedOrg : org
      ));
      setShowEditModal(false);
      setSelectedOrg(null);
    }
  };

  const handleDeleteOrganization = (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(organizations.filter(org => org.id !== id));
    }
  };

  const toggleOrganizationStatus = (id: string) => {
    setOrganizations(organizations.map(org => 
      org.id === id 
        ? { ...org, status: org.status === 'active' ? 'inactive' : 'active' }
        : org
    ));
  };

  const totalMembers = organizations.reduce((sum, org) => sum + org.memberCount, 0);
  const activeOrganizations = organizations.filter(org => org.status === 'active').length;
  const totalSubmissions = organizations.reduce((sum, org) => sum + org.submissionCount, 0);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Organization Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage student organizations, members, and organizational activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center">
            <GroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Organizations</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{organizations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <BoxIconLine className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Organizations</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{activeOrganizations}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center">
            <GroupIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Members</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center">
            <DocsIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Submissions</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{totalSubmissions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Organization
          </button>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Officers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {org.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {org.acronym} • {org.president}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      org.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {org.memberCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {org.officerCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {org.submissionCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(org.lastActivity).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrg(org);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleOrganizationStatus(org.id)}
                        className={`p-2 rounded transition-colors ${
                          org.status === 'active' 
                            ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                        title={org.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {org.status === 'active' ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteOrganization(org.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashBinIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Organization Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Organization
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Create a new student organization in the system
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newOrg.name}
                    onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Select an organization</option>
                    {organizationOptions.map(org => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newOrg.description}
                    onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={3}
                    placeholder="Enter organization description and mission"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newOrg.contactEmail}
                    onChange={(e) => setNewOrg({ ...newOrg, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="org@pupsmb.edu.ph"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      President <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOrg.president}
                      onChange={(e) => setNewOrg({ ...newOrg, president: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter president name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adviser <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOrg.adviser}
                      onChange={(e) => setNewOrg({ ...newOrg, adviser: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter adviser name"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl flex-shrink-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrganization}
                disabled={!newOrg.name || !newOrg.description || !newOrg.contactEmail || !newOrg.president || !newOrg.adviser}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                Add Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Organization Modal */}
      {showEditModal && selectedOrg && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Organization
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update organization information
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedOrg(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedOrg.name}
                      onChange={(e) => setSelectedOrg({ ...selectedOrg, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Acronym <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedOrg.acronym}
                      onChange={(e) => setSelectedOrg({ ...selectedOrg, acronym: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={selectedOrg.description}
                    onChange={(e) => setSelectedOrg({ ...selectedOrg, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={selectedOrg.contactEmail}
                    onChange={(e) => setSelectedOrg({ ...selectedOrg, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      President <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedOrg.president}
                      onChange={(e) => setSelectedOrg({ ...selectedOrg, president: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adviser <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedOrg.adviser}
                      onChange={(e) => setSelectedOrg({ ...selectedOrg, adviser: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl flex-shrink-0">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedOrg(null);
                }}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditOrganization}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;