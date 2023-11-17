const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const img = document.querySelector('.card-image__frame');
var timeout = 0;
var lastTimeFrameUpdated = new Date();

const inactivity = (timePassed, now) =>{
    var diff = Math.abs(now.getTime() - timePassed.getTime());
    var diffSeconds = Math.floor(diff / (1000));

    return diffSeconds > 1
}

const signalStatus = () => {
    if(inactivity(lastTimeFrameUpdated, new Date())) {
        document.querySelector('.signal-status').innerHTML =
        `<div>Sinal da transmissão inativo</div><div class="round red"></div></a>`
        img.src = '/background.png'
    }else {
        document.querySelector('.signal-status').innerHTML =
        `<div>Sinal da transmissão ativo</div><div class="round light-green"></div></a>`
    }
}

if(code) {
    socket.emit('start', code)

    socket.on('new-frame', data => {
        const imagemBase64 = btoa(String.fromCharCode(...new Uint8Array(data)));
        img.src = 'data:image/jpg;base64,' + imagemBase64;

        lastTimeFrameUpdated = new Date();

        console.log('New-frame')
  })
}


setInterval(signalStatus, 2000);

document.querySelector('#copy-room-code').addEventListener('click', function(){
	const roomCode = document.querySelector('#room-code').innerText
	navigator.clipboard.writeText(roomCode)

	M.toast({html: 'Código da sala!'})
})

document.querySelector('#enable').addEventListener('click', function() {
  socket.emit('enable', ROOM_ID)
});

document.querySelector('#disable').addEventListener('click', function() {
  socket.emit('disable', ROOM_ID)
});
