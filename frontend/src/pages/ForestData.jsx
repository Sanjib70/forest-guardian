import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom'

export default function ForestData() {
  const [formData, setFormData] = useState({
    zone: 'conservation',
    treeCount: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    animalSightings: [],
    fireIncidents: [],
    notes: '',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });
  const [currentAnimal, setCurrentAnimal] = useState({ species: '', count: '' });
  const [currentFire, setCurrentFire] = useState({ severity: 'low', area: '' });
  const [submittedData, setSubmittedData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate ();
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${API}/api/forest-data `, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSubmittedData(response.data?.data?.forestData || []);
        }
      } catch (error) {
        console.error('Error fetching forest data:', error);
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [pos.coords.longitude, pos.coords.latitude]
            }
          }));
        },
        () => {
          toast.error('Could not get your location');
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addAnimalSighting = () => {
    if (currentAnimal.species && currentAnimal.count) {
      setFormData(prev => ({
        ...prev,
        animalSightings: [
          ...prev.animalSightings,
          {
            ...currentAnimal,
            count: parseInt(currentAnimal.count),
            timestamp: new Date()
          }
        ]
      }));
      setCurrentAnimal({ species: '', count: '' });
    }
  };

  const addFireIncident = () => {
    if (currentFire.area) {
      setFormData(prev => ({
        ...prev,
        fireIncidents: [
          ...prev.fireIncidents,
          {
            ...currentFire,
            area: parseInt(currentFire.area),
            timestamp: new Date(),
            status: 'active'
          }
        ]
      }));
      setCurrentFire({ severity: 'low', area: '' });
    }
  };

  const mapData = submittedData.map(item => ({
    state: item.zone,   // TEMP (will improve later)
    density: item.treeCount || 0
  }))

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const payload = {
        ...formData,
        treeCount: formData.treeCount ? parseInt(formData.treeCount) : undefined,
        rainfall: formData.rainfall ? parseFloat(formData.rainfall) : undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        humidity: formData.humidity ? parseFloat(formData.humidity) : undefined
      };

      await axios.post(`${API}/api/forest-data `, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Forest data logged successfully!');
      setFormData({
        zone: 'conservation',
        treeCount: '',
        rainfall: '',
        temperature: '',
        humidity: '',
        animalSightings: [],
        fireIncidents: [],
        notes: '',
        location: formData.location
      });

      // Refresh the data list
      const response = await axios.get(`${API}/api/forest-data `, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmittedData(response.data.data.forestData);
    } catch (error) {
      toast.error('Error logging forest data');
    }
  };
  if (loading) return <h2>Loading...</h2>
  if (error) return <h2>{error}</h2>

  return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-green-100 mb-8">
          Log Forest Data
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  Forest Zone
                </label>
                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="conservation">Conservation</option>
                  <option value="recreation">Recreation</option>
                  <option value="protected">Protected</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Tree Count
                  </label>
                  <input
                    type="number"
                    name="treeCount"
                    value={formData.treeCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Rainfall (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>

              {/* Animal Sightings */}
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  Animal Sightings
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Species"
                    value={currentAnimal.species}
                    onChange={(e) => setCurrentAnimal(prev => ({ ...prev, species: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                  <input
                    type="number"
                    placeholder="Count"
                    value={currentAnimal.count}
                    onChange={(e) => setCurrentAnimal(prev => ({ ...prev, count: e.target.value }))}
                    className="w-20 px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                  <button
                    type="button"
                    onClick={addAnimalSighting}
                    className="bg-forest-600 text-white px-3 py-2 rounded-md hover:bg-forest-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {formData.animalSightings.map((animal, index) => (
                    <div key={index} className="text-sm text-forest-600 bg-forest-50 p-2 rounded">
                      {animal.count}x {animal.species}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fire Incidents */}
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  Fire Incidents
                </label>
                <div className="flex space-x-2 mb-2">
                  <select
                    value={currentFire.severity}
                    onChange={(e) => setCurrentFire(prev => ({ ...prev, severity: e.target.value }))}
                    className="px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Area (m²)"
                    value={currentFire.area}
                    onChange={(e) => setCurrentFire(prev => ({ ...prev, area: e.target.value }))}
                    className="w-32 px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                  <button
                    type="button"
                    onClick={addFireIncident}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {formData.fireIncidents.map((fire, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {fire.severity} severity - {fire.area}m²
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-forest-700 transition focus:outline-none focus:ring-2 focus:ring-forest-500"
              >
                Submit Forest Data
              </button>
            </form>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-forest-800 mb-4">
              Recent Submissions
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {submittedData.map((data) => (
                <div key={data._id} className="border border-forest-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-forest-700 capitalize">
                      {data.zone} Zone
                    </span>
                    <span className="text-sm text-forest-500">
                      {new Date(data.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {data.treeCount && (
                    <div className="text-sm">Trees: {data.treeCount}</div>
                  )}
                  {data.rainfall && (
                    <div className="text-sm">Rainfall: {data.rainfall}mm</div>
                  )}
                  {data.animalSightings?.length > 0 && (
                    <div className="text-sm">
                      Animals: {data.animalSightings?.length} sightings
                    </div>
                  )}
                </div>
              ))}
              {submittedData.length === 0 && (
                <p className="text-forest-500 text-center py-4">
                  No data submitted yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}