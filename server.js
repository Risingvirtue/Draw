var express = require('express');

var app = express();

var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var words = require('./node_modules/names/words.js');
var num = 0; //unique number identifier
var currTime = 90; //timers for game
var maxTime = 90;
var currWord; //what the current word to guess is
var currPlayer;
var currPlayerID;
var playerList = []; //current player list: snapshot of sockets
var playerGone = 0;
var inProgress = false; //game in progress?
var numCorrect = 0; //number of players that guessed the word
var roundNum = 1;
var roundLimit = 5;
function newConnection(socket) {
	console.log('New Connection: ' + socket.id);
	//adds to player list on client side
	for (p of playerList) {
		//accepts icon, name, and score
		var data = {name: p.name, icon: p.icon, score: p.score, num: p.num};
		socket.emit('join', data);
	}
	//adds to socket list
	socket.num = num;
	num += 1; //increments uniqueID
	
	
	socket.on('join', joinMsg);
	//recieves icon and name
	function joinMsg(data) {
		//initialize new player
		playerList.push({socket: socket, name: data.name, icon: data.icon, id: socket.id, num: socket.num, correct: false, gone: false, score: 0});
		data.score = 0;
		data.num = socket.num;
		data.draw = false;
		socket.broadcast.emit('join', data);
		socket.emit('selfJoin', data);
		if (inProgress) {
			var guessData = {word: blankWord(currWord), num: currPlayerID};
			socket.emit('start', guessData);
		}
	}
	
	socket.on('disconnect', remove);
	
	function remove() {
		//removes player from player list
		for (p of playerList) {
			if (p.id == socket.id) {
				var data = {num: p.num};
				io.sockets.emit('leave', data);
				var index = playerList.indexOf(p);
				playerList.splice(index, 1);
				break;
			}
		}
	}
	
	//when start button is pressed
	socket.on('start', initiate);
	
	function initiate() {
		//temporary disable start button until finished
		if (inProgress) {
			return;
		}
		inProgress = true;
		console.log('initiate');
		//resets all information
		currTime = maxTime;
		playerIndexes = [];
		revealedIndex = []; //letter index revealed
		resetScores();
		//snapshots current sockets and adds additional information
		for (p of playerList) {
			var data = {num: p.num, score: p.score};
			io.sockets.emit('updateScore', data);
		}
		var d = {round: roundNum};
		io.sockets.emit('sendRound', d);
		startRound();
	}
	
	
	//starts a round
	function startRound() {
		//ends round if there's only 1 player
		if (playerList.length <= 1) {
			return;
		}
		io.sockets.emit('clear', {});
		//generates random index for player
		var tempNum = choosePlayer();
		
		//uses socket
		currPlayer = playerList[tempNum].socket;
		
		currPlayerID = playerList[tempNum].num; //saves unique ID for drawing pencil
		
		currWord = words.word(); //saves curr word from randomly generated word
		
		//sends data for pencil and word
		var drawData = {word: currWord, num: currPlayerID};
		var guessData = {word: blankWord(currWord), num: currPlayerID};
		currPlayer.broadcast.emit('start', guessData);
		currPlayer.emit('startDraw',drawData);
		
		//gives server the word
		console.log(currWord);
		
		//initiate timer
		interval = setInterval(update, 1000);
	}
	
	function update() {
		//checks end round
		if (numCorrect + 1 == playerList.length) {
			endRound();
		}
		//updates time client and server side
		var data = {currTime: currTime, maxTime: maxTime};
		io.sockets.emit('time', data);
		
		//checks time and reveals letters accordingly
		timeCondition();
		currTime -= 1;
	}
	
	function timeCondition() {
		//reveal a letter
		if (currTime == Math.floor(maxTime / 2)) {
			revealLetter();
			
		//reveal a second letter
		} else if (currTime == Math.floor(maxTime / 4)) {
			revealLetter();
		}
		
		//resets round when time runs out
		if (currTime == 0) {
			var d = {word: currWord};
			io.sockets.emit('correct', d);
			endRound();
		}
	}
	
	function endRound() {
		//if all players have gone
		if (playerGone == playerList.length) {
			resetRow();
			roundNum += 1;
			if (roundNum < roundLimit) {
				var d = {round: roundNum};
				setTimeout(function() {io.sockets.emit('sendRound', d);}, 3000);
			}
		}
		resetRound();
		numCorrect = 0;
		//if round num hasn't hit round limit
		if (roundNum < roundLimit) {
			setTimeout(startRound, 3000);
		//ends game
		} else {
			roundNum = 1;
			var arr = sort();
			var data = arr[0];
			setTimeout(function() {io.sockets.emit('winner', data)}, 2000); //sends winner info
		}
	}
	//reveals a letter
	function revealLetter() {
		var list = [];
		for(var i = 0; i < currWord.length; i++) {
			if (!revealedIndex.includes(i)) {
				list.push(i);
			}
		}
		var index = Math.floor(Math.random() * list.length);
		revealedIndex.push(index);
		var d = {index: index, letter: currWord[index]};
		io.sockets.emit('updateWord', d);
	}
	
	
	//change all player's gone status to false
	function resetRow() {
		for (p of playerList) {
			p.gone = false;
		}
		playerGone = 0;
	}
	
	
	//sends draw info back to other clients
	socket.on('mouse', mouseMsg);
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data);
	}
	
	socket.on('dot', dotMsg);
	function dotMsg(data) {
		socket.broadcast.emit('dot', data);
	}
	
	//handles messages and guesses
	socket.on('send', myMsg);
	
	function myMsg(data) {
		if (data.message == currWord) {
			if (socket.id != currPlayer.id) {
				//marks Correct and returns 1 if changed (adds score if not not correct yet), 0 if not
				if (markCorrect(socket.id) == 1) {
					var d = {word: currWord};
					socket.emit('correct', d); //gives correct word to socket
					numCorrect += 1;
					//if first person gets correct and time is before 1/4 time
					if (numCorrect == 1 && currTime > maxTime / 4) {
						currTime  = Math.floor(maxTime / 4);
						revealLetter();
						update();
						//gives drawer 15 points
						addScore(currPlayerID, 15);
						var score = getScore(currPlayerID);
						var data = {num: currPlayerID, score: score};
						
						console.log('data', data);
						io.sockets.emit('updateScore', data);
					}
					//sends correct message to all players
					var name = {name: getName(socket.id)};
					io.sockets.emit('sendCorrect', name);
					console.log('numCorrect: ', numCorrect);
				}
			}
		} else {
			//if not correct word, just send message to everyone
			io.sockets.emit('send', data);
		}
	}
	
	socket.on('clear', clear);
	function clear(data) {
		//only clear if player is drawing
		if (socket.num == currPlayerID) {
			io.sockets.emit('clear', data);
		}
	}
}

