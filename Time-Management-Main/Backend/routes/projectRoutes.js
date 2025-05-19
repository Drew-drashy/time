const express = require('express');
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.route('/projects')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/projects/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
