import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  const handleViewAllNotifications = () => {
    closeDropdown();
    setIsPanelOpen(true);
  };

  const closePanelAndReset = () => {
    setIsPanelOpen(false);
  };

  // Mock notification data
  const allNotifications = [
    {
      id: '1',
      user: {
        name: 'Terry Franci',
        avatar: '/images/user/user-02.jpg',
        isOnline: true,
      },
      message: 'requests permission to change',
      project: 'Project - Nganter App',
      type: 'project',
      timestamp: '2024-11-05T10:30:00Z',
      timeAgo: '5 min ago',
      isRead: false,
    },
    {
      id: '2',
      user: {
        name: 'Alena Franci',
        avatar: '/images/user/user-03.jpg',
        isOnline: true,
      },
      message: 'requests permission to change',
      project: 'Project - Nganter App',
      type: 'project',
      timestamp: '2024-11-05T10:27:00Z',
      timeAgo: '8 min ago',
      isRead: false,
    },
    {
      id: '3',
      user: {
        name: 'Jocelyn Kenter',
        avatar: '/images/user/user-04.jpg',
        isOnline: true,
      },
      message: 'requests permission to change',
      project: 'Project - Nganter App',
      type: 'project',
      timestamp: '2024-11-05T10:20:00Z',
      timeAgo: '15 min ago',
      isRead: true,
    },
    {
      id: '4',
      user: {
        name: 'Brandon Philips',
        avatar: '/images/user/user-05.jpg',
        isOnline: false,
      },
      message: 'requests permission to change',
      project: 'Project - Nganter App',
      type: 'project',
      timestamp: '2024-11-05T09:35:00Z',
      timeAgo: '1 hr ago',
      isRead: true,
    },
    {
      id: '5',
      user: {
        name: 'System Administrator',
        avatar: '/images/user/system-avatar.jpg',
        isOnline: true,
      },
      message: 'System maintenance scheduled for tonight at 2:00 AM',
      type: 'system',
      timestamp: '2024-11-05T08:00:00Z',
      timeAgo: '3 hrs ago',
      isRead: false,
    },
    {
      id: '6',
      user: {
        name: 'Sarah Wilson',
        avatar: '/images/user/user-06.jpg',
        isOnline: true,
      },
      message: 'uploaded a new document for approval',
      project: 'Quarterly Financial Report',
      type: 'project',
      timestamp: '2024-11-05T07:30:00Z',
      timeAgo: '4 hrs ago',
      isRead: true,
    },
    {
      id: '7',
      user: {
        name: 'Mike Johnson',
        avatar: '/images/user/user-07.jpg',
        isOnline: false,
      },
      message: 'submitted an expense report',
      project: 'Event Management',
      type: 'project',
      timestamp: '2024-11-04T16:45:00Z',
      timeAgo: '1 day ago',
      isRead: true,
    },
    {
      id: '8',
      user: {
        name: 'Emma Davis',
        avatar: '/images/user/user-08.jpg',
        isOnline: true,
      },
      message: 'commented on your submission',
      project: 'Monthly Budget Report',
      type: 'project',
      timestamp: '2024-11-04T14:20:00Z',
      timeAgo: '1 day ago',
      isRead: false,
    },
  ];

  const markAsRead = (id: string) => {
    // In a real app, you would update the notification state
    console.log('Marking notification as read:', id);
  };

  const markAllAsRead = () => {
    // In a real app, you would update all notifications to read
    console.log('Marking all notifications as read');
  };

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  return (
    <>
      <div className="relative">
        <button
          className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          onClick={handleClick}
        >
          <span
            className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
              !notifying ? "hidden" : "flex"
            }`}
          >
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
              fill="currentColor"
            />
          </svg>
        </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notification
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar max-h-80">
          {/* Example notification items */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-02.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block  text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Terry Franci
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>5 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-03.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Alena Franci
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>8 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-04.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Jocelyn Kenter
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>15 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              to="/"
            >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-05.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Brandon Philips
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>1 hr ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              onItemClick={closeDropdown}
            >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-02.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Terry Franci
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>5 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-03.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Alena Franci
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>8 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-04.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block  space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Jocelyn Kenter
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>15 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-05.jpg"
                  alt="User"
                  className="overflow-hidden rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Brandon Philips
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                  <span>Project</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>1 hr ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>
          {/* Add more items as needed */}
        </ul>
        <button
          onClick={handleViewAllNotifications}
          className="block w-full px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </button>
      </Dropdown>
      </div>

      {/* Slide-in Notification Panel */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Background overlay with blur effect */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closePanelAndReset}
          ></div>
          
          {/* Slide panel */}
          <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  All Notifications
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount} unread notifications
                </p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={closePanelAndReset}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {allNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {notification.type === 'system' ? (
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={notification.user.avatar}
                              alt={notification.user.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.user.name)}&background=random`;
                              }}
                            />
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                              notification.user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {notification.user.name}
                              </span>{' '}
                              {notification.message}{' '}
                              {notification.project && (
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {notification.project}
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {notification.timeAgo}
                              </span>
                            </div>
                          </div>
                          
                          {/* Unread indicator */}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty state */}
              {allNotifications.length === 0 && (
                <div className="p-12 text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V3h5v14z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No notifications yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    When you receive notifications, they'll appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
