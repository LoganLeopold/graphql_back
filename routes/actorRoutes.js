const express = require('express')
const router = express.Router()
const actorControl = require('../controllers/actorControl')

router.get('/', actorControl.list)

module.exports = router