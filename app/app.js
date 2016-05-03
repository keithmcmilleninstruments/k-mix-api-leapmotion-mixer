 // vendor
import interact from "interact.js";
import 'leapjs';
import 'leapjs-plugins';
// styles
import './styles/screen.scss'

// svg
import './svg/kmix.svg'

// modules
import KMIX from 'k-mix-api'
import { allowed, webmidi } from './modules/browser'
import { convertRange } from './modules/utilities'
import request from './modules/midiRequest'
import { controlSVGRotary, controlSVGFader } from './modules/svgControls'
	
// global kmix
let kmix;

let helpControl = document.querySelector('.help.control'),
		helpInput = document.querySelector('.help.input'),
		helpMain = document.querySelector('.help.main'),
		helpMisc = document.querySelector('.help.misc'),
		svg = document.querySelector('svg'),
		activeButtons = []

// Leap
let fingers = ['thumb', 'indexFinger', 'middleFinger', 'ringFinger', 'pinky']

// MIDI & check browser
if(allowed() && webmidi){
	// request midi / sysex permission
	let MIDIRequest = request();

	MIDIRequest.then(function(data){
		let MIDIAccess = data;
		
		kmix = KMIX(MIDIAccess)

		// add listeners here

	})
	.catch(function(err){
		throw new Error(err);
	});

} else {
	console.log('Web MIDI Not Supported');
}

// LeapMotion
let horizontalPosition, percentageX, verticalPosition, percentageY, zPosition, percentageZ, 
		extendedFingers = [], addFingers = 0, controlNumberFader = 1, controlNumberRotary = 1

Leap.loop({
 
  hand: function(hand){
    // console.log( hand );
    
    addFingers = (hand.type === 'left') ? 0 : 4;

    if(hand.grabStrength < 1){

	    fingers.forEach( f => {
	    	if(f === 'thumb') return;
	    	
	    	controlNumberFader = (extendedFingers.length + addFingers) ? (extendedFingers.length + addFingers) : 1;
	    	controlNumberRotary = (extendedFingers.length) ? (extendedFingers.length) : 1;

	    	if(hand[f].extended){
	    		// add fingers
	    		if(!extendedFingers.includes(f)) extendedFingers.push(f)

	  			horizontalPosition = hand[f].stabilizedTipPosition[0];
	  			percentageX = getPercent(horizontalPosition);

	    		verticalPosition = hand[f].stabilizedTipPosition[1];
	    		percentageY = getPercent(verticalPosition);

	    	} else {
	    		// remove fingers
	    		if(extendedFingers.indexOf(f) !== -1) extendedFingers.splice(extendedFingers.indexOf(f), 1)
	    	}
	    
	    })
    	// console.log('# extended', extendedFingers);
    	// console.log('controlNumberFader', controlNumberFader);

    	kmix.send('fader:' + controlNumberFader, percentageY * 127)
    			.send('pan-main:' + controlNumberFader, convertRange(horizontalPosition, [-350,350], [0,127]))    
  		
  		controlSVGFader('fader-' + controlNumberFader, percentageY * 127, svg)
  		controlSVGRotary('rotary-' + controlNumberRotary, convertRange(horizontalPosition, [-350,350], [0,127]), svg)

  		console.log('fader-' + controlNumberFader, percentageY * 127);
  		console.log('rotary-' + controlNumberRotary, convertRange(horizontalPosition, [-350,350], [0,127]))
  	} else {
  		verticalPosition = hand.stabilizedPalmPosition[1];
  		percentageY = getPercent(verticalPosition);
  		kmix.send('main:fader', percentageY * 127)
  		controlSVGFader('fader-master', percentageY * 127, svg)

  		console.log('master fader', percentageY * 127);
  	}
  }
 
}).use('screenPosition');

function getPercent(position){
	return Math.max(Math.min(((position - 50) / 350), 1), 0)
}

// send help message
helpControl.addEventListener('click', function(){
	kmix.help('control')
})
helpInput.addEventListener('click', function(){
	kmix.help('input')
})
helpMain.addEventListener('click', function(){
	kmix.help('main')
})
helpMisc.addEventListener('click', function(){
	kmix.help('misc')
})

// Listen
// kmix.on('fader-1', callback)
// kmix.on('button-vu', callback)
// kmix.on('button-vu:off', callback)
// kmix.on('any', callback)

// Send
// send to audio-control:
// send('preset', 2)
// send('fader:1', 127)
// send('fader:1', 127, 'input', time) // with time
// send('reverb-bypass', 11, 'misc') // auto channel
// send('mute', 11, 'main_out') // auto channel

// send to control-surface
// send('control:fader-3', 0, 'cc', time, bank) // value, time, bank

// send raw
// send([176, 1, 127], time, 'control')
// enable audio-control sysex output [0xF0, 0x00, 0x01, 0x5F, 0x23, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF7]

// Help
// help('control') // 'control', 'input', 'main', 'misc'