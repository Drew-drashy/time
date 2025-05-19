const TimeLog = require('../models/timeLog');
const Project =require('../models/Project');
const { checkIfInsideGeofence } = require('../utils/geoUtils');

exports.startSession = async (req, res) => {
  try {
    const { projectId, latitude, longitude } = req.body;
    // checking if the location is not under 50 m it wont start.
    // console.log(latitude, longitude);
    const project=await Project.findById(projectId);
    if(!project){
      return res.status(400).json({message:'Assigned Project Cannot Be Found!'});
    }
    if (!project.center || !project.radius) {
      return res.status(400).json({ message: 'Geofence is not defined for this project.' });
    }
    
    const isInside = checkIfInsideGeofence(
      latitude,
      longitude,
      project.center.latitude,
      project.center.longitude,
      project.radius
    );

    if(!isInside) {
      return res.status(400).json({message:'You are not at the Project Location'});
    }

    const timeLog = await TimeLog.create({
      user: req.user.id,
      project: projectId,
      startTime: new Date(),
      startLocation: { latitude, longitude },
    });
    res.status(201).json(timeLog);
  } catch (err) {
    res.status(400).json({ message: 'Start session failed' });
  }
};

exports.endSession = async (req, res) => {
  try {
    const { sessionId, latitude, longitude } = req.body;

    const session = await TimeLog.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const project = await Project.findById(session.project);
    if (!project) {
      return res.status(400).json({ message: 'Assigned Project Cannot Be Found!' });
    }

    if (!project.center || !project.radius) {
      return res.status(400).json({ message: 'Geofence is not defined for this project.' });
    }

    const isInside = checkIfInsideGeofence(
      latitude,
      longitude,
      project.center.latitude,
      project.center.longitude,
      project.radius
    );

    if (!isInside) {
      return res.status(400).json({ message: 'You are not at the Project Location' });
    }

    session.endTime = new Date();
    session.endLocation = { latitude, longitude };
    session.totalHours =
      (new Date(session.endTime) - new Date(session.startTime)) / 3600000; // ms to hrs

    await session.save();

    res.status(200).json(session);
  } catch (err) {
    console.error('End session error:', err);
    res.status(500).json({ message: 'End session failed' });
  }
};



exports.getLogs = async (req, res) => {
  try {
    const { projectId, groupByDate } = req.query;
    const userId = req.user.id;

    const filter = { user: userId };
    if (projectId) filter.project = projectId;

    const logs = await TimeLog.find(filter).populate('project', 'name');

    // If grouping is requested (e.g., for calendar view)
    if (groupByDate === 'true') {
      const grouped = logs.reduce((acc, log) => {
        const date = log.startTime.toISOString().split('T')[0];

        if (!acc[date]) {
          acc[date] = {
            date,
            totalHours: 0,
            images: [],
            project: log.project.name,
          };
        }

        acc[date].totalHours += log.totalHours || 0;

        if (log.uploads && Array.isArray(log.uploads)) {
          acc[date].images.push(...log.uploads);
        }

        return acc;
      }, {});

      return res.json(Object.values(grouped));
    }

    // Basic flat list return
    return res.json(logs);
  } catch (err) {
    console.error('Log fetch error:', err);
    res.status(500).json({ message: 'Error fetching logs' });
  }
};

// const TimeLog = require('../models/TimeLog');

/**
 * GET /api/time/logs/admin/:employeeId
 * Query params:
 *   - groupByDate=true  → returns [{ date, totalHours, images: [] }, …]
 * Otherwise returns flat array of TimeLog documents.
 */
exports.getLogsByAdmin = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { groupByDate } = req.query;

    // Fetch all logs for that user, plus project name and any uploads array
    const logs = await TimeLog.find({ user: employeeId })
      .populate('project', 'name')
      .sort({ startTime: -1 });

    if (groupByDate === 'true') {
      // Group logs by day
      const grouped = logs.reduce((acc, log) => {
        const date = log.startTime.toISOString().split('T')[0]; 
        if (!acc[date]) {
          acc[date] = { date, totalHours: 0, images: [] };
        }
        acc[date].totalHours += log.totalHours || 0;
        if (Array.isArray(log.uploads)) {
          acc[date].images.push(...log.uploads);
        }
        return acc;
      }, {});
      return res.status(200).json(Object.values(grouped));
    }

    // Flat list fallback
    return res.status(200).json(logs);
  } catch (err) {
    console.error('Admin log fetch error:', err);
    return res.status(500).json({ message: 'Error fetching employee logs' });
  }
};
