import React, { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../../../components/common/PageMeta";
import Badge from "../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

interface Report {
  id: number;
  title: string;
  category: string;
  period: string;
  publishDate: string;
  status: string;
  summary: string;
  size: string;
  downloadUrl: string;
  type: string;
}

const TransparencyReport: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/v1/submissions/public", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && Array.isArray(response.data.data)) {
          const mappedReports = response.data.data
            .filter((item: any) => {
              const type = (item.type || "").toLowerCase();
              return (
                type.includes("report") ||
                type.includes("summary") ||
                type === "turnover of assets"
              );
            })
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              category: item.category || "General",
              period: item.created_at ? new Date(item.created_at).getFullYear().toString() : new Date().getFullYear().toString(),
              publishDate: item.updated_at 
                ? new Date(item.updated_at).toISOString().split("T")[0] 
                : new Date().toISOString().split("T")[0],
              status: "Published",
              summary: item.description,
              size: "2.5 MB",
              downloadUrl:
                item.files && item.files.length > 0
                  ? `/uploads/${item.files[0]}`
                  : "#",
              type: item.type,
            }));
          setReports(mappedReports);
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async (url: string) => {
    if (!url || url === "#") {
      alert("No file available for download.");
      return;
    }
    window.open(url, "_blank");
  };

  return (
    <>
      <PageMeta
        title="Transparency Report"
        description="View and download transparency reports"
      />

      <div className="mb-6">
        <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
          Transparency Reports
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Access published organizational reports and documents
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : reports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No transparency reports available.
            </p>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader className="min-w-[200px]">
                      Report Name
                    </TableCell>
                    <TableCell isHeader>Period</TableCell>
                    <TableCell isHeader>Date Published</TableCell>
                    <TableCell isHeader>Status</TableCell>
                    <TableCell isHeader>Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white/90">
                            {report.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {report.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {report.period}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {report.publishDate}
                      </TableCell>
                      <TableCell>
                        <Badge color="success" size="sm">
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() =>
                            handleDownload(report.downloadUrl)
                          }
                          className="flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                          Download
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TransparencyReport;
