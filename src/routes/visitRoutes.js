const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const { isAuthorized } = require('../middleware/roleMiddleware');

// Doctor/User Operations
router.post('/', isAuthorized, visitController.addVisit);

module.exports = router;
