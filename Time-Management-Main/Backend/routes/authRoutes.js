const express = require('express');
const { register, login, getProfile } = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();
const { updateProfile } = require('../controllers/authController.js');
const upload = require('../middleware/uploadMiddleware.js');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);


router.put('/profile', protect, upload.single('avatar'), updateProfile);

module.exports = router;
