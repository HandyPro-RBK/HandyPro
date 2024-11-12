const express = require("express");
const router = express.Router();
const userController = require("../../controllers/ControllerAdmin/userController");
const { verifyToken, adminOnly } = require("../../middleware/authMiddleware");

router.post("/admin/login", userController.login);
router.post("/admin/signup", userController.adminSignup);
// Protected admin routes
// router.use(verifyToken, adminOnly);
router.get("/:role", userController.getAllUsers);
// Add other admin-only routes here
router.delete("/admin/delete-category/:id", userController.deleteCategory);
router.post("/admin/add-category", userController.createCategory);
router.put("/admin/update-category/:id", userController.updateCategory);
router.delete("/admin/delete-user/:id", userController.deleteUser);
router.put("/admin/ban-user/:id", userController.banUser);
router.put("/admin/valid-provider/:id", userController.validProvider);
module.exports = router;
