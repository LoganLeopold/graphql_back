const express = require('express')
const router = express.Router()
const directorControl = require('../controllers/directorControl')

router.get('/', directorControl.list)
router.get('/many/:id', directorControl.findMany)

module.exports = router