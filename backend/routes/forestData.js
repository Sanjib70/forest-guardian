import express from 'express';
import auth from '../middleware/auth.js';
import ForestData from '../models/ForestData.js';

const router = express.Router();

/* ======================
   Protect all routes
====================== */
router.use(auth);

/* ======================
   POST /api/forest-data
   Create forest data
====================== */
router.post('/', async (req, res, next) => {
  try {
    const forestData = await ForestData.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        forestData,
      },
    });
  } catch (error) {
    next(error);
  }
});

/* ======================
   GET /api/forest-data
   Fetch forest data
====================== */
router.get('/', async (req, res, next) => {
  try {
    const { zone, startDate, endDate } = req.query;
    const filter = {};

    if (zone) filter.zone = zone;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const forestData = await ForestData.find(filter)
      .populate('userId', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      results: forestData.length,
      data: {
        forestData,
      },
    });
  } catch (error) {
    next(error);
  }
});

/* ======================
   GET /api/forest-data/health-index
====================== */
router.get('/health-index', async (req, res, next) => {
  try {
    const forestData = await ForestData.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: '$zone',
          avgTreeCount: { $avg: '$treeCount' },
          avgRainfall: { $avg: '$rainfall' },
          avgTemperature: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          fireIncidents: { $sum: { $size: '$fireIncidents' } },
          dataPoints: { $sum: 1 },
        },
      },
    ]);

    const healthIndex = forestData.map((zone) => {
      let score = 0;

      const treeScore = Math.min((zone.avgTreeCount || 0) / 10, 40);
      score += treeScore;

      const rainfallScore = Math.min((zone.avgRainfall || 0) / 50, 20);
      score += rainfallScore;

      const tempScore = zone.avgTemperature
        ? Math.max(0, 15 - Math.abs(zone.avgTemperature - 25) / 5)
        : 0;
      score += tempScore;

      const humidityScore = zone.avgHumidity
        ? Math.min((zone.avgHumidity - 30) / 4, 15)
        : 0;
      score += humidityScore;

      const firePenalty = Math.min(zone.fireIncidents * 2, 10);
      score -= firePenalty;

      return {
        zone: zone._id,
        healthIndex: Math.max(0, Math.min(100, Math.round(score))),
        factors: {
          treeDensity: Math.round(treeScore),
          rainfall: Math.round(rainfallScore),
          temperature: Math.round(tempScore),
          humidity: Math.round(humidityScore),
          firePenalty: Math.round(firePenalty),
        },
        dataPoints: zone.dataPoints,
      };
    });

    res.json({
      status: 'success',
      data: {
        healthIndex,
      },
    });
  } catch (error) {
    next(error);
  }
});

/* ======================
   EXPORT (CRITICAL)
====================== */
export default router;
