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
const config = require('./src/config/config')
const session = require('./src/config/session');
const routes = require('./src/routes');
class MeuEmitter extends EventEmitter {}
const meuEvento = new MeuEmitter();

app.set('view engine', 'ejs')
app.set('views', './src/views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(session);
app.use('/', routes);

connectDB()

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


const porta = 8080;

serverUDP.on('message', (msg, info) => {
	console.log(`Mensagem recebida do endereço ${info.address}:${info.port}: ${msg}`);

	if(sendProcessFrame) {
		console.log('EventoEmit = ', sendProcessFrame)
		meuEvento.emit('eventoCustomizado', msg);
	}
});

serverUDP.on('listening', () => {
	const address = serverUDP.address();
	console.log(`Servidor UDP escutando em ${address.address}:${address.port}`);
});

serverUDP.bind(porta);
