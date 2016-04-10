function request(useSysex){
	return navigator.requestMIDIAccess({sysex: useSysex});
}

export { request as default }