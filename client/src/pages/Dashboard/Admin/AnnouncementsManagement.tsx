import { useState } from 'react';
import { 
  PencilIcon, 
  TrashBinIcon,
  DocsIcon,
  CalenderIcon,
  UserIcon
} from '../../../icons';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'published' | 'archived';
  targetAudience: 'all' | 'students' | 'officers' | 'organizations';
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  expiresAt?: string;
  views: number;
}

const AnnouncementsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  // Mock data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Student Organization Registration Open',
      content: 'Registration for new student organizations is now open. Please submit your applications by December 15, 2025.',
      priority: 'high',
      status: 'published',
      targetAudience: 'students',
      createdBy: 'System Administrator',
      createdAt: '2025-10-15',
      publishedAt: '2025-10-15',
      expiresAt: '2025-12-15',
      views: 245
    },
    {
      id: '2',
      title: 'System Maintenance Scheduled',
      content: 'The TransparaTech system will undergo maintenance on November 10, 2025, from 2:00 AM to 6:00 AM. The system will be temporarily unavailable.',
      priority: 'urgent',
      status: 'published',
      targetAudience: 'all',
      createdBy: 'System Administrator',
      createdAt: '2025-11-01',
      publishedAt: '2025-11-01',
      expiresAt: '2025-11-11',
      views: 567
    },
    {
      id: '3',
      title: 'New Document Submission Guidelines',
      content: 'Updated guidelines for document submission are now available. Please review the new requirements before submitting documents.',
      priority: 'medium',
      status: 'published',
      targetAudience: 'officers',
      createdBy: 'System Administrator',
      createdAt: '2025-10-28',
      publishedAt: '2025-10-30',
      views: 123
    },
    {
      id: '4',
      title: 'Holiday Schedule Notice',
      content: 'Please note the holiday schedule for December 2025. Offices will be closed on specific dates.',
      priority: 'low',
      status: 'draft',
      targetAudience: 'all',
      createdBy: 'System Administrator',
      createdAt: '2025-11-02',
      views: 0
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as const,
    targetAudience: 'all' as const,
    expiresAt: ''
  });

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || announcement.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddAnnouncement = (status: 'draft' | 'published' = 'published') => {
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      priority: newAnnouncement.priority,
      status: status,
      targetAudience: newAnnouncement.targetAudience,
      createdBy: 'System Administrator',
      createdAt: new Date().toISOString().split('T')[0],
      publishedAt: status === 'published' ? new Date().toISOString().split('T')[0] : undefined,
      expiresAt: newAnnouncement.expiresAt || undefined,
      views: 0
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', priority: 'medium', targetAudience: 'all', expiresAt: '' });
    setShowAddModal(false);
  };

  const handleEditAnnouncement = () => {
    if (selectedAnnouncement) {
      setAnnouncements(announcements.map(announcement => 
        announcement.id === selectedAnnouncement.id ? selectedAnnouncement : announcement
      ));
      setShowEditModal(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteModal(true);
  };

  const confirmDeleteAnnouncement = () => {
    if (announcementToDelete) {
      setAnnouncements(announcements.filter(announcement => announcement.id !== announcementToDelete.id));
      setShowDeleteModal(false);
      setAnnouncementToDelete(null);
    }
  };

  const handlePublishAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, status: 'published', publishedAt: new Date().toISOString().split('T')[0] }
        : announcement
    ));
  };

  const handleArchiveAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, status: 'archived' }
        : announcement
    ));
  };

  const handleUnarchiveAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, status: 'published', publishedAt: new Date().toISOString().split('T')[0] }
        : announcement
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'archived': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const totalAnnouncements = announcements.length;
  const publishedAnnouncements = announcements.filter(a => a.status === 'published').length;
  const draftAnnouncements = announcements.filter(a => a.status === 'draft').length;
  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Announcements Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create, manage, and publish system-wide announcements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center">
            <DocsIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Announcements</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalAnnouncements}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <CalenderIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Published</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{publishedAnnouncements}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center">
            <PencilIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Drafts</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{draftAnnouncements}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Views</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published' | 'archived')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high' | 'urgent')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Announcement
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Announcement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Audience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAnnouncements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {announcement.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {announcement.content}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(announcement.status)}`}>
                      {announcement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {announcement.targetAudience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAnnouncement(announcement);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {announcement.status === 'draft' && (
                        <button
                          onClick={() => handlePublishAnnouncement(announcement.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Publish"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                        </button>
                      )}
                      {announcement.status === 'published' && (
                        <button
                          onClick={() => handleArchiveAnnouncement(announcement.id)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          title="Archive"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4m6-2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2z" />
                          </svg>
                        </button>
                      )}
                      {announcement.status === 'archived' && (
                        <button
                          onClick={() => handleUnarchiveAnnouncement(announcement.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Unarchive"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l3-3m0 0l3 3m-3-3v12m8-16V6a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2h10a2 2 0 012 2z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement)}
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

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Announcement
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Post a new announcement to the system
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

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={5}
                    placeholder="Enter announcement content"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as typeof newAnnouncement.priority })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={newAnnouncement.targetAudience}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value as typeof newAnnouncement.targetAudience })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students</option>
                      <option value="officers">Officers</option>
                      <option value="organizations">Organizations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expires On (Optional)
                    </label>
                    <input
                      type="date"
                      value={newAnnouncement.expiresAt}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl flex-shrink-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddAnnouncement('draft')}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleAddAnnouncement('published')}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                Publish Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal - Similar structure to Add modal */}
      {showEditModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Announcement
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update announcement information
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAnnouncement(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedAnnouncement.title}
                    onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={selectedAnnouncement.content}
                    onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, content: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={selectedAnnouncement.priority}
                      onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, priority: e.target.value as typeof selectedAnnouncement.priority })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={selectedAnnouncement.targetAudience}
                      onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, targetAudience: e.target.value as typeof selectedAnnouncement.targetAudience })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students</option>
                      <option value="officers">Officers</option>
                      <option value="organizations">Organizations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expires On
                    </label>
                    <input
                      type="date"
                      value={selectedAnnouncement.expiresAt || ''}
                      onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, expiresAt: e.target.value || undefined })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl flex-shrink-0">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAnnouncement(null);
                }}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAnnouncement}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && announcementToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ease-out flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Announcement
                  </h3>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Are you sure you want to delete this announcement? This action cannot be undone.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {announcementToDelete.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created on {new Date(announcementToDelete.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAnnouncementToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAnnouncement}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                >
                  Delete Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManagement;