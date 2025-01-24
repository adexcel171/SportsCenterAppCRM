const PageNotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
      <p className="mt-4 text-xl font-semibold">Oops! Page Not Found</p>
      <p className="mt-2 text-gray-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};
export default PageNotFound;
