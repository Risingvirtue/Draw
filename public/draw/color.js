var range = [];
for (var i = 0; i< 51; i++) {
	var color = {r: 255, g: 0 + 5*i, b: 0}
	range.push(color);
}
for (var i = 0; i< 51; i++) {
	var color = {r: 255 - 5*i, g:255, b: 0}
	range.push(color);
}
for (var i = 0; i< 51; i++) {
	var color = {r: 0, g: 255, b: 0 + 5*i}
	range.push(color);
}
for (var i = 0; i< 51; i++) {
	var color = {r: 0, g: 255- 5*i, b: 255}
	range.push(color);
}
for (var i = 0; i< 51; i++) {
	var color = {r: 0 + 5*i, g: 0, b: 255}
	range.push(color);
}

for (var i = 0; i< 51; i++) {
	var color = {r: 255, g: 0, b: 255 - 5*i}
	range.push(color);
}
$(document).ready(function() {
	
	var val = $("#slider").val();
	color = "rgb(" + range[val].r + ", " + range[val].g + ", " + range[val].b + ")";
	rgbColor = {r: range[val].r, g: range[val].g, b: range[val].b};
});


function changeColor() {
	var val = $("#slider").val();
	color = "rgb(" + range[val].r + ", " + range[val].g + ", " + range[val].b + ")";
	rgbColor = {r: range[val].r, g: range[val].g, b: range[val].b};
	drawCanvas(rgbColor);
}