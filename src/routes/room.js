const express = require('express');
const router = express.Router();
const { enterRoom, getRoom, createRoom, getCreateRoom } = require("../controllers/roomController")

router.get('/enter-room', (req, res) => res.render('enter-room'))
router.post('/enter-room', enterRoom)
router.get('/create-room', getCreateRoom)
router.post('/create-room', createRoom)
router.get('/room', getRoom)

module.exports = router
