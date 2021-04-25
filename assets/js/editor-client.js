var sockete = io('http://localhost:5001');
// selecting the editor
const editor = document.getElementById("editor")
// adding event listener for keyup on the text area
editor.addEventListener("keyup", (evt) => {
    const text = editor.value
    sockete.send(text)
})

// sending data
sockete.on('message', (data) => {
    editor.value = data
})

var socket = io('http://localhost:5002');
socket.emit('join-room', ROOM_ID, 10);
const videoGrid = document.getElementById('video-grid');
// const myPeer = new Peer(undefined, {
//     host: '/',
//     port: '3003'
// });

const myVideo = document.createElement('video');
myVideo.muted = true;
// const peers = {};
// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
// }).then(stream => {
//     addVideoStream(myVideo, stream);


// var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// peer.on('call', function(call) {
//   getUserMedia({video: true, audio: true}, function(stream) {
//     call.answer(stream); // Answer the call with an A/V stream.
//     call.on('stream', function(remoteStream) {
//       // Show stream in some video/canvas element.
//     });
//   }, function(err) {
//     console.log('Failed to get local stream' ,err);
//   });
// });

// myPeer.on('call', (call) => {
//     call.answer(stream);
//     const video = document.createElement('video');
//     call.on('stream', (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//     });
// });

// socket.on('user-connected', (userId) => {
//     console.log("user connected to stream");
//     console.log("user connected  : ", userId);
//     console.log(" stream connect : ", stream);

//     // connectToNewUser(userId, stream);
// });
// });

// socket.on('user-disconnected', userId => {
//     console.log("user disconnected from stream");
//     console.log("user disconnect  : ", userId);
//     if (peers[userId]) peers[userId].close();
// });

// myPeer.on('open', id => {
//     console.log("roomId", ROOM_ID);
//     socket.emit('join-room', ROOM_ID, id);
// });

// function connectToNewUser(userId, stream) {
//     const call = myPeer.call(userId, stream);
//     const video = document.createElement('video');
//     call.on('stream', userVideoStream => {
//         console.log("adding stream  ");
//         addVideoStream(video, userVideoStream);
//     });
//     call.on('close', () => {
//         video.remove();
//     });

//     peers[userId] = call;
// }

// function addVideoStream(video, stream) {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play();
//     });
//     videoGrid.append(video);
// };