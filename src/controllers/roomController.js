const Room = require("../models/room");

exports.enterRoom = async (req, res) => {

    const room = Room.findOne({ roomCode: req.body.roomCode}).exec()

    room.then((room) => {
        if(!room)
            return res.redirect(`/enter-room?roomCodeStatus=false`)

        req.session.roomCode = req.body.roomCode;
        return res.redirect(`/room`)
    })
}

exports.getRoom = (req, res) => {
    let showActionButton = false

    if(!req.session.roomCode)
        return res.redirect('/')

    if(req.session.userId) {
        showActionButton = true
    }

    res.render('room', {showActionButton, roomCode: req.session.roomCode, userId: req.session.userId })
}

exports.getCreateRoom = (req, res) => {
    if(!req.session.userId) {
        return res.redirect('/login')
    }

    res.render('create-room', {userId: req.session.userId })
}

exports.createRoom = (req, res) => {

    if(!req.session.userId) {
        return res.redirect('/login')
    }

    const room = new Room({
        userId: req.session.userId,
        roomCode: req.body.createRoomCode
    })

    room.save().then(() => console.log('Sala criada'));

    req.session.roomCode = req.body.createRoomCode
    res.redirect(`/room`)
}