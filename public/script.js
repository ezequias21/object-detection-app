const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const img = document.querySelector('.card-image__frame');
var timeout = 0;
var lastTimeSignalReceived = new Date();
var isReceivingFrame = false;

var setBtnActionStatus = (status) => {
  document.querySelector('#btn-action').checked = status
}

var setDefaultBackground = () => {
    img.src = '/background.png'
}

const inactivity = (timePassed, now) =>{
    var diff = Math.abs(now.getTime() - timePassed.getTime());
    var diffSeconds = Math.floor(diff / (1000));

    return diffSeconds > 1
}

const setStatusDisconnected = () => {
  document.querySelector('.signal-status').innerHTML = 
    `<div>Sinal da transmissão inativo</div><div class="round red"></div></a>`
}

const setStatusConnected = () => {
  document.querySelector('.signal-status').innerHTML =
    `<div>Sinal da transmissão ativo</div><div class="round light-green"></div></a>`
}

const checkStillHaveSignal = () => {
    if(inactivity(lastTimeSignalReceived, new Date())) {
        setStatusDisconnected()
        setDefaultBackground()
        setBtnActionStatus(false)
        isReceivingFrame = false
    } else {
        setStatusConnected()
        if(isReceivingFrame)
            setBtnActionStatus(true)
    }
}

if(code) {
    socket.emit('start', code)

    document.querySelector('#copy-room-code').addEventListener('click', function(){
        const roomCode = document.querySelector('#room-code').innerText
        navigator.clipboard.writeText(roomCode)

        M.toast({html: 'Código da sala!'})
    })
}

if(userId) {
    document.querySelector('#btn-action').addEventListener('change', function(event) {
        if(event.target.checked) {
            socket.emit('send-start')
            isReceivingFrame = true
        } else {
            socket.emit('send-stop')
            setDefaultBackground()
            isReceivingFrame = false
        }
    })

    socket.on('send-status', status => {
        setBtnActionStatus(status)
    })

    socket.on('receiving-signal', () => {
        console.log('signal1')
        lastTimeSignalReceived = new Date();
    })

    setInterval(checkStillHaveSignal, 2000);
}

socket.on('new-frame', data => {
    const imagemBase64 = btoa(String.fromCharCode(...new Uint8Array(data)));
    img.src = 'data:image/jpg;base64,' + imagemBase64;
    isReceivingFrame = true

    console.log('New-frame')
})
