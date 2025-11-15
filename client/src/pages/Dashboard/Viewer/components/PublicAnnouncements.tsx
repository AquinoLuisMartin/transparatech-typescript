import Badge from "../../../../components/ui/badge/Badge";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  category: string;
}

const announcements: Announcement[] = [
  {
    id: 1,
    title: "New Transparency Initiative",
    content: "Launching enhanced public data access portal with improved search capabilities",
    date: "Nov 28, 2024",
    priority: "High",
    category: "Policy"
  },
  {
    id: 2,
    title: "Quarterly Report Available",
    content: "Q4 2024 transparency and performance report is now available for download",
    date: "Nov 25, 2024",
    priority: "Medium",
    category: "Reports"
  },
  {
    id: 3,
    title: "Public Consultation Open",
    content: "Share your feedback on proposed policy changes affecting public data access",
    date: "Nov 20, 2024",
    priority: "Medium",
    category: "Engagement"
  },
  {
    id: 4,
    title: "System Maintenance Notice",
    content: "Scheduled maintenance on Dec 5th from 2 AM to 4 AM EST",
    date: "Nov 18, 2024",
    priority: "Low",
    category: "Technical"
  }
];

export default function PublicAnnouncements() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 mb-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Public Announcements
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Latest updates and important notices
          </p>
        </div>

        {/* Subscribe button removed per UX request */}
      </div>

      <div className="px-6 pb-6">
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white/90">
                      {announcement.title}
                    </h4>
                    <Badge
                      size="sm"
                      color={
                        announcement.priority === "High"
                          ? "error"
                          : announcement.priority === "Medium"
                          ? "warning"
                          : "light"
                      }
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {announcement.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {announcement.date}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg dark:bg-gray-800">
                  <svg
                    className="text-gray-600 size-4 dark:text-gray-300"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.364 4.636A9 9 0 0 1 12 21A9 9 0 0 1 5.636 4.636A9 9 0 1 1 18.364 4.636Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8V12L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}