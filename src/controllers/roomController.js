exports.enterRoom = async (req, res) => {
    req.session.roomCode = req.body.roomCode;
    res.redirect(`/room`)
}

exports.getRoom = (req, res) => {
    let showActionButton = false

    if(!req.session.roomCode)
        return res.redirect('/')

    if(req.session.userId) {
        showActionButton = true
    }

    res.render('room', {showActionButton, roomCode: req.session.roomCode})
}

exports.getCreateRoom = (req, res) => {
    if(!req.session.userId) {
        return res.redirect('/login')
    }

    res.render('create-room')
}

exports.createRoom = (req, res) => {
    if(!req.session.userId) {
        return res.redirect('/login')
    }
    req.session.roomCode = req.body.createRoomCode
    res.redirect(`/room`)
}