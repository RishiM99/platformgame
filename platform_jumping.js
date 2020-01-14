let width = 700;
let height = 650;

let mouseClickedX;
let mouseClickedY;

let ball;
let paddlesObj;

let liveCount = 100;
let points = 0;

let cursorY;
let cursorX;

class Ball {
	constructor(ball_x, ball_y, diameter) {
		this.ball_x = ball_x;
		this.ball_y = ball_y;
		this.diameter = diameter;
		this.ball_started_moving = false;
		this.ball_in_air = false;
		this.yvel = 0;
		this.xvel = 0;
		this.yaccel = 3;
		this.onTopmostPaddle = false;
	}

	draw() {
		circle(this.ball_x, this.ball_y, this.diameter);
	}

	update() {
		if (this.ball_started_moving) {

			
			/*
			this.yvel = -25;

			var n = Math.max((-(this.yvel - this.yaccel/2) + Math.sqrt(Math.pow(this.yvel - this.yaccel/2, 2) - 2*this.yaccel*(this.ball_y - this.ball_y)))/this.yaccel,
							(-(this.yvel - this.yaccel/2) - Math.sqrt(Math.pow(this.yvel - this.yaccel/2, 2) - 2*this.yaccel*(this.ball_y - this.ball_y)))/this.yaccel);

			console.log('mouseclickedy' + str(mouseClickedY));
			console.log('ball_y' + str(this.ball_y));
			console.log('first term: ' + str(Math.pow(this.yvel - this.yaccel/2, 2)));
			console.log('second term: ' + str(2*this.yaccel*(this.ball_y - mouseClickedY)));

			n = Math.ceil(n);

			this.xvel = (mouseClickedX - this.ball_x)/n;

			console.log('yvel' + str(this.yvel));
			console.log('xvel' + str(this.xvel));
			*/
			
			
			
			this.yvel = Math.min(this.yaccel/2 - Math.sqrt(2)*Math.sqrt(this.yaccel*(-mouseClickedY + this.ball_y + 60)), 
								this.yaccel/2 + Math.sqrt(2)*Math.sqrt(this.yaccel*(-mouseClickedY + this.ball_y + 60)));

			console.log('yvel' + str(this.yvel));

			var n = Math.max((-(this.yvel - this.yaccel/2) + Math.sqrt(Math.pow(this.yvel - this.yaccel/2, 2) - 2*this.yaccel*(this.ball_y - mouseClickedY)))/this.yaccel,
							(-(this.yvel - this.yaccel/2) - Math.sqrt(Math.pow(this.yvel - this.yaccel/2, 2) - 2*this.yaccel*(this.ball_y - mouseClickedY)))/this.yaccel);


			console.log('n' + str(n));

			n = Math.ceil(n);



			this.xvel = (mouseClickedX - this.ball_x)/n;

			console.log('xvel' + str(this.xvel));
			
			

			if (this.ball_y == (1/2)*(height/10) - this.diameter/2) {
				this.onTopmostPaddle = true;
			}

			this.ball_x += this.xvel;
			this.ball_y += this.yvel;

			this.ball_started_moving = false;
			this.ball_in_air = true;
		}
		else if (this.ball_in_air) {
			if (this.ball_y > height) {
				this.ball_x = paddlesObj.paddles[paddlesObj.paddles.length-1][0] + paddlesObj.paddle_width/2;
				this.ball_y = (height/10)*9 + (height/10)*(1/2) - this.diameter/2;
				this.ball_in_air = false;
				liveCount -=1;
				cursorY = 8.5*(height/10) - this.diameter/2;
				return;
			}

			if (this.onTopmostPaddle == true && this.ball_y < 0) {
				this.ball_x = paddlesObj.paddles[paddlesObj.paddles.length-1][0] + paddlesObj.paddle_width/2;
				this.ball_y = (height/10)*9 + (height/10)*(1/2) - this.diameter/2;
				this.ball_in_air = false;
				this.onTopmostPaddle = false;
				paddlesObj.paddle_width *= (.6);
				paddlesObj.paddle_vel *= (1.4);
				points += 5;
				cursorY = 8.5*(height/10) - this.diameter/2;
				return;
			}

			this.yvel += this.yaccel;
			this.ball_x += this.xvel;
			this.ball_y += this.yvel;

			if (!(this.ball_y <= 0) && !(this.ball_y >= height)) {
				var y_range = Math.floor(this.ball_y / (height/10));

				if (this.ball_y >= (((height/10)*(y_range+(1/2)) - this.diameter/2)) && this.ball_y <= (((height/10)*(y_range+(1/2)) - this.diameter/2) + this.yvel) 
					&& this.ball_x >= paddlesObj.paddles[y_range][0] && this.ball_x <= (paddlesObj.paddles[y_range][0] + paddlesObj.paddle_width) 
					&& this.yvel > 0) {
					this.ball_y = (height/10)*(y_range+(1/2)) - this.diameter/2;
					this.ball_in_air = false;
					cursorY = this.ball_y - (height/10);
				}
			}
		}
		else {
			var y_range = Math.floor(this.ball_y / (height/10));
			this.ball_x += paddlesObj.paddle_vel * paddlesObj.paddles[y_range][1];
		}
	}
}

class PaddlesObj {
	constructor() {
		this.paddle_width = width/3;
		this.paddle_height = 25;
		this.paddle_vel = 2;
		this.paddles = [];
		for (var i = 0; i < 10; i++) {
			append(this.paddles, [Math.floor(random() * (width - this.paddle_width + 1)), random([-1,1])]);
		}
	}

	draw() {
		for (var i = 0; i < 10; i++) {
			var paddle_x = this.paddles[i][0];
			rect(paddle_x, (height/10)*i + (1/2)*(height/10), this.paddle_width, this.paddle_height, 5);
		}
	}

	update() {
		for (var i = 0; i < 10; i++) {
			var paddle_dir = this.paddles[i][1];

			this.paddles[i][0] += this.paddle_vel * paddle_dir;

			if (this.paddles[i][0] >= width - this.paddle_width || this.paddles[i][0] <= 0) {
				this.paddles[i][1] *= -1;
			}
		}
	}
}


function setup() {
	createCanvas(width, height);
	background(0);

	paddlesObj = new PaddlesObj();

	diameter = 20;
	ball_x = paddlesObj.paddles[paddlesObj.paddles.length-1][0] + paddlesObj.paddle_width/2;
	ball_y = (height/10)*9 + (height/10)*(1/2) - diameter/2;

	ball = new Ball(ball_x, ball_y, diameter);

	cursorY = 8.5*(height/10) - diameter/2;
}

function draw() {
	background(0);

	paddlesObj.draw();
	paddlesObj.update();

	ball.draw();
	ball.update();

	fill(230, 0, 0);
	circle(cursorX, cursorY, 7);

	if (liveCount > 0) {
		fill(255, 255, 255);
		textSize(15);
		text("Lives Left: " + str(liveCount), 0, 15);
		text("Points: " + str(points), (9/10)*width, 15);
	}
	else {
		background(0);
		fill(255, 255, 255);
		textSize(40);
		text("You Died :(", width/3, height/3);
		text("Total Points: " + str(points), width/3, (2/3)*height);
	}
}

function mouseClicked() {
	if (!ball.ball_in_air && mouseY <= ball.ball_y) {
		mouseClickedX = mouseX;
		//mouseClickedY = mouseY;
		mouseClickedY = (height/10) * (Math.floor(ball.ball_y / (height/10)) - 1 + 1/2) - ball.diameter/2;
		ball.ball_started_moving = true;
	}
}

function mouseMoved() {
	cursorX = mouseX; 
}