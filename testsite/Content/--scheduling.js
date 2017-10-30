var AZ_HEIGHT = 500;
var AZ_WIDTH = 750;
var AZ_PROPERTIES = ["lang", "service", "staff", "resource", "button", "css", "bgColor", "firstname", "lastname", "email", "phone"];

function openScheduling(companyId){

	scheduling.server = scheduling.server.replace("www.agendize", "app.agendize");

	var url;

	if (document.location.protocol == 'https:')
		url = 'https://' + scheduling.server + '/book/iframe/' + companyId + '?box=true';
	else
		url = 'http://' + scheduling.server + '/book/iframe/' + companyId + '?box=true';

	if (scheduling.gaTrackingId)
		url += '&gid=' + scheduling.gaTrackingId;

	for (var i = 0; i < AZ_PROPERTIES.length; i ++) {
		if (scheduling[AZ_PROPERTIES[i]] != null) {
			url += '&' + AZ_PROPERTIES[i].toLowerCase() + '=' + encodeURIComponent(scheduling[AZ_PROPERTIES[i]]);
		}
	}

	var windowWidth = window.screen.width < window.outerWidth ? window.screen.width : window.outerWidth;

	if (windowWidth < 500)
		window.location.href = url + '&r=' + encodeURIComponent(window.location.href);
	else
		scheduling_show(url);
}

function scheduling_show(url){

	var s = '.az-modal{ background-color: #313131; border: solid 1px #313131;	border-radius: 5px;	display: block;	position: absolute;	padding: 1px; z-index: 10000}';
	s += '.az-fading{ background-color: #000;	z-index: 1001;	position: absolute;	top: 0;	left: 0; opacity:0.7; filter:alpha(opacity=70); }';
	s += '.az-modal-iframe { border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; position: relative; -webkit-box-shadow: 0px 5px 50px 0px rgba(0,0,0,0.6); -moz-box-shadow: 0px 5px 50px 0px rgba(0,0,0,0.6); box-shadow: 0px 5px 50px 0px rgba(0,0,0,0.6);}';
	s += '.az-close { font-size: 16px, position: absolute; top: 20px; right: 20px; color: red} ';

	_addStyle(s);

	var elm = document.createElement('div');

	elm.style.width = AZ_WIDTH + 'px';
	elm.style.height = AZ_HEIGHT + 'px';
	elm.id = 'az-scheduling-modal';
	az_addClass(elm, 'az-modal');

	var dialog = document.createElement('div');
	dialog.style.height = AZ_HEIGHT + 'px';
	dialog.id = 'az-scheduling-modal';

	var iframe = document.createElement('iframe');

	iframe.style.width = '100%';
	iframe.style.height = '100%';
	iframe.name = 'iframe';
	iframe.frameBorder = 0;

	iframe.src = url;
	az_addClass(iframe, 'az-modal-iframe');

	elm.appendChild(iframe);
	//window.frames['iframe'].window.opener = window;
	//dialog.appendChild(elm);

	var b = document.createElement('div');
	az_addClass(b, 'az-fading');
	b.id = 'fading';

	_addClickListener(b, function(){

		this.parentNode.removeChild(this);
		var box = document.getElementById('az-scheduling-modal');

		box.parentNode.removeChild(box);
	});

	if (window.addEventListener) {
		window.addEventListener("keydown", function (e) {
			if (e.keyCode == '27') {
				var box = scheid('#az-scheduling-modal');
				var fading = scheid('#fading');

				box.parentNode.removeChild(box);
				fading.parentNode.removeChild(fading);
			}
		}, false);
	}

	var close =  document.createElement('div');
	az_addClass(close, 'az-close');
	close.id = 'az-close';
	close.innerHTML = 'close';

	//iframe.appendChild(close);

	b.style.width = getWindowWidth() + 'px';
	b.style.height = getWindowHeight() + 'px';

	document.getElementsByTagName("body")[0].appendChild(b);

	document.getElementsByTagName("body")[0].appendChild(elm);

	__centerThis(elm, AZ_WIDTH, AZ_HEIGHT);

	var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

	eventer(messageEvent, function(e) {

		if (e.data == 'close-scheduling') {
			var box = scheid('#az-scheduling-modal');
			var fading = scheid('#fading');

			box.parentNode.removeChild(box);
			fading.parentNode.removeChild(fading);
		}

	},false);
}

