const express = require("express");
const { getrequests,getHistory,accept,reject} = require("../controllers/bookingprovider");
const {getProviderProfile,updateProviderProfile} = require("../controllers/getProviderProfile");
const router = express.Router();
// test
router.get("/history/:providerId", getHistory);
router.get("/:providerId", getrequests);
router.post("/accept", accept);
router.post("/reject", reject);
router.get("/profile/:providerId", getProviderProfile);
router.put("/update/:providerId",  updateProviderProfile);

module.exports = router;
