import { useState, useEffect } from "react";
import axios from "axios";
import Badge from "../../../../components/ui/badge/Badge";

interface InfoItem {
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  status: "Available" | "Updated" | "New";
}

export default function PublicInformation() {
  const [publicInfoData, setPublicInfoData] = useState<InfoItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/v1/submissions/public', {
           headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const mappedData = response.data.data.map((item: any) => {
            // Determine status based on date (e.g., if updated in last 3 days -> New/Updated)
            const updatedDate = new Date(item.updated_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            let status: "Available" | "Updated" | "New" = "Available";
            if (diffDays <= 3) status = "New";
            else if (diffDays <= 7) status = "Updated";

            return {
              title: item.title,
              description: item.description,
              category: item.category || 'General',
              lastUpdated: updatedDate.toLocaleDateString(),
              status: status
            };
          });
          setPublicInfoData(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch public info", error);
      }
    };
    fetchData();
  }, []);

  return (
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

        {/* Download button removed per UX request */}
      </div>

      <div className="px-6 pb-6">
        <div className="space-y-4">
          {publicInfoData.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No public information available.</p>
          ) : (
            publicInfoData.map((item, index) => (
            <div
              key={index}
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
                </svg>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white/90">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Updated {item.lastUpdated}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <Badge
                      size="sm"
                      color={
                        item.status === "Updated"
                          ? "success"
                          : item.status === "New"
                          ? "primary"
                          : "light"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}