const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Spinner */}
      <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>

      {/* Optional Text */}
      <p className="mt-3 text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default Loader;
