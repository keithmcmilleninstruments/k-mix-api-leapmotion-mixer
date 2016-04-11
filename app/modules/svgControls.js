import { convertRange } from './utilities'
import { buildSounds, playAll, stopAll } from './audio'

function controlFader(id, value){
	let control = id.split('-'), channel = control[1]
	if(id.includes('master')) {
		channel = 9 - 1
		window.kmix.master.gain.value = convertRange(value, [0, -90], [0, 1])
	} else {
		if(window.kmix.tracks[channel-1]) window.kmix.tracks[channel-1].volume.gain.value = convertRange(value, [0, -90], [0, 1])
	}
}

function controlRotary(id, value){
	let control = id.split('-'), channel = control[1], pan = convertRange(value, [-126, 126], [-1, 1])

	if(window.kmix.tracks[channel-1]) window.kmix.tracks[channel-1].panner.setPosition(pan, 0, 1 - Math.abs(pan))
}

function controlSVGFader(el, value, svg){
	// console.log('el', el, convertRange(value, [0, 127], [0, -90]));
	let control = svg.querySelector(el), 
			normValue = convertRange(value, [0, 127], [0, -90])
	
	control.setAttribute('transform', 'translate(0, ' + normValue + ')')
}

function controlSVGRotary(el, value, svg){
	// console.log('r el', el);
	let control = svg.querySelector(el),
			normValue = convertRange(value, [0, 127], [-127, 127])

  control.setAttribute('transform','rotate('+ normValue +' '+ control.previousElementSibling.cx.animVal.value +' '+ control.previousElementSibling.cy.animVal.value +')');
}

function controlSVGButton(el, value, svg){
	console.log('svg button', el, value);
	let control = svg.querySelector('.' + el.replace('button', 'btn')), kind = ''

  control.classList.toggle('active')

  switch(el){
  	case 'diamond-up':
  		console.log('record');
  		break;
  	case 'diamond-right':
  		playAll()
  		console.log('play');
  		break;
  	case 'diamond-down':
  		stopAll()
  		buildSounds()
  		console.log('stop');
  		break;
  	case 'diamond-left':
  		stopAll()
  		buildSounds()
  		playAll()
  		console.log('rewind');
  		break;
  }
}

function faderDrag (event) {
  var target = event.target,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

	if(y <= 0 && y >= -90) {
  	// translate the element
    target.setAttribute('transform', 'translate(0, ' + y + ')')
  	// update the posiion attributes
  	target.setAttribute('data-y', y);
	}
}

function rotaryDrag(event){
  var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx

	if(x > -127 && x < 127){
		target.setAttribute('transform','rotate('+ x +' '+ event.target.previousElementSibling.cx.animVal.value +' '+ event.target.previousElementSibling.cy.animVal.value +')');
		target.setAttribute('data-x', x);
	}
}

function buttonClick(event){
	console.log('button click', event);
	let button = event.target.parentNode, type = button.classList[1], diamondType = button.classList[1],
	buttons = ['diamond-up', 'diamond-right', 'diamond-down', 'diamond-left']

	buttons.forEach(function(b){
		var btn = document.querySelector('.' + b)
		btn.classList.remove('active')
	})

	if(type.includes('btn') || type.includes('channel') || type.includes('preset')){

		button.classList.toggle('active')
	} else {
		switch(diamondType){
			case 'diamond-up':
				button.classList.toggle('active')
				console.log('record');
				break;
			case 'diamond-right':
				button.classList.toggle('active')
				playAll()
				console.log('play');
				break;
			case 'diamond-down':
				button.classList.toggle('active')
				stopAll()
				buildSounds()
				console.log('stop');
				break;
			case 'diamond-left':
				button.classList.toggle('active')
				stopAll()
				buildSounds()
				playAll()
				console.log('rewind');
				break;
		}
	}
}

function resetfadersSVG(svg){
	let faders = ['fader-1', 'fader-2', 'fader-3', 'fader-4', 'fader-5', 'fader-6', 'fader-7', 'fader-8', 'fader-master'], el

	faders.forEach(function(fader){
		el = '#' + fader + ' .fader-handle'
		controlSVGFader(el, 0, svg)
	})
}

function resetrotariesSVG(svg){
	let rotaries = ['rotary-1', 'rotary-2', 'rotary-3', 'rotary-4'], el

	rotaries.forEach(function(fader){
		el = '#' + fader + ' .rotary-handle'
		controlSVGRotary(el, 64, svg)
	})
}
export { controlSVGRotary, controlSVGFader, controlSVGButton, controlFader, controlRotary, faderDrag, rotaryDrag, buttonClick, resetfadersSVG, resetrotariesSVG }