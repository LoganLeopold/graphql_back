const express = require('express')
const router = express.Router()
const movieControl = require('../controllers/movieControl')

router.get('/', movieControl.list)
router.post('/create', movieControl.create)
router.get('/:id', movieControl.findOne)
router.put('/:id', movieControl.update)

module.exports = router