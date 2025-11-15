import PageMeta from '../../../components/common/PageMeta';
import ViewerMetrics from './components/ViewerMetrics';
import PublicInformation from './components/PublicInformation';
import TransparencyReports from './components/TransparencyReports';
import PublicAnnouncements from './components/PublicAnnouncements';

const ViewerDashboard = () => {
  return (
    <>
      <PageMeta title="Viewer Dashboard" description="Public transparency dashboard for viewing organizational information" />
      
      {/* Page Header */}
      <div className="mb-6">
        <div className="mt-4">
          <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
            Public Transparency Portal
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Access public information, reports, and organizational transparency data
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Metrics Overview */}
        <ViewerMetrics />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Public Information */}
          <PublicInformation />
          
          {/* Public Announcements */}
          <PublicAnnouncements />
        </div>

        {/* Transparency Reports */}
        <TransparencyReports />

  {/* DataVisualization and ContactInformation removed per UX request */}
      </div>
    </>
  );
};

export default ViewerDashboard;
