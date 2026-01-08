import React, { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../../../components/common/PageMeta";
import Badge from "../../../components/ui/badge/Badge";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  category: string;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/v1/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && response.data.data) {
          const mappedData = (response.data.data || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            date: new Date(
              item.publish_date || item.created_at
            ).toLocaleDateString(),
            priority:
              item.priority && ["High", "Medium", "Low"].includes(item.priority)
                ? item.priority
                : "Medium",
            category: item.category || "General",
          }));
          setAnnouncements(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageMeta
        title="Announcements"
        description="View latest updates and important notices"
      />

      <div className="mb-6">
        <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
          Public Announcements
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Latest updates and important notices
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No announcements available.
            </p>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-900 transition-colors"
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
    </>
  );
};

export default Announcements;
