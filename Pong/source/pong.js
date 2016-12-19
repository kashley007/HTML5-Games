var canvas;
var canvasContext;
var ballX;
var ballY;
var ballSpeedX = 10;
var ballSpeedY = 10;
var ballRadius = 8;
var leftPaddleY;
var rightPaddleY;
var leftPaddleHeight;
var rightPaddleHeight;
var leftPaddleWidth = 10;
var pong = new Audio('./audio/pongblipe.wav');
var miss = new Audio('./audio/peep.ogg');
var paddleHit = new Audio('./audio/paddleHit.wav');
var showMainScreen = true;
var playGame = false;
var showWinScreen = false;
var demoMode = false;
var menuSelector;
var menuEnter = false;
var player1Score = 0;
var player2Score = 0;
const MAX_SCORE = 10;
const PADDLE_SPEED = 80;




window.onload = function() {

	canvas = document.getElementById('respondCanvas');
	canvasContext = canvas.getContext('2d');
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	leftPaddleHeight = .25 * canvas.height;
	leftPaddleY = (canvas.height / 2) - (.5*leftPaddleHeight);
	menuSelector = canvas.height/2 - 20;

	var framesPerSecond = 30;

	setInterval(function() {
		if(showMainScreen) {
			mainScreen();
		}else if(playGame) {
			moveEverything();
			drawEverything();
		}else if(showWinScreen) {
			winScreen();
		}else {

		}
		
	}, 1000/framesPerSecond);

	window.addEventListener("keydown",function(e){
		if (e.keyCode == '38' && leftPaddleY > 0)
			leftPaddleY -= PADDLE_SPEED;
		  
			else if (e.keyCode == '40' && leftPaddleY + leftPaddleHeight < canvas.height)
				leftPaddleY += PADDLE_SPEED;
	});
	window.addEventListener("keydown",function(f){
		if (f.keyCode == '38' && !playGame){
			menuSelector = canvas.height/2 - 20;
			pong.play();
		}else if (f.keyCode == '40' && !playGame){
				menuSelector = canvas.height/2 - 20 + 50;
				pong.play();
			}
		if (f.keyCode == '13')
			menuEnter = true;	
	});
}


function mainScreen() {
	

	//color canvas
	createRect(0, 0, canvas.width, canvas.height, 'black');
	canvasContext.fillStyle = 'white';
	canvasContext.font = '80px PressStart2P';
	canvasContext.fillText("PONG", canvas.width/2 - 160, canvas.height/2 - 100);
	canvasContext.font = '30px PressStart2P';
	canvasContext.fillText("PLAY", canvas.width/2 - 140, canvas.height/2);
	canvasContext.fillText("DEMO MODE", canvas.width/2 - 140, canvas.height/2 + 50);
	createRect(canvas.width/2 - 180, menuSelector, 8, 8, 'white');

	if (menuSelector == canvas.height/2 - 20 && menuEnter) {
		showMainScreen = false;
		playGame = true;
	}else if (menuSelector == canvas.height/2 - 20 + 50 && menuEnter) {
		showMainScreen = false;
	}

	menuEnter = false;
}

function winScreen() {
	createRect(0, 0, canvas.width, canvas.height, 'black');
	if(player1Score == MAX_SCORE){
		canvasContext.fillStyle = 'white';
		canvasContext.font = '30px PressStart2P';
		canvasContext.fillText("PLAYER 1", canvas.width/2 - 140, canvas.height/2 - 100);
		canvasContext.fillText("WINS!", canvas.width/2 - 70, canvas.height/2 - 40);
	}else {
		canvasContext.fillStyle = 'white';
		canvasContext.font = '30px PressStart2P';
		canvasContext.fillText("Player 2", canvas.width/2 - 140, canvas.height/2 - 100);
		canvasContext.fillText("WINS!", canvas.width/2 - 70, canvas.height/2 - 40);
	}
}

function moveEverything() {

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

	if(ballX >= (canvas.width)) {
		if(ballY >= ballY && ballY <= ballY + leftPaddleHeight) {
			ballSpeedX = -ballSpeedX;
			rightPaddleHeight = ballY - leftPaddleHeight/2;
			paddleHit.play();
		}else {
			ballReset();
			miss.play();
			player1Score++;
		}
	}
	if(ballX <= (leftPaddleWidth + 10) ) {
		if(ballY >= leftPaddleY && ballY <= leftPaddleY + leftPaddleHeight) {
			var deltaY = ballY - leftPaddleY + leftPaddleHeight/2;
			ballSpeedX = deltaY * 0.15;
			paddleHit.play();
		} else {
			ballReset();
			miss.play();
			player2Score++; 
		}
	}
		
	if(ballY >= canvas.height) {
		ballSpeedY = -ballSpeedY;
		pong.play();
	}
	if(ballY <= 0) {
		ballSpeedY = -ballSpeedY;
		pong.play();
	}
	
	if(player1Score == MAX_SCORE || player2Score == MAX_SCORE) {
		playGame = false;
		showWinScreen = true;
	}
}

function drawEverything() {
	
	
	//color canvas
	createRect(0, 0, canvas.width, canvas.height, 'black');
	drawNet();
	
	//create left side paddle
	createRect(0, leftPaddleY, leftPaddleWidth, leftPaddleHeight, 'white');

	//create right side paddle
	
	createRect(canvas.width - 10, ballY - leftPaddleHeight/2, leftPaddleWidth, leftPaddleHeight, 'white');
	
	canvasContext.fillStyle = 'white';
	canvasContext.font = '80px PressStart2P';
	canvasContext.fillText(player1Score, canvas.width/2 - 160, 100);
	canvasContext.fillText(player2Score, canvas.width/2 + 100, 100);

	//create ball
	createCircle(ballX, ballY, ballRadius,'red');
	
}

function createRect(leftX, topY, width, height, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

function createCircle(centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function ballReset() {
	if (ballX < canvas.width)
	ballSpeedX = -10
	else 
		ballSpeedX = 10;

	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function drawNet() {
	for(var i = 0; i < canvas.height; i+=40) {
		createRect(canvas.width/2 -1, i, 2, 20, 'white');
	}
}