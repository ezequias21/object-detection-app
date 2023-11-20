const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    roomCode: { type: String, required: true },
    expiredAt: {type: Date, required: true}
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
