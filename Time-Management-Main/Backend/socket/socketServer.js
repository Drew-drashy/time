const { checkIfInsideGeofence } = require('../utils/geoUtils');
const Geofence = require('../models/Geofence');
const TimeLog = require('../models/TimeLog'); // Optional if you want to auto-end session
const Project=require('../models/Project');
let io;
exports.setupSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Listen for employee location updates
    socket.on('sendLocation', async (data) => {
      io.emit('locationUpdate', data); // Broadcast to Admins

      const { latitude, longitude, userId, projectId, sessionId } = data;

      // Fetch assigned project's geofence
      // const fence = await Geofence.findOne({ project: projectId });
      // if (!fence) return;
      const project=await Project.findById(projectId);
      if(!project || !project.center || !project.radius) return ;
      console.log('hi');
      const isInside = checkIfInsideGeofence(
        latitude,
        longitude,
        project.center.latitude,
        project.center.longitude,
        project.radius
      );

      if (!isInside) {
        // 🚨 Broadcast Geofence Violation
        io.emit('geofenceViolation', { userId, message: 'User exited geofence area!' });
        console.log(`User ${userId} exited the geofence.`);

        // (Optional) Auto-End Session
        if (sessionId) {
          const session = await TimeLog.findById(sessionId);
          if (session && !session.endTime) {
            session.endTime = new Date();
            session.endLocation = { latitude, longitude };
            session.totalHours = (new Date(session.endTime) - new Date(session.startTime)) / 3600000; // in hours
            await session.save();
            console.log(`Session ${sessionId} ended due to geofence exit.`);
          }
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
