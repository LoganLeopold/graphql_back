const express = require('express')
const router = express.Router()
const directorControl = require('../controllers/directorControl')

router.get('/', directorControl.list)
// router.post('/create', actorControl.create)

module.exports = router