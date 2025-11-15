import PageMeta from '../components/common/PageMeta';
import { useAuth } from '../hooks/useAuth';
import { PERMISSIONS } from '../permissions';
import { Navigate } from 'react-router-dom';

const FileUpload = () => {
  const { hasPermission } = useAuth();

  if (!hasPermission(PERMISSIONS.CAN_UPLOAD_FILES)) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <>
      <PageMeta title="File Upload" description="File upload page for officers" />
      <h1 className="text-2xl font-bold">File Upload</h1>
      <p>Here you can upload files.</p>
      {/* Add file upload form here */}
    </>
  );
};

export default FileUpload;
