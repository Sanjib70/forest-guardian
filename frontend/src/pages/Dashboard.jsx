const Dashboard = () => {
  return (
    <div className="px-6 py-10">
      {/* Page Container */}
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard
        </h1>

        <p className="text-gray-200 mb-8">
          Overview of forest, reserve forest, sanctuary, and greenery data.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-md">
            <p className="text-sm text-gray-600">Forest Data Entries</p>
            <p className="text-3xl font-bold text-green-700 mt-2">0</p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-md">
            <p className="text-sm text-gray-600">Issue Reports</p>
            <p className="text-3xl font-bold text-red-600 mt-2">0</p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-md">
            <p className="text-sm text-gray-600">Forest Zones</p>
            <p className="text-3xl font-bold text-green-700 mt-2">4</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
