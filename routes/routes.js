const express = require('express')
const router = express.Router()

router.use('/actor', require('./actorRoutes.js'));
// router.use('/director', require(''));
router.use('/movie', require('./movieRoutes.js'));
// router.use('/platform', require('./'));

module.exports = router