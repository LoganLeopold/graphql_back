const express = require('express')
const router = express.Router()
const platformControl = require('../controllers/platformControl')

// router.get('/', platformControl.list)
// router.post('/create', platformControl.create)
router.get('/many/:id', platformControl.findMany)

module.exports = router