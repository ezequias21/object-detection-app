const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const app = express()
const EventEmitter = require('events');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const User = require('./models/user');
const { login, logout } = require("./auth/auth")
const { enterRoom, getRoom } = require("./room/room")
const oneDay = 1000 * 60 * 60 * 24;

const connectDB = require('./db/db');

//server UDP
const dgram = require('dgram');

// Cria um socket UDP para o servidor
const serverUDP = dgram.createSocket('udp4');

class MeuEmitter extends EventEmitter {}
// // Criar uma instância do emitter personalizado
const meuEvento = new MeuEmitter();


const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
connectDB()

app.use(session({
    secret: 'fiwafhiwfwhvuwvu9hvvvwv',
	saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

//Routes
app.get('/', (req, res) => res.render('home'))
app.get('/login', (req, res) => res.render('login'))
app.get('/logout', logout)
app.post('/login', login)

app.get('/enter-room', (req, res) => {
	console.log(req.session.userId)
	res.render('enter-room')
})

app.post('/enter-room', enterRoom)


app.get('/create-room', (req, res) => {
	console.log(req.body.password)
	res.render('create-room')
})


app.get('/room/:room', getRoom)

var sendProcessFrame = true;
io.on('connection', socket => {

	socket.on('start-app', (roomId, userId) => {
		socket.join(roomId)
		console.log('start-app')

		// Registrar um ouvinte para o evento customizado
		meuEvento.on('eventoCustomizado', (data) => {
			console.log(`Evento customizado emitido: ${data}`);
			socket.to(roomId).broadcast.emit('new-process-data', data);
		});
	})

	socket.on('enable', (roomId) => {
		socket.join(roomId)
		sendProcessFrame = true;
		console.log('Evento habilitado');
	  });

	  socket.on('disable', (roomId) => {
		socket.join(roomId)
		sendProcessFrame = false;
		console.log('Evento desabilitado');
	  });

})

server.listen(3000)


// Porta para escutar
const porta = 8080;

// Quando uma mensagem é recebida
serverUDP.on('message', (msg, info) => {
	console.log(`Mensagem recebida do endereço ${info.address}:${info.port}: ${msg}`);

	// Emitir o evento customizado com uma mensagem
	if(sendProcessFrame) {
		console.log('EventoEmit = ', sendProcessFrame)
		meuEvento.emit('eventoCustomizado', msg);
	}
});

// Quando o servidor está escutando
serverUDP.on('listening', () => {
	const address = serverUDP.address();
	console.log(`Servidor UDP escutando em ${address.address}:${address.port}`);
});

// Liga o servidor à porta especificada
serverUDP.bind(porta);
