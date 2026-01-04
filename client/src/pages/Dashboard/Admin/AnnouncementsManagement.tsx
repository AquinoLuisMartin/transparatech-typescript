import { useState, useEffect } from 'react';
import axios from 'axios';
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
  category: string;
  author: string;
  publishDate: string;
  isSticky: boolean;
  views: number;
  tags: string[];
}

const AnnouncementsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/v1/announcements', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 }
      });
      if (response.data.success) {
        setAnnouncements(response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          priority: item.priority || 'medium',
          category: item.category,
          author: item.author,
          publishDate: item.publish_date,
          isSticky: item.is_sticky,
          views: item.views,
          tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : (item.tags || [])
        })));
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as const,
    category: 'General',
    isSticky: false
  });

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || announcement.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleAddAnnouncement = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('/api/v1/announcements', {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        priority: newAnnouncement.priority,
        category: newAnnouncement.category,
        is_sticky: newAnnouncement.isSticky,
        author: 'System Administrator',
        tags: []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        fetchAnnouncements();
        setNewAnnouncement({ title: '', content: '', priority: 'medium', category: 'General', isSticky: false });
        setShowAddModal(false);
      }
    } catch (err) {
      console.error('Failed to create announcement:', err);
    }
  };

  const handleEditAnnouncement = () => {
    // TODO: Implement edit API call
    if (selectedAnnouncement) {
      setShowEditModal(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteModal(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (announcementToDelete) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`/api/v1/announcements/${announcementToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAnnouncements();
        setShowDeleteModal(false);
        setAnnouncementToDelete(null);
      } catch (err) {
        console.error('Failed to delete announcement:', err);
      }
    }
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

  const totalAnnouncements = announcements.length;
  const stickyAnnouncements = announcements.filter(a => a.isSticky).length;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Sticky Announcements</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stickyAnnouncements}</p>
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="System Update">System Update</option>
              <option value="Meeting">Meeting</option>
              <option value="Event">Event</option>
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading announcements...
                  </td>
                </tr>
              ) : filteredAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No announcements found
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          {announcement.isSticky && (
                            <span title="Sticky" className="text-yellow-500">📌</span>
                          )}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {announcement.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(announcement.publishDate).toLocaleDateString()}
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
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashBinIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                      Category
                    </label>
                    <select
                      value={newAnnouncement.category}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="General">General</option>
                      <option value="System Update">System Update</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>

                  <div className="flex items-center mt-8">
                    <input
                      type="checkbox"
                      id="isSticky"
                      checked={newAnnouncement.isSticky}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isSticky: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="isSticky" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Pin to top (Sticky)
                    </label>
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
                onClick={handleAddAnnouncement}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                Create Announcement
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