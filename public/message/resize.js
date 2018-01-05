var inMemCanvas = document.getElementById('memCanvas');
var inMemCtx = inMemCanvas.getContext('2d');
$(window).resize(function() {
		fitToContainer(canvas);
});
function fitToContainer(canvas){
	inMemCanvas.width = canvas.width;
    inMemCanvas.height = canvas.height;
    inMemCtx.drawImage(canvas, 0, 0);
	// Make it visually fill the positioned parent
	canvas.style.width ='100%';
	canvas.style.height='100%';
	// ...then set the internal size to match
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	canvas.height = Math.floor($(window).height() * 2 / 3);
    ctx.drawImage(inMemCanvas, 0, 0, canvas.width, canvas.height);
	$("#text").css("height", Math.floor($(window).height() * 8 / 15));
	$("#message").css("height", Math.floor($(window).height() * 2 / 15));
	$("#names").css("height", Math.floor($(window).height() / 3));
	$(".name").css("height", Math.floor($(window).height() / 30));
	$(".arrow").css("height", Math.floor($(window).height() / 30));
	changeGame();
	
}

function changeGame() {
	$(".game").css('width', canvas.width);
	$(".game").css('height', canvas.height / 6);
	$(".well").css('height', canvas.height / 6);
	$(".title").css('font-size', canvas.width / 20);
	$(".time").css('height', canvas.height / 5);
	$(".time").css('width', canvas.height / 5);
}

