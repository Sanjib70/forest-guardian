import axios from 'axios'
import { useEffect, useState } from 'react'

const HealthIndex = () => {
  const [healthIndex, setHealthIndex] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ NEW: Manual Calculator State
  const [input, setInput] = useState({
    treeCount: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    fireIncidents: ''
  })

  const [calculatedIndex, setCalculatedIndex] = useState(null)

  // ✅ FETCH BACKEND DATA
  useEffect(() => {
    const fetchHealthIndex = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axios.get('http://localhost:5000/api/forest-data/health-index', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setHealthIndex(response.data.data.healthIndex)
        }
      } catch (error) {
        console.error('Error fetching health index:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthIndex()
  }, [])

  // ✅ INPUT HANDLER
  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: parseFloat(e.target.value)
    })
  }

  // ✅ CALCULATION LOGIC (MATCHES BACKEND)
  const calculateHealthIndex = () => {
    let score = 0

    const treeScore = Math.min((input.treeCount || 0) / 10, 40)
    score += treeScore

    const rainfallScore = Math.min((input.rainfall || 0) / 50, 20)
    score += rainfallScore

    const tempScore = input.temperature
      ? Math.max(0, 15 - Math.abs(input.temperature - 25) / 5)
      : 0
    score += tempScore

    const humidityScore = input.humidity
      ? Math.min((input.humidity - 30) / 4, 15)
      : 0
    score += humidityScore

    const firePenalty = Math.min((input.fireIncidents || 0) * 2, 10)
    score -= firePenalty

    const finalScore = Math.max(0, Math.min(100, Math.round(score)))
    setCalculatedIndex(finalScore)
  }

  // ✅ UI HELPERS
  const getHealthColor = (index) => {
    if (index >= 80) return 'bg-green-500'
    if (index >= 60) return 'bg-yellow-500'
    if (index >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getHealthStatus = (index) => {
    if (index >= 80) return 'Excellent'
    if (index >= 60) return 'Good'
    if (index >= 40) return 'Fair'
    return 'Poor'
  }

  if (loading) {
    return (
      <div className="text-center py-10">Loading health index...</div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">

      {/* 🔥 NEW: MANUAL CALCULATOR */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-forest-800 mb-4">
          Manual Health Index Calculator
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input name="treeCount" placeholder="Tree Count(number of trees)" onChange={handleInputChange} className="border p-2 rounded" />
          <input name="rainfall" placeholder="Rainfall(mm)" onChange={handleInputChange} className="border p-2 rounded" />
          <input name="temperature" placeholder="Temperature(C)" onChange={handleInputChange} className="border p-2 rounded" />
          <input name="humidity" placeholder="Humidity(%)" onChange={handleInputChange} className="border p-2 rounded" />
          <input name="fireIncidents" placeholder="Fire Incidents(count)" onChange={handleInputChange} className="border p-2 rounded col-span-2" />
        </div>

        <button
          onClick={calculateHealthIndex}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Calculate
        </button>

        {calculatedIndex !== null && (
          <div className="mt-4 text-xl font-bold">
            Health Index: {calculatedIndex}
          </div>
        )}
      </div>

      {/* EXISTING DATA */}
      <h1 className="text-4xl font-bold text-green-100 mb-6">
        Forest Health Index (Live Data)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {healthIndex.map((zone) => (
          <div key={zone.zone} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold capitalize">
                {zone.zone} Zone
              </h3>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {zone.healthIndex}
                </div>
                <div className="text-sm">
                  {getHealthStatus(zone.healthIndex)}
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded mb-4">
              <div
                className={`${getHealthColor(zone.healthIndex)} h-3 rounded`}
                style={{ width: `${zone.healthIndex}%` }}
              ></div>
            </div>

            <div className="text-sm space-y-1">
              <div>Tree density Score: +{zone.factors.treeDensity}</div>
              <div>Rainfall: +{zone.factors.rainfall}</div>
              <div>Temp: +{zone.factors.temperature}</div>
              <div>Humidity: +{zone.factors.humidity}</div>
              <div className="text-red-600">
                Fire: -{zone.factors.firePenalty}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INFO */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-forest-800 mb-4">
          How the Health Index is Calculated
        </h2>

        <ul className="list-disc list-inside space-y-2 text-forest-700">
          <li><strong>Tree Density (0–40 pts):</strong> Based on number of trees in the region</li>
          <li><strong>Rainfall (0–20 pts):</strong> Higher rainfall improves forest growth</li>
          <li><strong>Temperature (0–15 pts):</strong> Ideal around 25°C</li>
          <li><strong>Humidity (0–15 pts):</strong> Higher humidity supports ecosystem</li>
          <li><strong>Fire Incidents (-10 pts):</strong> More fires reduce forest health</li>
        </ul>

        <p className="mt-4 text-sm text-forest-600">
          Final score is normalized between 0 and 100.
        </p>
      </div>

    </div>
  )
}

export default HealthIndex