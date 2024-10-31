const express = require("express");
const { getrequests,accept,reject} = require("../controllers/ProviderBooking");

const router = express.Router();


router.get("/:providerId", getrequests);
router.post("/accept", accept);
router.post("/reject", reject);


module.exports = router;
