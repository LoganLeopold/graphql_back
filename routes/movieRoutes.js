const express = require('express')
const router = express.Router()
const movieControl = require('../controllers/movieControl')

router.get('/', movieControl.list)
router.post('/create', movieControl.create)

module.exports = router