const express = require('express')
const router = express.Router()
const movieControl = require('../controllers/movieControl')

router.get('/', movieControl.list)
router.post('/create', movieControl.create)
router.get('/:id', movieControl.findOne)
router.put('/update/:id', movieControl.update)
router.put('/testAbs/:id', movieControl.testAbst)

module.exports = router