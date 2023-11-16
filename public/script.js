const socket = io('/')
const videoGrid = document.getElementById('video-grid')

if(code) {
  socket.emit('start', code)
  
  socket.on('new-frame', userId => {
    console.log('New-frame')
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
