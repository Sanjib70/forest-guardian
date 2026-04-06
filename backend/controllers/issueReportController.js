import mongoose from 'mongoose';
import IssueReport from '../models/IssueReport.js';

/**
 * @desc    Create a new issue report
 * @route   POST /api/issue-reports
 * @access  Private
 */
export const createIssueReport = async (req, res, next) => {
  try {
    const { title, description, issueType, location, severity } = req.body;

    if (!title || !description || !issueType) {
      res.status(400);
      throw new Error('Title, description and issue type are required');
    }

    const report = await IssueReport.create({
      title,
      description,
      issueType,
      location,
      severity,
      reportedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all issue reports
 * @route   GET /api/issue-reports
 * @access  Private
 */
export const getAllIssueReports = async (req, res, next) => {
  try {
    const reports = await IssueReport.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single issue report by ID
 * @route   GET /api/issue-reports/:id
 * @access  Private
 */
export const getIssueReportById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error('Invalid issue report ID');
    }

    const report = await IssueReport.findById(req.params.id)
      .populate('reportedBy', 'name email');

    if (!report) {
      res.status(404);
      throw new Error('Issue report not found');
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update issue report status
 * @route   PUT /api/issue-reports/:id
 * @access  Private (Admin / Officer)
 */
export const updateIssueReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatus = ['open', 'in-progress', 'resolved', 'closed'];
    if (status && !allowedStatus.includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }

    const report = await IssueReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Issue report not found');
    }

    report.status = status || report.status;
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Issue report updated successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete issue report
 * @route   DELETE /api/issue-reports/:id
 * @access  Private (Admin)
 */
export const deleteIssueReport = async (req, res, next) => {
  try {
    const report = await IssueReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Issue report not found');
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Issue report deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
