import brewser from 'brewser';
// require('browsernizr/test/webmidi');
// require('browsernizr');

var allowedBrowsers = {
	'chrome': 43,
	'opera': 32
}, 
version = brewser.br.browser

// console.log('browser/os', {
// 	'browser': { 'type': brewser.br.browser.type.toLowerCase(), 'version': brewser.br.browser.version},
// 	'os': brewser.br.device.os.toLowerCase().split(' ').join('-')
// });


// returns ["chrome", "49"] 
function browserVersion(){
	var name = navigator.appName, userAgent = navigator.userAgent, tem, matches;
	matches = userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(matches && (tem = userAgent.match(/version\/([\.\d]+)/i))!= null) matches[2] = tem[1];
	matches = matches ? [matches[1].toLowerCase(), parseFloat(matches[2], 10)]: [name.toLowerCase(), navigator.appVersion,'-?'];
	// console.log('browser', matches);
	return matches;
}

function allowedBrowser(data){
	return allowedBrowsers[data[0]] && data[1] >= allowedBrowsers[data[0]]
}

function https(){
  return window.location.protocol != 'https:'
}

function os(){
  return brewser.br.device.os.toLowerCase().split(' ').join('-');
}

function webmidi(){
  return 'requestMIDIAccess' in navigator
}

function allowed(){
  var data = browserVersion();
  return allowedBrowser(data);
}

export { https, version, os, webmidi, allowed } 


/*
var BrowserDetect = {
  init: function () {
      this.browser = this.searchString(this.dataBrowser) || "Other";
      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
  },
  searchString: function (data) {
      for (var i = 0; i < data.length; i++) {
          var dataString = data[i].string;
          this.versionSearchString = data[i].subString;

          if (dataString.indexOf(data[i].subString) !== -1) {
              return data[i].identity;
          }
      }
  },
  searchVersion: function (dataString) {
      var index = dataString.indexOf(this.versionSearchString);
      if (index === -1) {
          return;
      }

      var rv = dataString.indexOf("rv:");
      if (this.versionSearchString === "Trident" && rv !== -1) {
          return parseFloat(dataString.substring(rv + 3));
      } else {
          return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
      }
  },

  dataBrowser: [
      {string: navigator.userAgent, subString: "Edge", identity: "MS Edge"},
      {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
      {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
      {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
      {string: navigator.userAgent, subString: "Opera", identity: "Opera"},  
      {string: navigator.userAgent, subString: "OPR", identity: "Opera"},  

      {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"}, 
      {string: navigator.userAgent, subString: "Safari", identity: "Safari"}       
  ]
};

BrowserDetect.init();
document.write("You are using <b>" + BrowserDetect.browser + "</b> with version
*/