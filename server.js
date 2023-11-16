require('dotenv/config');

const express = require('express')
const connectDB = require('./db/db');

const dgram = require('dgram');
const serverUDP = dgram.createSocket('udp4');
const bodyParser = require('body-parser')
const app = express()
const EventEmitter = require('events');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const session = require('./src/config/session');
const routes = require('./src/routes');
class MeuEmitter extends EventEmitter {}
const meuEvento = new MeuEmitter();
const Room = {
	code: '123456'
}

app.set('view engine', 'ejs')
app.set('views', './src/views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(session);
app.use('/', routes);

connectDB()


const listenerFrame = function(roomId){
	console.log('Frame listener...')
	const sockets = this

	meuEvento.on('eventoCustomizado', (data) => {
		console.log(`Evento customizado emitido: ${data}`, roomId);

		if(roomId == Room.code) {
			sockets.join(roomId)
			sockets.to(roomId).broadcast.emit('new-frame', data);
			sockets.to(roomId).broadcast.emit('signal', 'signal');
		}
	});
}

io.on('connection', socket => {
	socket.on('start', listenerFrame);
})

server.listen(3000)

const porta = 8080;

serverUDP.on('message', (msg, info) => {
	console.log(`Mensagem recebida do endereço ${info.address}:${info.port}: ${msg}`);
	meuEvento.emit('eventoCustomizado', msg);

});

serverUDP.on('listening', () => {
	const address = serverUDP.address();
	console.log(`Servidor UDP escutando em ${address.address}:${address.port}`);
});

serverUDP.bind(porta);


