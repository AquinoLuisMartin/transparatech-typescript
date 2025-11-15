import PageMeta from '../../components/common/PageMeta';

const Unauthorized = () => {
  return (
    <>
      <PageMeta title="Unauthorized" description="Unauthorized access page" />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    </>
  );
};

export default Unauthorized;
