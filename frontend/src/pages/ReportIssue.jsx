import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    type: 'illegal_logging',
    description: '',
    severity: 'medium',
    status: 'open',
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
  })

  const [submittedReports, setSubmittedReports] = useState([])
  const navigate = useNavigate()

  // ✅ Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await axios.get(
          'https://forest-guardian.onrender.com/api/issue-reports',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        console.log("FETCH REPORTS:", res.data)

        setSubmittedReports(res.data?.data?.issueReports || [])
      } catch (error) {
        console.error('FETCH ERROR:', error.response?.data)
      }
    }

    fetchReports()
  }, [])

  // ✅ Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lng = pos.coords.longitude
          const lat = pos.coords.latitude

          setFormData((prev) => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [Number(lng), Number(lat)],
            },
          }))
        },
        () => {
          toast.error('Location permission denied')
        }
      )
    }
  }, [])

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ✅ Submit issue (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🔥 Validation
    if (!formData.description.trim()) {
      toast.error('Description is required')
      return
    }

    if (
      !formData.location.coordinates[0] ||
      !formData.location.coordinates[1]
    ) {
      toast.error('Location not available yet')
      return
    }

    const finalData = {
      type: formData.type,
      description: formData.description.trim(),
      severity: formData.severity,
      status: formData.status,
      location: {
        type: 'Point',
        coordinates: [
          Number(formData.location.coordinates[0]),
          Number(formData.location.coordinates[1]),
        ],
      },
    }

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        toast.error('Please login first')
        navigate('/login')
        return
      }

      console.log('SUBMITTING:', finalData)

      const res = await axios.post(
        'https://forest-guardian.onrender.com/api/issue-reports',
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('SUCCESS RESPONSE:', res.data)

      toast.success('Issue reported successfully!')

      // ✅ Reset form (keep location)
      setFormData((prev) => ({
        ...prev,
        description: '',
      }))

      // ✅ Refresh reports
      const updated = await axios.get(
        'https://forest-guardian.onrender.com/api/issue-reports',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setSubmittedReports(updated.data?.data?.issueReports || [])
    } catch (error) {
      console.error('SUBMIT ERROR:', error.response?.data)
      toast.error(
        error.response?.data?.message || 'Error reporting issue'
      )
    }
  }

  const getTypeLabel = (type) => {
    const labels = {
      illegal_logging: 'Illegal Logging',
      pollution: 'Pollution',
      wildfire: 'Wildfire',
      poaching: 'Poaching',
      other: 'Other',
    }
    return labels[type] || type
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-green-100 mb-8">
        Report an Issue
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FORM */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="illegal_logging">Illegal Logging</option>
              <option value="pollution">Pollution</option>
              <option value="wildfire">Wildfire</option>
              <option value="poaching">Poaching</option>
              <option value="other">Other</option>
            </select>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe the issue..."
              className="w-full px-3 py-2 border rounded"
            />

            <button className="w-full bg-red-600 text-white py-2 rounded">
              Report Issue
            </button>
          </form>
        </div>

        {/* REPORT LIST */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Reports</h2>

          {submittedReports.map((report) => (
            <div key={report._id} className="border p-3 mb-2 rounded">
              <b>{getTypeLabel(report.type)}</b>
              <p>{report.description}</p>
              <small>{report.status}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReportIssue