const express = require('express');
const router = express.Router();
const { login, logout } = require("../controllers/authController")

//Routes
router.get('/', (req, res) => res.render('home'))
router.get('/login', (req, res) => res.render('login'))
router.get('/logout', logout)
router.post('/login', login)

module.exports = router