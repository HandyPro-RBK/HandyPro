const express = require("express");
const { getrequests,getHistory,accept,reject} = require("../controllers/bookingprovider");

const router = express.Router();

router.get("/history/:providerId", getHistory);
router.get("/:providerId", getrequests);
router.post("/accept", accept);
router.post("/reject", reject);


module.exports = router;
