const express = require('express');
const router = express.Router();
const userController = require('../../controllers/ControllerAdmin/userController');
const { verifyToken, adminOnly } = require('../../middleware/authMiddleware');

router.post('/admin/login', userController.login);
router.post('/admin/signup', userController.adminSignup);
// Protected admin routes
// router.use(verifyToken, adminOnly);
router.get('/:role', userController.getAllUsers);
// Add other admin-only routes here

module.exports = router;