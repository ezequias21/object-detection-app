const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const img = document.querySelector('.card-image__frame');
var timeout = 0;

if(code) {
  socket.emit('start', code)

  socket.on('new-frame', data => {
    const imagemBase64 = btoa(String.fromCharCode(...new Uint8Array(data)));
    img.src = 'data:image/jpg;base64,' + imagemBase64;

    console.log('New-frame')
  })

  socket.on('signal', () => {

    document.querySelector('.signal-status').innerHTML = `
      <div>Sinal da transmissão ativo</div><div class="round light-green"></div></a>
    `
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      document.querySelector('.signal-status').innerHTML = `
        <div>Sinal da transmissão inativo</div><div class="round red"></div></a>
      `
      img.src = '/background.png'
    }, 200)
  })
}


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
