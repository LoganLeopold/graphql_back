const express = require('express')
const router = express.Router()

router.use('/actors', require('./actorRoutes.js'));
router.use('/directors', require('./directorRoutes.js'));
router.use('/movies', require('./movieRoutes.js'));
router.use('/platforms', require('./platformRoutes.js'));

module.exports = router