function az_addClass(element, className){

	element.className = element.className.replace(className,""); // first remove the class name if that already exists
	element.className = element.className + className; // adding new class name
}

function getWindowWidth(){
	return Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
}

function getWindowHeight(){
	return Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"]);
}

function __centerThis(element, width, height) {



	element.style.top = ((_viewport().height - height) / 2) + getScrollTop() + 'px';
	element.style.left = ((_viewport().width - width) / 2) + 'px';
}

function _addStyle(css){

	var ss1 = document.createElement('style');

	ss1.setAttribute("type", "text/css");
	var hh1 = document.getElementsByTagName('head')[0];
	hh1.appendChild(ss1);
	if (ss1.styleSheet) {
		ss1.styleSheet.cssText = css;
	} else {
		var tt1 = document.createTextNode(css);
		ss1.appendChild(tt1);
	}
}

function _addClickListener(element, func) {
	if (window.addEventListener) {
		element.addEventListener("click", func, false);
	} else if (element.attachEvent) {
		element.attachEvent("onclick", func);
	} else if (typeof element.onclick != "function") {
		element.onload = func;
	} else {
		var oldonload = element.onclick;
		element.onclick = function() {
			oldonclick();
			func();
		};
	}
}

// event.type must be keypress
function _getChar(event) {
	if (event.which == null) {
		return String.fromCharCode(event.keyCode) // IE
	} else if (event.which!=0 && event.charCode!=0) {
		return String.fromCharCode(event.which)   // the rest
	} else {
		return null // special key
	}
}

function _viewport() {
	var e = window, a = 'inner';
	if (!('innerWidth' in window )) {
		a = 'client';
		e = document.documentElement || document.body;
	}
	return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function getScrollTop(){
	return document.body.scrollTop || document.documentElement.scrollTop;
}

function scheid(ref){
	return document.getElementById(ref.substring(1));
}

function az_interface(id){
	/*
	if (typeof az_config != 'undefined'){

		if (az_config.title){az_id('az_btitle').innerHTML = az_config.title}
		if (az_config.ga_id){az_id('az_box'+id).setAttribute('gid', az_config.ga_id)}
		if (az_config.bgColor){az_id('az_box'+id).style.backgroundColor = az_config.bgColor}
		if (az_config.borderColor){az_id('az_box'+id).style.borderColor = az_config.borderColor}
		if (az_config.text && az_id('az_bmsg')){az_id('az_bmsg').innerHTML = az_config.text}
		if (az_config.hideClose && az_id('az_close')){az_id('az_close').style.display = 'none';}
		if (az_config.hideBottomImage && az_id('az_icon')){az_id('az_icon').style.display = 'none';}
		if (az_config.borderColor){az_id('az_box' + id).style.borderColor = az_config.borderColor;}
		if (az_config.borderRadius){az_id('az_box' + id).style.borderRadius = az_config.borderRadius;}
		if (az_config.borderWidth){az_id('az_box' + id).style.borderWidth = az_config.borderWidth;}
		if (az_config.privacyURL && document.getElementById('az_privacy')){az_id('az_privacy').href = az_config.privacyURL;}
		if (az_config.closeText){az_id('az_close').innerHTML = az_config.closeText;az_id('az_close').style.whiteSpace = 'nowrap';}
		if (az_config.bottomImageSrc && document.getElementById('az_icon')){az_id('az_icon').style.display = 'none';az_id('az_icon').src = az_config.bottomImageSrc;az_id('az_icon').style.display = 'block';}
		if (az_config.width){az_id('az_box'+id).style.width = az_config.width}
		if (az_config.height){az_id('az_box'+id).style.height = az_config.height}
	}

	az_fireEvent('agendize.open', id);
	*/
}

function az_fireEvent(type, id){
	if (typeof agendize_box != 'undefined') {
		agendize_box.event(type, id);
	}
}