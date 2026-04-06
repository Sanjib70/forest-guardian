import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const InteractiveMap = React.lazy(() => import('../components/InteractiveMap'))

const MapPage = () => {
  const [forestData, setForestData] = useState([
    {
      zone: "conservation",
      location: {
        type: "Point",
        coordinates: [88.36, 22.57]
      }
    }
  ])
  const [issueReports, setIssueReports] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const [forestRes, issuesRes] = await Promise.all([
            axios.get('/api/forest-data', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('/api/issue-reports', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ])

          console.log("Forest Response:", forestRes.data)
          console.log("Issues Response:", issuesRes.data)

          console.log(
            "First Forest Item:",
            forestRes.data?.data?.forestData?.[0] ||
            forestRes.data?.forestData?.[0] ||
            forestRes.data?.[0]
          )

          console.log("Type of forestData:", typeof forestData)
          console.log("Is Array:", Array.isArray(forestData))
          console.log("forestData:", forestData)
          console.log("Forest Data Final:", forestData)

          setForestData(
            forestRes.data?.data?.forestData ||
            forestRes.data?.forestData ||
            []
          )
          console.log("First forest item:", forestRes.data?.data?.forestData?.[0])

          setIssueReports(issuesRes.data?.data?.issueReports || [])
        }
      } catch (error) {
        console.error('Error fetching map data:', error)
      }
    }

    fetchData()
  }, [])

  const handleLocationSelect = (latlng) => {
    setSelectedLocation({
      lat: latlng.lat,
      lng: latlng.lng
    })
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-green-100 mb-6">
        Interactive Forest Map
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <React.Suspense fallback={<div>Loading map...</div>}>
          <InteractiveMap
            onLocationSelect={handleLocationSelect}
            forestData={forestData}
            issueReports={issueReports}
          />
        </React.Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-forest-800 mb-4">
            Map Legend
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <span>Conservation Zone</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <span>Recreation Zone</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
              <span>Protected Zone</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <span>Restricted Zone</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-forest-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/forest-data"
              className="block w-full bg-forest-600 text-white text-center py-2 px-4 rounded hover:bg-forest-700 transition"
            >
              Log Forest Data at This Location
            </Link>
            <Link
              to="/report-issue"
              className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Report Issue at This Location
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


export default MapPage