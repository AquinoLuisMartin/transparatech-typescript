import BarChartOne from "../../../../components/charts/bar/BarChartOne";

export default function DataVisualization() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Bar Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Data Access
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Public data access trends over the past year
          </p>
        </div>
        <div className="p-6">
          <BarChartOne />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Key Statistics
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Important metrics and performance indicators
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Statistic Item */}
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-gray-800 dark:text-white/90">
                99.8%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Uptime
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-gray-800 dark:text-white/90">
                2.4s
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Avg Response
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-gray-800 dark:text-white/90">
                847
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total Documents
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-gray-800 dark:text-white/90">
                15.2K
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monthly Visitors
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Document Access</span>
                <span className="text-gray-800 dark:text-white/90">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Report Downloads</span>
                <span className="text-gray-800 dark:text-white/90">76%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Data Requests</span>
                <span className="text-gray-800 dark:text-white/90">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-warning-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}