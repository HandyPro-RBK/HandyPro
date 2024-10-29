const express = require("express");
const {
  createNewServiceProvider,
  loginServiceProvider,
  getProviderServices,
  updateServiceProvider,
} = require("../controllers/providerController");

const router = express.Router();

// Route to register a new service provider
router.post("/create", createNewServiceProvider);

// Route to log in an existing service provider
router.post("/login", loginServiceProvider);

module.exports = router;
