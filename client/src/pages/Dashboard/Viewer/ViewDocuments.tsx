import React, { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../../../components/common/PageMeta";
import Badge from "../../../components/ui/badge/Badge";
import SubmissionDetailsModal from "../../../components/SubmissionDetailsModal";
import { Submission } from "../../../types/submission";

interface InfoItem extends Submission {
  displayStatus: "Available" | "Updated" | "New";
  lastUpdatedFormatted: string;
}

const ViewDocuments: React.FC = () => {
  const [publicInfoData, setPublicInfoData] = useState<InfoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        console.log('Fetching public documents...');
        const response = await axios.get("/api/v1/submissions/public", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Response:', response.data);
        if (response.data.success && Array.isArray(response.data.data)) {
          console.log('Received documents:', response.data.data.length);
          const mappedData = response.data.data.map((item: any) => {
            const updatedDate = item.updated_at ? new Date(item.updated_at) : new Date();
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let displayStatus: "Available" | "Updated" | "New" = "Available";
            if (diffDays <= 3) displayStatus = "New";
            else if (diffDays <= 7) displayStatus = "Updated";

            // Map database fields to Submission interface
            return {
              ...item,
              id: item.id,
              title: item.title,
              description: item.description || "No description available",
              category: item.category || "General",
              type: item.type,
              status: item.status,
              priority: item.priority,
              submittedDate: item.submitted_date ? new Date(item.submitted_date).toLocaleDateString() : updatedDate.toLocaleDateString(),
              files: item.files || [],
              ai_feedback: item.ai_feedback,
              displayStatus,
              lastUpdatedFormatted: updatedDate.toLocaleDateString(),
            };
          });
          setPublicInfoData(mappedData);
        } else {
             console.warn('Unexpected response format:', response.data);
             setPublicInfoData([]);
        }
      } catch (error) {
        console.error("Failed to fetch public info", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (item: InfoItem) => {
    setSelectedSubmission(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <PageMeta
        title="View Documents"
        description="Browse and access public documents"
      />

      <div className="mb-6">
        <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
          View Documents
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Access key organizational information and documents. Click on a document to view details, AI analysis, and preview.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : publicInfoData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No public information available.
            </p>
          ) : (
            publicInfoData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-900 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors">
                  <svg
                    className="text-gray-600 size-5 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400"
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
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {item.title}
                    </h4>
                    <Badge
                      color={
                        item.displayStatus === "New"
                          ? "success"
                          : item.displayStatus === "Updated"
                          ? "warning"
                          : "info"
                      }
                      size="sm"
                    >
                      {item.displayStatus}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
                    {item.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{item.category || "General"}</span>
                    <span>•</span>
                    <span>{item.lastUpdatedFormatted}</span>
                    {item.ai_feedback && (
                        <span className="flex items-center gap-1 text-blue-500">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            AI Analyzed
                        </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SubmissionDetailsModal
        submission={selectedSubmission}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubmission(null);
        }}
      />
    </>
  );
};

export default ViewDocuments;
