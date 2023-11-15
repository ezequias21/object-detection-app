exports.enterRoom = async (req, res) => {
    req.session.roomCode = req.body.roomCode;
    res.redirect(`/room`)
}

exports.getRoom = (req, res) => {
    let showActionButton = false

    if(!req.session.roomCode)
        res.redirect('/enter-room')

    if(req.session.userId) {
        showActionButton = true
    }

    res.render('room', {showActionButton})
}

exports.createRoom = (req, res) => {
    if(req.session.userId) {
        res.redirect('/login')
    }

    req.session.roomCode = req.body.createRomCode
    res.redirect(`/room/${req.body.roomCode}`)
}