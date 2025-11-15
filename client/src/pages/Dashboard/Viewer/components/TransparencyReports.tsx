import Badge from "../../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { reports as reportsData } from '../TransparencyReportViewer';

export default function TransparencyReports() {
  const handleDownload = async (url: string, filename?: string) => {
    if (!url) return;
    // derive filename from url if not provided
    let name = filename;
    if (!name) {
      try {
        const m = url.match(/[^\/\\?#]+(?=$|[?#])/);
        name = m ? decodeURIComponent(m[0]) : 'download';
      } catch (e) {
        name = 'download';
      }
    }

    // Try native anchor download first
    try {
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', name);
      a.setAttribute('rel', 'noopener');
      // some browsers require the anchor to be in the DOM
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    } catch (err) {
      // fallback to fetch -> blob
    }

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Network response was not ok');
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.setAttribute('download', name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Last resort: open in new tab
      window.open(url, '_blank');
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Transparency Reports
          </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View the most recent transparency reports and updates.
            </p>
        </div>
        {/* Archive and All Reports buttons removed per UX request */}
      </div>
      
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Report
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Period
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Size
              </TableCell>
                {/* Downloads column removed per UX request */}
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {(() => {
              // show most recent reports from the shared reportsData source
              const dateOf = (r: any) => {
                if (r.publishDate) return new Date(r.publishDate).getTime() || 0;
                return 0;
              };
              const sorted = [...reportsData].sort((a: any, b: any) => dateOf(b) - dateOf(a));
              // show up to 6 most recent reports from the shared reportsData source
              const recent = sorted.slice(0, 6);
              return recent.map((report: any) => (
              <TableRow key={report.id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {report.title}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {report.type ?? 'Report'}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {report.period ?? report.publishDate}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {report.size}
                </TableCell>
                    {/* Downloads cell removed */}
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={
                      report.status === "Published"
                        ? "success"
                        : report.status === "Draft"
                        ? "warning"
                        : "light"
                    }
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <button
                    onClick={() => {
                      const url = (report as any).downloadUrl;
                      const extMatch = url ? url.match(/\.[^/.?]+(?=$|\?)/) : null;
                      const ext = extMatch ? extMatch[0] : '.pdf';
                      handleDownload(url, `${report.title}${ext}`);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white dark:text-white"
                  >
                    <svg
                      className="stroke-current"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Download
                  </button>
                </TableCell>
              </TableRow>
              ));
            })()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}