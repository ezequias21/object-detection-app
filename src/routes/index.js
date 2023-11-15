const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('home'))

const authRoutes = require('./auth')
const roomRoutes = require('./room')

router.use('/', authRoutes)
router.use('/', roomRoutes)

module.exports = router