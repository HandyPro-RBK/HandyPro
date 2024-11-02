const express = require("express");
const router = express.Router();
const {
  fetchAllServices,
  updateService,
} = require("../controllers/myServiceController");

router.get("/", fetchAllServices); 
router.put("/:id", updateService); 

module.exports = router;
