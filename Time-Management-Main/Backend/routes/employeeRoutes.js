const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();
const { getEmployee ,removeEmployeeFromProject} = require('../controllers/employeeController.js');


router.get('/employees/:employeeId',protect, getEmployee);
router.delete('/employees/:projectId/:employeeId',protect, removeEmployeeFromProject);


module.exports = router;
