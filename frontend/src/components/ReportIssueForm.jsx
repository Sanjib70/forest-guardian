import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ReportIssueForm = () => {
  const [formData, setFormData] = useState({
    regionName: "",
    regionType: "",
    issueType: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.regionName ||
      !formData.regionType ||
      !formData.issueType ||
      !formData.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // 🔗 Backend API (replace with real endpoint later)
      await axios.post("/api/report-issue", formData);

      toast.success("Issue reported successfully 🌱");

      setFormData({
        regionName: "",
        regionType: "",
        issueType: "",
        description: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      toast.error("Failed to report issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-green-800 mb-4">
        Report Environmental Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Region Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Region Name *
          </label>
          <input
            type="text"
            name="regionName"
            value={formData.regionName}
            onChange={handleChange}
            placeholder="e.g. Sundarbans Reserve Forest"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Region Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Region Type *
          </label>
          <select
            name="regionType"
            value={formData.regionType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select region type</option>
            <option value="Reserve Forest">Reserve Forest</option>
            <option value="Protected Forest">Protected Forest</option>
            <option value="Wildlife Sanctuary">Wildlife Sanctuary</option>
            <option value="National Park">National Park</option>
            <option value="Urban Green Zone">Urban Green Zone</option>
          </select>
        </div>

        {/* Issue Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Issue Type *
          </label>
          <select
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select issue</option>
            <option value="Illegal Logging">Illegal Logging</option>
            <option value="Poaching">Poaching</option>
            <option value="Forest Fire">Forest Fire</option>
            <option value="Land Encroachment">Land Encroachment</option>
            <option value="Pollution">Pollution</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the issue in detail..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Coordinates (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Latitude (optional)
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Longitude (optional)
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportIssueForm;
