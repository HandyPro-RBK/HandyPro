const express = require('express');
const router = express.Router();
const { createService, getServicesByProvider, getCategories } = require('../controllers/serviceController');

router.post('/create',createService);
router.get('/provider/:providerId', getServicesByProvider);
router.get('/categories', getCategories);

module.exports = router;