import React, { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../../../components/common/PageMeta";
import Badge from "../../../components/ui/badge/Badge";

interface Stats {
  public_documents: number;
  reports: number;
  datasets: number;
  views: number;
  pending_submissions: number;
}

interface InfoItem {
  id: number;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  status: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  category: string;
}

const ViewerDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    public_documents: 0,
    reports: 0,
    datasets: 0,
    views: 0,
    pending_submissions: 0,
  });

  const [publicInfo, setPublicInfo] = useState<InfoItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Stats
        try {
          const statsRes = await axios.get("/api/v1/submissions/stats", {
            headers,
          });
          if (statsRes.data.success && statsRes.data.data) {
            console.log('Stats received:', statsRes.data.data);
            setStats(statsRes.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch stats", error);
        }

        // Fetch Public Submissions
        try {
          const publicRes = await axios.get("/api/v1/submissions/public", {
            headers,
          });
          if (publicRes.data.success && Array.isArray(publicRes.data.data)) {
            const rawData = publicRes.data.data;
            console.log('Public submissions received:', rawData.length);

            // Map Public Info (limit to 3 recent)
            const mappedInfo = rawData.slice(0, 3).map((item: any) => {
              const updatedDate = item.updated_at ? new Date(item.updated_at) : new Date();
              
              const statusStr = (item.status || "Unknown").toLowerCase();
              const formattedStatus = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);

              return {
                id: item.id,
                title: item.title,
                description: item.description || "No description available",
                category: item.category || "General",
                lastUpdated: updatedDate.toLocaleDateString(),
                status: formattedStatus,
              };
            });
            setPublicInfo(mappedInfo);
          }
        } catch (error) {
          console.error("Failed to fetch public info", error);
        }

        // Fetch Announcements
        try {
          const announcementsRes = await axios.get("/api/v1/announcements", {
            headers,
          });
          if (announcementsRes.data.success && Array.isArray(announcementsRes.data.data)) {
            const mappedAnnouncements = announcementsRes.data.data
              .slice(0, 3)
              .map((item: any) => ({
                id: item.id,
                title: item.title,
                content: item.content,
                date: new Date(
                  item.publish_date || item.created_at || Date.now()
                ).toLocaleDateString(),
                priority:
                  item.priority && ["High", "Medium", "Low"].includes(item.priority)
                    ? item.priority
                    : "Medium",
                category: item.category || "General",
              }));
            setAnnouncements(mappedAnnouncements);
          }
        } catch (error) {
          console.error("Failed to fetch announcements", error);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number | string) => {
    const n = Number(num);
    if (isNaN(n)) return "0";
    if (n >= 1000) {
      return (n / 1000).toFixed(1) + "K";
    }
    return n.toString();
  };

  const metrics = [
    {
      title: "Total Documents",
      value: stats.public_documents,
      label: "All Files",
      labelColor: "info" as const,
      icon: (
        <svg
          className="text-gray-800 size-6 dark:text-white/90"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 2V8H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 13H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 17H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Reports Published",
      value: stats.reports,
      label: "All Reports",
      labelColor: "success" as const,
      icon: (
        <svg
          className="text-gray-800 size-6 dark:text-white/90"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 13H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 9H10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 21H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Pending Documents",
      value: stats.pending_submissions,
      label: "Submitted",
      labelColor: "warning" as const,
      icon: (
        <svg
          className="text-gray-800 size-6 dark:text-white/90"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
              d="M12 6V12L16 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Public Views",
      value: stats.views,
      label: "Monthly",
      labelColor: "primary" as const,
      icon: (
        <svg
          className="text-gray-800 size-6 dark:text-white/90"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.45825 12C3.73253 7.9429 7.52281 5 12.0002 5C16.4776 5 20.2679 7.94291 21.5422 12C20.2679 16.0571 16.4776 19 12.0002 19C7.52281 19 3.73253 16.0571 2.45825 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <PageMeta
        title="Viewer Dashboard"
        description="Public transparency dashboard for viewing organizational information"
      />

      {/* Page Header */}
      <div className="mb-6">
        <div className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
              Public Transparency Portal
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Access public information, reports, and organizational transparency
              data
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                {metric.icon}
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.title}
                  </span>
                  {loading ? (
                    <div className="h-8 w-16 mt-2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  ) : (
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                      {formatNumber(metric.value)}
                    </h4>
                  )}
                </div>
                <Badge color={metric.labelColor} size="sm">
                  {metric.label}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Public Information */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-2 mb-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Public Information
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Access key organizational information and documents
                </p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  </div>
                ) : publicInfo.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No public information available.
                  </p>
                ) : (
                  publicInfo.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
                        <svg
                          className="text-gray-600 size-5 dark:text-gray-300"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7 7H17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7 12H17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7 17H13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                            {item.title}
                          </h4>
                          <Badge
                            color={
                              item.status === "Approved"
                                ? "success"
                                : item.status === "Rejected"
                                ? "error"
                                : "warning"
                            }
                            size="sm"
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
                          {item.description || "No description available"}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Public Announcements */}
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
            </div>

            <div className="px-6 pb-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  </div>
                ) : announcements.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No announcements available.
                  </p>
                ) : (
                  announcements.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800">
                        <svg
                          className="text-gray-600 size-5 dark:text-gray-300"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 5.00001C10.8 5.00001 11.6 5.10001 12.3 5.30001L10.3 7.30001C10.2 7.30001 10.1 7.30001 10 7.30001C7.8 7.30001 6 9.10001 6 11.3V16H10V18H3V16L5 14V11.3C5 8.80001 6.8 6.60001 9.2 6.10001C9.6 5.40001 10 5.00001 10 5.00001ZM21 16H21.3L22 16.7V17.9L21.4 18.5H19.9L19.3 17.9V17H14V16L16 14V11H17.2L13.2 15H17.8L21 11.8V16ZM11.4 12.2L12.8 10.8C12.9 10.9 13 10.9 13 11V14.2L11 16.2V12.6C11.1 12.5 11.2 12.3 11.4 12.2ZM24 6.40001L19.8 10.6C19.8 10.6 19.8 10.6 19.8 10.6C16.9 7.70001 16.9 2.90001 16.9 2.90001L21.1 7.10001C21.1 7.10001 22.3 7.30001 22.9 6.70001C23.6 6.00001 24 6.40001 24 6.40001Z"
                            fill="currentColor"
                          />
                          <path
                            d="M12 22C10.9 22 10 21.1 10 20H14C14 21.1 13.1 22 12 22Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                            {item.title}
                          </h4>
                          <Badge
                            color={
                              item.priority === "High"
                                ? "error"
                                : item.priority === "Medium"
                                ? "warning"
                                : "success"
                            }
                            size="sm"
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
                          {item.content || "No details available"}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewerDashboard;
