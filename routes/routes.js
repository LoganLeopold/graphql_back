const express = require('express')
const router = express.Router()

router.use('/actor', require('./actorRoutes.js'));
// router.use('/job', require('./jobRoutes'));

module.exports = router