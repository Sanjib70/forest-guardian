import ForestData from '../models/ForestData.js';

/**
 * @desc    Get all forest data
 * @route   GET /api/forest-data
 * @access  Public
 */
export const getAllForestData = async (req, res) => {
  try {
    const data = await ForestData.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forest data',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single forest record by ID
 * @route   GET /api/forest-data/:id
 * @access  Public
 */
export const getForestDataById = async (req, res) => {
  try {
    const forest = await ForestData.findById(req.params.id);

    if (!forest) {
      return res.status(404).json({
        success: false,
        message: 'Forest data not found',
      });
    }

    res.status(200).json({
      success: true,
      data: forest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forest data',
      error: error.message,
    });
  }
};

/**
 * @desc    Add new forest data
 * @route   POST /api/forest-data
 * @access  Private (Admin / Officer later)
 */
export const createForestData = async (req, res) => {
  try {
    const {
      regionName,
      forestArea,
      treeDensity,
      biodiversityIndex,
      status,
      location,
    } = req.body;

    if (!regionName || !forestArea) {
      return res.status(400).json({
        success: false,
        message: 'Region name and forest area are required',
      });
    }

    const forestData = await ForestData.create({
      regionName,
      forestArea,
      treeDensity,
      biodiversityIndex,
      status,
      location,
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      message: 'Forest data created successfully',
      data: forestData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create forest data',
      error: error.message,
    });
  }
};

/**
 * @desc    Update forest data
 * @route   PUT /api/forest-data/:id
 * @access  Private
 */
export const updateForestData = async (req, res) => {
  try {
    const forest = await ForestData.findById(req.params.id);

    if (!forest) {
      return res.status(404).json({
        success: false,
        message: 'Forest data not found',
      });
    }

    const updatedForest = await ForestData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Forest data updated successfully',
      data: updatedForest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update forest data',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete forest data
 * @route   DELETE /api/forest-data/:id
 * @access  Private
 */
export const deleteForestData = async (req, res) => {
  try {
    const forest = await ForestData.findById(req.params.id);

    if (!forest) {
      return res.status(404).json({
        success: false,
        message: 'Forest data not found',
      });
    }

    await forest.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Forest data deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete forest data',
      error: error.message,
    });
  }
};
