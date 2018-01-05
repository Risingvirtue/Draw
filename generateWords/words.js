var w = $("#word").html();

var arr = w.split("\n");
for (var i = 0; i < arr.length; i++) {
	arr[i] = '"' + arr[i] + '",';
}
var newW = arr.join(" ");
$("#word").html(newW);