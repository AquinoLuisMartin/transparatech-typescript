import { useRoutes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import AdminDashboard from '../pages/Dashboard/Admin';
import DocumentApprovals from '../pages/Dashboard/Admin/DocumentApprovals';
import UserManagement from '../pages/Dashboard/Admin/UserManagement';
import OrganizationManagement from '../pages/Dashboard/Admin/OrganizationManagement';
import AnnouncementsManagement from '../pages/Dashboard/Admin/AnnouncementsManagement';
import AnalyticsReports from '../pages/Dashboard/Admin/AnalyticsReports';
import OfficerDashboard from '../pages/Dashboard/Officer';
import UploadDocuments from '../pages/Dashboard/Officer/UploadDocuments';
import MySubmissions from '../pages/Dashboard/Officer/MySubmissions';
import ActivityLog from '../pages/Dashboard/Officer/ActivityLog';
import ViewerDashboard from '../pages/Dashboard/Viewer';
import DocumentsViewer from '../pages/Dashboard/Viewer/DocumentsViewer';
import TransparencyReportViewer from '../pages/Dashboard/Viewer/TransparencyReportViewer';
import AnnouncementsViewer from '../pages/Dashboard/Viewer/AnnouncementsViewer';
import FeedbackViewer from '../pages/Dashboard/Viewer/FeedbackViewer';
import AccountSettings from '../pages/AccountSettings';
import LogIn from '../pages/AuthPages/LogIn';
import SignUp from '../pages/AuthPages/SignUp';
import NotFound from '../pages/OtherPage/NotFound';
import Unauthorized from '../pages/OtherPage/Unauthorized';
import AppLayout from '../layout/AppLayout';
import UserProfiles from '../pages/UserProfiles';
import Calendar from '../pages/Calendar';
import Blank from '../pages/Blank';
import FormElements from '../pages/Forms/FormElements';
import BasicTables from '../pages/Tables/BasicTables';
import Alerts from '../pages/UiElements/Alerts';
import Avatars from '../pages/UiElements/Avatars';
import Badges from '../pages/UiElements/Badges';
import Buttons from '../pages/UiElements/Buttons';
import Images from '../pages/UiElements/Images';
import Videos from '../pages/UiElements/Videos';
import LineChart from '../pages/Charts/LineChart';
import BarChart from '../pages/Charts/BarChart';
import FileUpload from '../pages/FileUpload';

import LandingHome from '../pages/Landing/Home';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <LandingHome />,
    },
    {
      path: '/dashboard',
      element: <AppLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        {
          path: 'admin',
          element: (
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          ),
        },
        {
          path: 'admin/approvals',
          element: (
            <PrivateRoute>
              <DocumentApprovals />
            </PrivateRoute>
          ),
        },
        {
          path: 'admin/document-queue',
          element: (
            <PrivateRoute>
              <DocumentApprovals />
            </PrivateRoute>
          ),
        },
        {
          path: 'admin/user-management',
          element: (
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          ),
        },
        {
          path: 'admin/organization-management',
          element: (
            <PrivateRoute>
              <OrganizationManagement />
            </PrivateRoute>
          ),
        },
        {
          path: 'admin/announcements-management',
          element: (
            <PrivateRoute>
              <AnnouncementsManagement />
            </PrivateRoute>
          ),
        },
        {
          path: 'admin/analytics-reports',
          element: (
            <PrivateRoute>
              <AnalyticsReports />
            </PrivateRoute>
          ),
        },
        {
          path: 'officer',
          element: (
            <PrivateRoute>
              <OfficerDashboard />
            </PrivateRoute>
          ),
        },
        {
          path: 'officer/upload-documents',
          element: (
            <PrivateRoute>
              <UploadDocuments />
            </PrivateRoute>
          ),
        },
        {
          path: 'officer/my-submissions',
          element: (
            <PrivateRoute>
              <MySubmissions />
            </PrivateRoute>
          ),
        },
        {
          path: 'officer/activity-log',
          element: (
            <PrivateRoute>
              <ActivityLog />
            </PrivateRoute>
          ),
        },
        // Officer announcements route removed (Officer-specific announcements page disabled)
        {
          path: 'viewer',
          element: (
            <PrivateRoute>
              <ViewerDashboard />
            </PrivateRoute>
          ),
        },
        {
          path: 'viewer/documents',
          element: (
            <PrivateRoute>
              <DocumentsViewer />
            </PrivateRoute>
          ),
        },
        {
          path: 'viewer/transparency',
          element: (
            <PrivateRoute>
              <TransparencyReportViewer />
            </PrivateRoute>
          ),
        },
        {
          path: 'viewer/announcements',
          element: (
            <PrivateRoute>
              <AnnouncementsViewer />
            </PrivateRoute>
          ),
        },
        {
          path: 'viewer/feedback',
          element: (
            <PrivateRoute>
              <FeedbackViewer />
            </PrivateRoute>
          ),
        },
        {
          path: 'account-settings',
          element: (
            <PrivateRoute>
              <AccountSettings />
            </PrivateRoute>
          ),
        },
        { path: 'profile', element: <UserProfiles /> },
        { path: 'calendar', element: <Calendar /> },
        { path: 'blank', element: <Blank /> },
        { path: 'forms/form-elements', element: <FormElements /> },
        { path: 'tables/basic-tables', element: <BasicTables /> },
        { path: 'ui/alerts', element: <Alerts /> },
        { path: 'ui/avatars', element: <Avatars /> },
        { path: 'ui/badge', element: <Badges /> },
        { path: 'ui/buttons', element: <Buttons /> },
        { path: 'ui/images', element: <Images /> },
        { path: 'ui/videos', element: <Videos /> },
        { path: 'charts/line-chart', element: <LineChart /> },
        { path: 'charts/bar-chart', element: <BarChart /> },
        {
          path: 'file-upload',
          element: (
            <PrivateRoute>
              <FileUpload />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: '/auth',
      children: [
        { path: 'signin', element: <LogIn /> },
        { path: 'signup', element: <SignUp /> },
      ],
    },
    { path: 'unauthorized', element: <Unauthorized /> },
    { path: '*', element: <NotFound /> },
  ]);

  return routes;
};

export default AppRoutes;
