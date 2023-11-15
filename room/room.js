exports.enterRoom = async (req, res) => {
    req.session.roomCode = req.body.roomCode;
    res.redirect(`/room/${req.body.roomCode}`)
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