
const mediaStreamConstraints = {
  video: true,
  audio: true,
};

const offerOptions = {
  offerToReceiveVideo: 1,
  offerToReceiveAudio: 1,
};


const localVideo = document.getElementById('first');
const remoteVideo = document.getElementById("second");

let localStream,remoteStream,localPeerConnection,remotePeerConnection;

function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream;
  localStream = mediaStream;
  callButton.disabled = false; 
}

function gotRemoteMediaStream(event) {
  const mediaStream = event.stream;
  remoteVideo.srcObject = mediaStream;
  remoteStream = mediaStream;
}

function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
    console.log("First ICE Candidate Added");
      }).catch((error) => {
        console.log(error);
      });
  }
}

function handleConnectionChange(event) {
  const peerConnection = event.target;
  console.log('ICE state change event: ', event);
}

function createdOffer(description) {

  localPeerConnection.setLocalDescription(description)
    .then(() => {
    console.log("Local Peer : ")
      console.log("Local Description set");
    }).catch((error)=>{console.log(error)});

    remotePeerConnection.setRemoteDescription(description)
    .then(() => {
      console.log("Remote Description set");
    }).catch((error)=>{console.log(error)});

  remotePeerConnection.createAnswer()
    .then(createdAnswer)
    .catch((error)=>console.log(error));
}

function createdAnswer(description) {
  remotePeerConnection.setLocalDescription(description)
    .then(() => {
    console.log("Remote Peer: ")
      console.log("Local Description set");
    }).catch((error)=>{console.log(error)});

  localPeerConnection.setRemoteDescription(description)
    .then(() => {
        console.log("Remote Description set");
    }).catch((error)=>{console.log(error)});
}

const callButton = document.getElementById('callbutton');
// const leave = document.getElementById("leavebutton");
// leave.disabled = true;
callButton.disabled = true;

 navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream).catch((error)=>console.log(error));

function callAction() {
  callButton.disabled = true;
//   leave.disabled = false;
  const servers = null; 

  localPeerConnection = new RTCPeerConnection(servers);
  localPeerConnection.addEventListener('icecandidate', handleConnection);
  localPeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);

  remotePeerConnection = new RTCPeerConnection(servers);

  remotePeerConnection.addEventListener('icecandidate', handleConnection);
  remotePeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);
  remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

  localPeerConnection.addStream(localStream);

  localPeerConnection.createOffer(offerOptions)
    .then(createdOffer).catch((error)=>console.log(error));
}

function leaveAction() {
//   localPeerConnection.close();
//   remotePeerConnection.close();
//   localPeerConnection = null;
//   remotePeerConnection = null;
  const second = document.getElementById("second");
  second.remove();
//   leave.disabled = true;
  callButton.disabled = false;
}

callButton.addEventListener('click', callAction);
// leave.addEventListener('click', leaveAction);

function getOtherPeer(peerConnection) {
  if(peerConnection === localPeerConnection)
     return remotePeerConnection;
     else
     return localPeerConnection;
}