//helper function to choose a random avaliable player
function choosePlayer() {
	var avaliable = [];
	for (p of playerList) {
		if (!p.gone) {
			avaliable.push(playerList.indexOf(p));
		}
	}
	var randPlayer = Math.floor(Math.random() * avaliable.length);
	playerList[randPlayer].gone = true;
	playerGone += 1;
	return avaliable[randPlayer];
}

//helper function to generate blank word
function blankWord(word) {
	var str = "";
	for (var i =0; i < word.length; i++) {
		str += '*';
	}
	return str;
}
	
//helper function to identify correct and update score
function markCorrect(id) {
	for (p of playerList) {
		if (p.id == id) {
			if (p.correct) {
				return 0;
			} else {
				p.correct = true;
				p.score += currTime;
				var data = {num: p.num, score: p.score};
				io.sockets.emit('updateScore', data);
				return 1;
			}
		}
	}
	return 0;
}
function resetScores() {
	for (p of playerList) {
		p.score = 0;
	}
}

function getScore(num) {
	for (p of playerList) {
		if (p.num == num) {
			return p.score;
		}
	}
}


function addScore(num, add) {
	for (p of playerList) {
		if (p.num == num) {
			p.score += add;
			return;
		}
	}
}

//resets round
function resetRound() {
	clearInterval(interval);
	currTime = maxTime;
	inProgress = false;
	//resets correctness
	for (p of playerList) {
		p.correct = false;
	}
}

function getName(id) {
	for (p of playerList) {
		if (p.id == id) {
			return p.name;
		}
	}
	return '';
}

//sorts players by score
function sort() {
	var arr = [];
	for (p of playerList) {
		arr.push({name: p.name, score: p.score});
	}
	var arr = arr.sort(function(a,b) {return b.score - a.score;});
	return arr;
}