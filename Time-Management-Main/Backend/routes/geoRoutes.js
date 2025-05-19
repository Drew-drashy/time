const express = require('express');
const { createGeofence, getGeofences, getGeofenceByProject } = require('../controllers/geoController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.post('/geofences', protect, createGeofence);
router.get('/geofences', protect, getGeofences);
router.get('/geofences/:projectId', protect, getGeofenceByProject);

module.exports = router;
