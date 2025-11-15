import React from 'react';

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  user: string;
  timestamp: string;
  details: Record<string, any>;
  icon: string;
  color: string;
}

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { user, type, timestamp, details, icon, color } = activity;

  const getActivityIcon = (type: string, color: string) => {
    const iconClass = `w-4 h-4 text-${color}-600`;
    switch (type) {
      case 'upload':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      case 'check':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'x':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'message':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'download':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'edit':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const verbMap: Record<string, string> = {
    submission: 'submitted',
    approval: 'approved',
    comment: 'commented on',
    download: 'downloaded',
    rejection: 'rejected',
    edit: 'updated',
    system: 'updated'
  };

  const verb = verbMap[type] || 'performed';
  const docName = details?.documentTitle || activity.title;
  const category = details?.category || '';
  const assignedTo = details?.reviewer || details?.approver || details?.rejector || details?.assignee || '';

  return (
    <div className="bg-white rounded-md border border-gray-200 p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-${color}-100`}>
            {getActivityIcon(icon, color)}
          </div>


          <div className="min-w-0">
            <div className="text-lg text-gray-900 mb-2">
              <span className="text-gray-900">{user}</span>{' '}
              <span className="text-gray-500">{verb}</span>{' '}
              <span className="text-gray-900">{docName}</span>
            </div>

            {(category || assignedTo) && (
              <div className="text-sm text-gray-500 mt-1 mb-2">
                {category}{category && assignedTo ? ' • ' : ''}{assignedTo ? `Assigned to: ${assignedTo}` : ''}
              </div>
            )}

            {/* comment/note */}
            {(details?.comment || details?.comments || details?.reason) && (
              <div className="bg-gray-50 border-l-2 border-purple-200 px-3 py-2 mt-2 text-sm text-gray-600 rounded-sm">
                {details?.comment || details?.comments || details?.reason}
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">{formatTimestamp(timestamp)}</div>
          <div className="text-sm text-gray-500">{new Date(timestamp).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
export { ActivityCard };
