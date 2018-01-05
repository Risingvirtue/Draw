var touchDown = false;
document.body.addEventListener("touchStart", function (e) {
	var c = $("#canvas").offset();
	touchDown = true;
	mousePos.x = e.pageX - c.left;
	mousePos.y = e.pageY - c.top;
	if (mousePos.x < 0 || mousePos.x > canvas.width || mousePos.y < 0 || mousePos.y > canvas.height) {
		return;
	}
	//console.log(mousePos.x, mousePos.y);
	var width = (currPen + 1) * 5; 
	var data = {x: mousePos.x / canvas.width, y: mousePos.y / canvas.height, width: width, color: color};
	dotDraw(data);
		
});

document.body.addEventListener("touchend", function (e) {
	mouseDown = false;
	
});

document.body.addEventListener("touchmove", function (e) {
	if (noDraw) {
		return;
	}
	var c = $("#canvas").offset();
	//console.log(mousePos);
	eX = e.pageX - c.left;
	eY = e.pageY - c.top;
	if (touchDown && !erase) {
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


document.body.addEventListener("touchstart", function (e) {
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
	console.log(x, colorCanvas.width);
	drawCircle(x,y);
	rgbColor = pixelArr[y][x];
	color = convertColor(rgbColor);
		
});
document.body.addEventListener("touchend", function (e) {
	colorMd = false;
});
document.body.addEventListener("touchmove", function (e) {
	
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
	}
});