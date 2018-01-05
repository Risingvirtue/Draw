var erase = false;
var currPen = 1;
var currEraser = 1;
var size = ["xs", "sm", "md", "lg"];
var patch = document.getElementById('patch');
$(document).ready(function() {
	//initiate active pen and size
	$("#pencil").toggleClass("select");
	$("#smPen").toggleClass("selectSize");
	$("#smEraser").toggleClass("selectSize");
	
});

function switchPen(s) {
	$("#" + size[currPen] + "Pen").toggleClass("selectSize");
	$("#" + size[s] + "Pen").toggleClass("selectSize");
	currPen = s;
}

function switchEraser(s) {
	$("#" + size[currEraser] + "Eraser").toggleClass("selectSize");
	$("#" + size[s] + "Eraser").toggleClass("selectSize");
	currEraser = s;
}

//listeners for pen and eraser
$("#pencilButton").click(function() {
	if (erase) {
		erase = false;
		$("#pencil").toggleClass("select");
		$("#eraser").toggleClass("select");
		$(".eraserSize").css("visibility", "hidden");
	} else {
		var visible = $(".pencilSize").css("visibility");
		if (visible == "visible") {
			$(".pencilSize").css("visibility", "hidden");
		} else {
			$(".pencilSize").css("visibility", "visible");
			$(".eraserSize").css("visibility", "hidden");
		}
	}	
});
	
$("#eraserButton").click(function() {
	if (!erase) {
		erase = true;
		$("#pencil").toggleClass("select");
		$("#eraser").toggleClass("select");
		$(".pencilSize").css("visibility", "hidden");
	} else {
		var visible = $(".eraserSize").css("visibility");
		if (visible == "visible") {
			$(".eraserSize").css("visibility", "hidden");
			
		} else {
			$(".eraserSize").css("visibility", "visible");
			$(".pencilSize").css("visibility", "hidden");
		}
	}	
});

function canvasClear() {
	var data = {};
	socket.emit('clear', data);
}


window.onclick = function(event) {
    if (event.target == patch) {
        $('#patch').css('display', 'none');
		 noDraw = false;
    }
};

$('#patchNotes').click(function() {
	 $('#patch').css('display', 'block');
	 noDraw = true;
});

$('.close').click(function() {
	 $('#patch').css('display', 'none');
	  noDraw = false;
});
