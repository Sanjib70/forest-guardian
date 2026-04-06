import express from 'express'
import auth from '../middleware/auth.js'
import IssueReport from '../models/IssueReport.js'

const router = express.Router()

/* ======================
   Protect all routes
====================== */
router.use(auth)

/* ======================
   POST /api/issue-reports
   Create issue report
====================== */
router.post('/', async (req, res, next) => {
  try {
    console.log("REQ BODY:", req.body)
    const { type, description, severity, status, location } = req.body

    // ✅ Basic validation
    if (!type || !severity || !location?.coordinates) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields',
      })
    }

    const issueReport = await IssueReport.create({
      type,
      description,
      severity,
      status: status || 'open',
      location, // GeoJSON format
      userId: req.user.id,
    })

    res.status(201).json({
      status: 'success',
      data: {
        issueReport,
      },
    })
  } catch (error) {
    next(error)
  }

  
})

/* ======================
   GET /api/issue-reports
   Fetch issue reports
====================== */
router.get('/', async (req, res, next) => {
  try {
    const { type, status, severity } = req.query
    const filter = {}

    if (type) filter.type = type
    if (status) filter.status = status
    if (severity) filter.severity = severity

    // ✅ Role-based filtering
    if (req.user.role !== 'ranger') {
      filter.userId = req.user.id
    }

    const issueReports = await IssueReport.find(filter)
      .populate('userId', 'name role')
      .sort({ createdAt: -1 })

    res.status(200).json({
      status: 'success',
      results: issueReports.length,
      data: {
        issueReports,
      },
    })
  } catch (error) {
    next(error)
  }
})

/* ======================
   PATCH /api/issue-reports/:id/status
   Update report status
====================== */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        status: 'fail',
        message: 'Status is required',
      })
    }

    const issueReport = await IssueReport.findById(req.params.id)

    if (!issueReport) {
      return res.status(404).json({
        status: 'fail',
        message: 'Issue report not found',
      })
    }

    // ✅ Only ranger allowed
    if (req.user.role !== 'ranger') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only rangers can update report status',
      })
    }

    issueReport.status = status
    await issueReport.save()

    res.status(200).json({
      status: 'success',
      data: {
        issueReport,
      },
    })
  } catch (error) {
    next(error)
  }
})

/* ======================
   OPTIONAL: GET SINGLE ISSUE
====================== */
router.get('/:id', async (req, res, next) => {
  try {
    const issueReport = await IssueReport.findById(req.params.id)
      .populate('userId', 'name role')

    if (!issueReport) {
      return res.status(404).json({
        status: 'fail',
        message: 'Issue not found',
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        issueReport,
      },
    })
  } catch (error) {
    next(error)
  }
})


export default router