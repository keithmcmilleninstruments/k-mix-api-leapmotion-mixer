import { default as AudioDrop } from "./AudioDrop"

let ac, master;

ac = new AudioContext, master = ac.createGain();

master.gain.value = 0

master.connect(ac.destination);

let drop = document.querySelector('#drop'),
		trackList = document.querySelector('#track_list');

if(location.hostname !== 'localhost'){
	loadDefaultSounds()
	window.setTimeout(buildSounds, 5000)	
}

window.kmix = {
	buffers: [],
	tracks: [],
	master: master
}

AudioDrop({
  context: ac,
  elements: drop,

  drop: function drop(buffer, file, fileCount) {
  	console.log('Added the buffer ' + file.name + ' to tracks.', 'fileCount', fileCount);
    
    if (window.kmix.buffers.length > 8) return;

    buildBuffers(buffer)

    trackList.insertAdjacentHTML('beforeend', '<p>Channel ' + window.kmix.buffers.length + ': ' + file.name + '<p>');

    this.elements[0].previousSibling.previousSibling.classList.remove('dragging')

    if(window.kmix.buffers.length === fileCount) {
    	buildSounds()
    }

  },
  dragEnter: function dragEnter(e){
  	this.elements[0].previousSibling.previousSibling.classList.add('dragging')

  	window.kmix.buffers = [];

  	initTracks()

  	console.log('dragEnter');
  }
})

function initTracks(){
	window.kmix.tracks = [];
}

function buildBuffers(buffer){
	window.kmix.buffers.push(buffer)
}

function buildSounds(){
	window.kmix.buffers.forEach(function(buffer){
		let source = ac.createBufferSource(),
				gain = ac.createGain(),
				panner = ac.createPanner();

		panner.setPosition(0, 0, 0)

		source.buffer = buffer
		source.loop = true

		gain.gain.value = 0

		source.connect(gain)
		gain.connect(panner)
		panner.connect(master)

		window.kmix.tracks.push({
			source: source,
			volume: gain,
			panner: panner
		})
	})
	console.log('tracks', window.kmix.tracks);
}

function playAll(){
	window.kmix.tracks.forEach(function(track){
		track.source.start();
		console.log('start all tracks');
	})
}

function stopAll(){
	window.kmix.tracks.forEach(function(track){
		track.source.stop();
		console.log('stop all tracks');
	})

	initTracks()
}

function loadDefaultSounds(){
	let defaultTracks = ['./music/k-mix-track-1.mp3', './music/k-mix-track-2.mp3', './music/k-mix-track-3.mp3', './music/k-mix-track-4.mp3', './music/k-mix-track-5.mp3', './music/k-mix-track-6.mp3', './music/k-mix-track-7.mp3', './music/k-mix-track-8.mp3']

	defaultTracks.forEach(function(url){
		decodeBuffer(url)
	})
}

function decodeBuffer(url) {
  var request = new XMLHttpRequest();
  request.open( "GET", url, true );
  request.responseType = "arraybuffer";
  request.onload = function (){
    ac.decodeAudioData(request.response, function (buffer) {
      window.kmix.buffers.push(buffer);
    });
  };
  request.send();
};

export { ac as default, buildSounds, playAll, stopAll }