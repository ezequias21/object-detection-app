require('dotenv/config');

const express = require('express')
const connectDB = require('./db/db');

const dgram = require('dgram');
const serverUDP = dgram.createSocket('udp4');
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const session = require('./src/config/session');
const routes = require('./src/routes');
const sharedSession = require('express-socket.io-session');

app.set('view engine', 'ejs')
app.set('views', './src/views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(session);
app.use('/', routes);

io.use(sharedSession(session, {
	autoSave:true
}));

connectDB()

var adminUsers = [];

const removeAdminUser = (adminUsers, userId) => {
    const index = adminUsers.findIndex(adminUser => adminUser.userId === userId);

    if (index !== -1)
        adminUsers.splice(index, 1);

    return adminUsers;
}

const checkExistsInAdminUsers = (adminUsers, userId) => {
    const index = adminUsers.findIndex(adminUser => adminUser.userId === userId);

    if (index !== -1)
        return true;

    return false;
}

io.on('connection', socket => {
	socket.on('start', (roomCode) => {
		socket.join(roomCode)

		if(socket.handshake.session.userId)
			if(!checkExistsInAdminUsers(adminUsers, socket.handshake.session.userId))
				socket.emit('send-status', false)
			else
				socket.emit('send-status', true)
	});

	socket.on('send-start', () => {
		if(socket.handshake.session.userId) {
			if(!checkExistsInAdminUsers(adminUsers, socket.handshake.session.userId))
				adminUsers.push({
					userId: socket.handshake.session.userId,
					roomCode: socket.handshake.session.roomCode
				})
		}
	});

	socket.on('send-stop', () => {
		if(socket.handshake.session.userId) {
			adminUsers = removeAdminUser(adminUsers, socket.handshake.session.userId)
		}
	});
})

server.listen(3000)

const porta = 2814;

serverUDP.on('message', (msg, info) => {
	console.log(`Mensagem recebida do endereço ${info.address}`);

	adminUsers.forEach((adminUser) => {
		console.log('Emite o admin')
		io.to(adminUser.roomCode).volatile.emit('new-frame', msg)
			console.log('Emitiu o admin')
	})

	io.emit('receiving-signal', 2)

});

serverUDP.on('listening', () => {
	const address = serverUDP.address();
	console.log(`Servidor UDP escutando em ${address.address}:${address.port}`);
});

serverUDP.bind(porta);


