import React, { useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: string;
  lastLogin: string;
  createdDate: string;
  submissionsCount: number;
  approvalRate: number;
}

const UserManagement: React.FC = () => {
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
    organization: '',
    status: ''
  });
  const [customOrganization, setCustomOrganization] = useState('');
  
  // New user form state
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: '',
    organization: '',
    password: '',
    confirmPassword: ''
  });
  const [newUserCustomOrg, setNewUserCustomOrg] = useState('');

  // Organization options from signup form
  const studentOrgs = [
    { value: 'isite', label: 'ISITE' },
    { value: 'aces', label: 'ACES' },
    { value: 'jpia', label: 'JPIA' },
    { value: 'aft', label: 'AFT' },
    { value: 'hmsoc', label: 'HMSOC' },
    { value: 'cem', label: 'CEM' },
    { value: 'domt', label: 'DOMT' }
  ];

  const adminTypes = [
    { value: 'coa', label: 'Commission on Audit (COA)' },
    { value: 'oss', label: 'Office of Student Services (OSS)' },
    { value: 'cosoa', label: 'Commission on Student Organizations and Accreditation (COSOA)' }
  ];

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@pupsmb.edu.ph",
      role: "officer",
      organization: "Student Council",
      status: "active",
      lastLogin: "2024-11-01T14:30:00Z",
      createdDate: "2024-01-15T09:00:00Z",
      submissionsCount: 15,
      approvalRate: 89
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@pupsmb.edu.ph",
      role: "officer",
      organization: "Engineering Club",
      status: "active",
      lastLogin: "2024-10-31T16:45:00Z",
      createdDate: "2024-02-10T11:30:00Z",
      submissionsCount: 23,
      approvalRate: 95
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@pupsmb.edu.ph",
      role: "officer",
      organization: "Drama Society",
      status: "inactive",
      lastLogin: "2024-10-20T10:15:00Z",
      createdDate: "2024-03-05T14:20:00Z",
      submissionsCount: 8,
      approvalRate: 75
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@pupsmb.edu.ph",
      role: "admin_approval",
      organization: "Administration",
      status: "active",
      lastLogin: "2024-11-01T09:20:00Z",
      createdDate: "2024-01-01T08:00:00Z",
      submissionsCount: 0,
      approvalRate: 0
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@pupsmb.edu.ph",
      role: "officer",
      organization: "Environmental Club",
      status: "active",
      lastLogin: "2024-10-30T13:10:00Z",
      createdDate: "2024-04-12T10:45:00Z",
      submissionsCount: 12,
      approvalRate: 83
    },
    {
      id: 6,
      name: "Lisa Chen",
      email: "lisa.chen@pupsmb.edu.ph",
      role: "viewer",
      organization: "General Public",
      status: "active",
      lastLogin: "2024-11-01T11:30:00Z",
      createdDate: "2024-06-20T15:20:00Z",
      submissionsCount: 0,
      approvalRate: 0
    },
    {
      id: 7,
      name: "Robert Taylor",
      email: "robert.taylor@pupsmb.edu.ph",
      role: "officer",
      organization: "Sports Committee",
      status: "suspended",
      lastLogin: "2024-10-15T14:20:00Z",
      createdDate: "2024-05-08T12:30:00Z",
      submissionsCount: 6,
      approvalRate: 50
    }
  ]);

  // Handler for adding new user
  const handleAddUser = () => {
    if (!newUserData.name || !newUserData.email || !newUserData.role || !newUserData.organization || !newUserData.password || !newUserData.confirmPassword) {
      alert('Please fill in all required fields');
      return;
    }

    if (newUserData.password !== newUserData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (users.some(user => user.email === newUserData.email)) {
      alert('User with this email already exists');
      return;
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      organization: newUserData.organization === 'custom' ? newUserCustomOrg : newUserData.organization,
      status: 'active',
      lastLogin: '',
      createdDate: new Date().toISOString(),
      submissionsCount: 0,
      approvalRate: 0
    };

    setUsers([...users, newUser]);
    setNewUserData({
      name: '',
      email: '',
      role: '',
      organization: '',
      password: '',
      confirmPassword: ''
    });
    setNewUserCustomOrg('');
    setShowAddUserModal(false);
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin_full', label: 'Admin (Full Control)' },
    { value: 'admin_approval', label: 'Admin (Approval Only)' },
    { value: 'officer', label: 'Officer' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin_full':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'admin_approval':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'officer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin_full':
        return 'Admin (Full)';
      case 'admin_approval':
        return 'Admin (Approval)';
      case 'officer':
        return 'Officer';
      case 'viewer':
        return 'Viewer';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    officers: users.filter(u => u.role === 'officer').length,
    admins: users.filter(u => u.role.includes('admin')).length
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSuspendUser = (user: User) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const confirmSuspendUser = () => {
    // Validate suspension reason if suspending a user
    if (selectedUser?.status !== 'suspended' && !suspensionReason.trim()) {
      alert('Please provide a reason for suspension.');
      return;
    }
    
    // Here you would typically make an API call to suspend/activate the user
    const action = selectedUser?.status === 'suspended' ? 'Activating' : 'Suspending';
    console.log(`${action} user:`, selectedUser?.name);
    if (selectedUser?.status !== 'suspended') {
      console.log('Suspension reason:', suspensionReason);
    }
    
    setShowSuspendModal(false);
    setSelectedUser(null);
    setSuspensionReason('');
  };

  const confirmEditUser = () => {
    if (selectedUser) {
      // Populate the edit form with current user data
      setEditFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        organization: selectedUser.organization,
        status: selectedUser.status
      });
      setShowEditModal(false);
      setShowEditForm(true);
    }
  };

  const handleSaveUser = () => {
    // Get the final organization value (use custom if "Others" is selected)
    const finalOrganization = editFormData.organization === 'Others' ? customOrganization : editFormData.organization;
    
    // Here you would typically make an API call to update the user
    console.log('Saving user with data:', {
      ...editFormData,
      organization: finalOrganization
    });
    setShowEditForm(false);
    setSelectedUser(null);
    setEditFormData({
      name: '',
      email: '',
      role: '',
      organization: '',
      status: ''
    });
    setCustomOrganization('');
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setSelectedUser(null);
    setEditFormData({
      name: '',
      email: '',
      role: '',
      organization: '',
      status: ''
    });
    setCustomOrganization('');
  };

  return (
    <>
      <PageMeta 
        title="User Management | PUPSMB TransparaTech" 
        description="Manage system users, roles, and permissions"
      />
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage users, roles, and permissions across the system
              </p>
            </div>
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.total}</p>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Officers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.officers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userStats.admins}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Users
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
                  placeholder="Search by name, email, or organization..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  id="role-filter"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
            </div>

          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Users ({filteredUsers.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role & Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status & Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {user.organization}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Last login: {formatDate(user.lastLogin)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Edit Icon */}
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded transition-colors"
                          title="Edit User"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {/* Suspend/Activate Icon */}
                        <button 
                          onClick={() => handleSuspendUser(user)}
                          className={`p-2 rounded transition-colors ${
                            user.status === 'suspended' 
                              ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300' 
                              : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                          }`}
                          title={user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                        >
                          {user.status === 'suspended' ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No users match your current filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add New User
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Create a new user account for the TransparaTech system
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUserData({
                      name: '',
                      email: '',
                      role: '',
                      organization: '',
                      password: '',
                      confirmPassword: ''
                    });
                    setNewUserCustomOrg('');
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
                <div className="grid grid-cols-1 gap-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="user@pupsmb.edu.ph"
                        required
                      />
                    </div>
                  </div>

                  {/* Role and Organization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newUserData.role}
                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select a role</option>
                        <option value="admin_full">Admin (Full Control)</option>
                        <option value="admin_approval">Admin (Approval Only)</option>
                        <option value="officer">Officer</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Organization <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newUserData.organization}
                        onChange={(e) => setNewUserData({ ...newUserData, organization: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select organization</option>
                        
                        <optgroup label="Student Organizations">
                          {studentOrgs.map(org => (
                            <option key={org.value} value={org.label}>
                              {org.label}
                            </option>
                          ))}
                        </optgroup>

                        <optgroup label="Administrative">
                          {adminTypes.map(admin => (
                            <option key={admin.value} value={admin.label}>
                              {admin.label}
                            </option>
                          ))}
                        </optgroup>

                        <option value="custom">Other (Specify below)</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Organization */}
                  {newUserData.organization === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newUserCustomOrg}
                        onChange={(e) => setNewUserCustomOrg(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter organization name"
                        required
                      />
                    </div>
                  )}

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={newUserData.confirmPassword}
                        onChange={(e) => setNewUserData({ ...newUserData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Password Requirements:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                      <li>• Include at least one special character</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl flex-shrink-0">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUserData({
                      name: '',
                      email: '',
                      role: '',
                      organization: '',
                      password: '',
                      confirmPassword: ''
                    });
                    setNewUserCustomOrg('');
                  }}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={!newUserData.name || !newUserData.email || !newUserData.role || !newUserData.organization || !newUserData.password || !newUserData.confirmPassword}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Edit User
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>User:</strong> {selectedUser.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You are about to edit this user's information. This will open the user edit form where you can modify their role, organization, and other details.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmEditUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suspend/Activate User Modal */}
        {showSuspendModal && selectedUser && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {selectedUser.status === 'suspended' ? 'Activate User' : 'Suspend User'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>User:</strong> {selectedUser.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedUser.status === 'suspended' 
                  ? 'Are you sure you want to activate this user? They will regain access to the system and be able to perform their assigned role functions.'
                  : 'Are you sure you want to suspend this user? They will lose access to the system immediately and won\'t be able to log in until reactivated.'
                }
              </p>
              
              {/* Suspension Reason - Only show when suspending */}
              {selectedUser.status !== 'suspended' && (
                <div className="mb-6">
                  <label htmlFor="suspension-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Suspension <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="suspension-reason"
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    placeholder="Please provide a reason for suspending this user..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 resize-none"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This reason will be recorded and may be shared with the user.
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowSuspendModal(false);
                    setSelectedUser(null);
                    setSuspensionReason('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSuspendUser}
                  className={`px-4 py-2 rounded-lg transition-colors text-white ${
                    selectedUser.status === 'suspended'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={selectedUser.status !== 'suspended' && !suspensionReason.trim()}
                >
                  {selectedUser.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Edit Form Modal */}
        {showEditForm && selectedUser && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                Edit User Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-role"
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="admin_full">Admin (Full Control)</option>
                    <option value="admin_approval">Admin (Approval Only)</option>
                    <option value="officer">Officer</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                {/* Status Field */}
                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-status"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                {/* Organization Field */}
                <div className="md:col-span-2">
                  <label htmlFor="edit-organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-organization"
                    value={editFormData.organization}
                    onChange={(e) => {
                      setEditFormData({...editFormData, organization: e.target.value});
                      if (e.target.value !== 'Others') {
                        setCustomOrganization('');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    style={{ 
                      appearance: 'menulist',
                      WebkitAppearance: 'menulist',
                      direction: 'ltr'
                    }}
                    required
                  >
                    <option value="">Select an organization</option>
                    <optgroup label="Student Organizations">
                      {studentOrgs.map((org) => (
                        <option key={org.value} value={org.label}>
                          {org.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Administrative Offices">
                      {adminTypes.map((admin) => (
                        <option key={admin.value} value={admin.label}>
                          {admin.label}
                        </option>
                      ))}
                    </optgroup>
                    <option value="Others">Others</option>
                  </select>
                  
                  {/* Custom Organization Input - Shows when "Others" is selected */}
                  {editFormData.organization === 'Others' && (
                    <div className="mt-3">
                      <label htmlFor="custom-organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Specify Organization <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="custom-organization"
                        value={customOrganization}
                        onChange={(e) => setCustomOrganization(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter custom organization name"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Current User Info Display */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current User Information:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div><strong>User ID:</strong> {selectedUser.id}</div>
                  <div><strong>Created:</strong> {new Date(selectedUser.createdDate).toLocaleDateString()}</div>
                  <div><strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleDateString()}</div>
                  <div><strong>Submissions:</strong> {selectedUser.submissionsCount}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={handleCancelEdit}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveUser}
                  disabled={
                    !editFormData.name || 
                    !editFormData.email || 
                    !editFormData.role || 
                    !editFormData.organization || 
                    !editFormData.status ||
                    (editFormData.organization === 'Others' && !customOrganization.trim())
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;