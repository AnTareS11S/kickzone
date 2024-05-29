const NotFoundPage = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center p-4'>
      <div className=' w-full bg-white shadow-xl rounded-xl p-8'>
        <div className='text-center'>
          <h1 className='text-5xl font-extrabold text-gray-800 mb-4'>404</h1>
          <p className='text-xl text-gray-600 mb-6'>Page Not Found</p>
          <p className='text-gray-700 mb-8'>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Please check the URL and try again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
