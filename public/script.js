const socket = io('/')
const videoGrid = document.getElementById('video-grid')


document.querySelector('#enable').addEventListener('click', function() {
  socket.emit('enable', ROOM_ID)
});

document.querySelector('#disable').addEventListener('click', function() {
  socket.emit('disable', ROOM_ID)
});


const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}


// navigator.mediaDevices.getUserMedia({
//   video: true,
//   audio: true
// }).then(stream => {
//   addVideoStream(myVideo, stream)

//   console.log('som')
//   myPeer.on('call', call => {
//     call.answer(stream)
//     const video = document.createElement('video')
//     call.on('stream', userVideoStream => {
//       console.log(userVideoStream)
//       addVideoStream(video, userVideoStream)
//     })
//   })

//   socket.on('user-connected', userId => {
//     console.log('user-connected')
//     connectToNewUser(userId, stream)
//   })
// })

socket.on('user-disconnected', userId => {
  console.log('user-disconnected')
  if (peers[userId]) peers[userId].close()
})

// myPeer.on('open', id => {
//   console.log('join-room')
//   socket.emit('join-room', ROOM_ID, id)
//   socket.emit('start-app', ROOM_ID, id)
// })

socket.emit('join-room', ROOM_ID)
socket.emit('start-app', ROOM_ID)


socket.on('new-process-data', data => {
  console.log('new-process-data', data)
  // connectToNewUser(userId, stream)
})

// function connectToNewUser(userId, stream) {
//   const call = myPeer.call(userId, stream)
//   console.log('userId=', userId)
//   const video = document.createElement('video')
//   call.on('stream', userVideoStream => {
//     addVideoStream(video, userVideoStream)
//   })
//   call.on('close', () => {
//     video.remove()
//   })

//   peers[userId] = call
// }

// function addVideoStream(video, stream) {
//   video.srcObject = stream
//   video.addEventListener('loadedmetadata', () => {
//     video.play()
//   })
//   videoGrid.append(video)
// }