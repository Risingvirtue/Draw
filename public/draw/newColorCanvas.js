var colorCanvas = document.getElementById('colorCanvas');
var colorCtx = colorCanvas.getContext('2d');
var pixelArr = [];
var prevColor = {x: -1, y: -1};
var currColorPos = {};
var colorMd = false;
$(document).ready(function() {
	fitToContainerColor(colorCanvas);
	currColorPos = {x: colorCanvas.width - 10, y: 10};
	$(window).resize(function() {
		
	});
});

function fitToContainerColor(canvas){
	// Make it visually fill the positioned parent
	canvas.style.width ='100%';
	canvas.style.height='100%';
	// ...then set the internal size to match
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	canvas.height = Math.floor($(window).height() / 4);
    drawCanvas(rgbColor);
}

function drawCanvas(color) {
	pixelArr = [];
	colorCtx.clearRect(0,0,colorCanvas.width, colorCanvas.height);
	var white = {r:255, g: 255, b: 255};
	var interval = 255 / colorCanvas.height;
	var diffStep = step(color, {r: 0, g: 0, b: 0}, colorCanvas.height);
	//console.log(diffStep);
	var currColor = {};
	for (var i = 0; i< colorCanvas.height; i++) {
		var x = Math.floor(255 - i*interval);
		var startColor = {r: x, g: x, b:x};	
		currColor.r = Math.floor(color.r - diffStep.r * i);
		currColor.g = Math.floor(color.g - diffStep.g * i);
		currColor.b = Math.floor(color.b - diffStep.b * i);
		drawRow(i, startColor, currColor);
	}
	currColorPos.x = Math.floor(colorCanvas.width - 10);
	currColorPos.y = 10;
	drawCircle(currColorPos.x, currColorPos.y);
}

function drawRow(height, startColor, endColor) {
	var diffStep = step(startColor, endColor, colorCanvas.width);
	var pixelRow = [];
	for (var i = 0; i < colorCanvas.width; i++) {
		var r = Math.floor(startColor.r - diffStep.r * i);
		var g = Math.floor(startColor.g - diffStep.g * i);
		var b = Math.floor(startColor.b - diffStep.b * i);
		var c = {r: r, g: g, b: b};
		pixel(convertColor(c), i, height);
		pixelRow.push(c);
	}
	
	pixelArr.push(pixelRow);
}
function step(startColor, endColor, interval) {
	
	var r = (startColor.r - endColor.r) / interval;
	var g = (startColor.g - endColor.g) / interval;
	var b = (startColor.b - endColor.b) / interval;
	return {r: r, g: g, b: b};
}

function drawFromPixel(x,y) {
	var x1 = Math.max(0, x - 15); var y1 = Math.max(0, y - 15);
	var x2 = Math.min(colorCanvas.width, x + 15); var y2 = Math.min(colorCanvas.height, y + 15);
	colorCtx.clearRect(x1,y1, x2 - x1 - 1, y2-y1 - 1);
	x1 = Math.floor(x1); x2 = Math.floor(x2); y1 = Math.floor(y1); y2 = Math.floor(y2);
	//console.log(x2, y2, pixelArr[0].length, pixelArr);
	for (var i = y1; i < y2; i++) {
		for (var j = x1; j < x2; j++) {
			var c = pixelArr[i][j];
			pixel(convertColor(c), j, i);
		}
	}
}

function pixel(color, x, y) {
	//console.log(color);
	colorCtx.beginPath();
	colorCtx.fillStyle = color;
	colorCtx.fillRect(x,y, 1, 1);
	colorCtx.closePath();
	
}

function convertColor (dict) {
	return "rgb(" + dict.r + ", " + dict.g + ", " + dict.b + ")";
}

function drawCircle(x, y) {
	colorCtx.beginPath();
	colorCtx.lineWidth = 5;
	colorCtx.strokeStyle = "white";
	colorCtx.arc(x, y, 10, 0, 2 * Math.PI);
	colorCtx.stroke();
	colorCtx.closePath();
}

document.body.addEventListener("mousedown", function (e) {
	if (noDraw) {
		return;
	}
	var rect = colorCanvas.getBoundingClientRect();
	var x = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*colorCanvas.width);
    var y = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*colorCanvas.height);
	if (x < 0 || x > colorCanvas.width || y < 0 || y > colorCanvas.height) {
		return;
	}
	colorMd = true;
	prevColor.x = currColorPos.x;
	prevColor.y = currColorPos.y;
	currColorPos.x = x;
	currColorPos.y = y;
	drawFromPixel(prevColor.x, prevColor.y);
	//console.log(x, colorCanvas.width);
	drawCircle(x,y);
	rgbColor = pixelArr[y][x];
	color = convertColor(rgbColor);
		
});
document.body.addEventListener("mouseup", function (e) {
	colorMd = false;
});
document.body.addEventListener("mousemove", function (e) {
	if (noDraw) {
		return;
	}
	
	if (colorMd) {
		//colorCtx.clearRect(0,0, colorCanvas.width, colorCanvas.height);
		
		var rect = colorCanvas.getBoundingClientRect();
		var x = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*colorCanvas.width);
        var y = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*colorCanvas.height);
		
		if (x < 0 || x > colorCanvas.width || y < 0 || y > colorCanvas.height) {
			return;
		}
		prevColor.x = currColorPos.x;
		prevColor.y = currColorPos.y;
		currColorPos.x = x;
		currColorPos.y = y;
		drawFromPixel(prevColor.x, prevColor.y);
		drawCircle(x,y);
		rgbColor = pixelArr[y][x];
		color = convertColor(rgbColor);
	}
});