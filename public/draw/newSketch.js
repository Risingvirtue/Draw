var socket;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); 
var mouseDown =  false;
var mousePos = {};
var preMousePos = {x: -1, y:-1};
var r = 20;
var color = "blue";
var rect = canvas.getBoundingClientRect();
var noDraw = true;
var name;
var currIndex = 0;
var drawing = false;
var correct = false;
var joined = false;
$(document).ready(function() {
	fitToContainer(canvas);
	//fill to white
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	socket = io.connect('http://localhost:3000');
	//socket = io.connect('http://18.221.234.35');
	//listening to server
	socket.on('mouse', draw);
	socket.on('dot', dotDraw);
	socket.on('clear', receiveClear);
});

//draws dots when mousedown
function dotDraw(data) {
	if (noDraw) {
		return;
	}
	if (erase) {
		data.color = "white";
	}
	ctx.beginPath();
	var x = convert(data.x, canvas.width);
	var y = convert(data.y, canvas.height);
	ctx.arc(x, y, data.width / 2, 0, Math.PI * 2);
	ctx.fillStyle= data.color;
	ctx.fill();
	ctx.closePath();
}

//draws a line from one location to another
function draw(data) {
	ctx.beginPath();
	ctx.strokeStyle = data.color;
	var x1 = convert(data.x1, canvas.width); var y1 = convert(data.y1, canvas.height);
	var x2 = convert(data.x2, canvas.width); var y2 = convert(data.y2, canvas.height); 
	ctx.moveTo(x1, y1);
	ctx.lineCap = 'round';
	ctx.lineWidth = data.width;
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
}
//helper function for resizing
function convert(x, length) {
	return Math.floor(x * length);
}

function receiveClear() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	ctx.fillRect(0,0, canvas.width, canvas.height);
}

document.body.addEventListener("mousedown", function (e) {
	
	var rect = canvas.getBoundingClientRect();
	var x = Math.round((e.clientX-rect.left)/(rect.right-rect.left) * canvas.width);
    var y = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top) * canvas.height);
	var c = $("#canvas").offset();
	//console.log(e.pageX - c.left, x);
	mousePos.x = x;
	mousePos.y = y;
	if (mousePos.x < 0 || mousePos.x > canvas.width || mousePos.y < 0 || mousePos.y > canvas.height) {
		return;
	}
	mouseDown = true;
	//console.log(mousePos.x, mousePos.y);
	var width = (currPen + 1) * 5; 
	var data = {x: mousePos.x / canvas.width, y: mousePos.y / canvas.height, width: width, color: color, erase: erase};
	dotDraw(data);
		
});

document.body.addEventListener("mouseup", function (e) {
	mouseDown = false;
});

document.body.addEventListener("mousemove", function (e) {
	if (noDraw) {
		return;
	}
	var c = $("#canvas").offset();
	//console.log(e.pageX - offset.left);
	var rect = canvas.getBoundingClientRect();
	var eX = Math.round((e.clientX-rect.left) / (rect.right-rect.left) * canvas.width);
    var eY = Math.round((e.clientY-rect.top) / (rect.bottom-rect.top) * canvas.height);
	if (mouseDown && !erase) {
		var width = (currPen + 1) * 5; 
		var data = {x1: mousePos.x / canvas.width, y1: mousePos.y / canvas.height, 
					x2: eX/canvas.width, y2: eY/canvas.height, color: color, width: width, erase: false};
		draw(data);
		socket.emit('mouse', data);
		
		mousePos.x = eX; mousePos.y = eY;
	} else if (mouseDown && erase) {
		var width = (currEraser + 1) * 5; 
		var data = {x1: mousePos.x / canvas.width, y1: mousePos.y / canvas.height, 
					x2: eX/canvas.width, y2: eY/canvas.height, color: "white", width: width, erase: true};
		socket.emit('mouse', data);
		draw(data);
		mousePos.x = eX; mousePos.y = eY;
	}
});

document.body.addEventListener("keyup", function (e) {
	var keyCode = e.keyCode;
	if (keyCode == '13') {
		if (!joined) {
			join();
		} else {
			send();
		}
	}
});


