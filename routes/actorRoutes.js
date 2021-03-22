const express = require('express')
const router = express.Router()
const actorControl = require('../controllers/actorControl')

router.get('/', actorControl.list)
router.post('/create', actorControl.create)

module.exports = router