// 3/7/22

class Timer {
	constructor() {
		this.running = false;
		this.startTime = 0;
		this.endTime = 0;
	}
	time() {
		return this.endTime - this.startTime;
	}
	start() {
		this.running = true;
		this.startTime = Date.now();
	}
	stop() {
		this.running = false;
		this.endTime = Date.now();
	}
	reset() {
		this.running = false;
		this.startTime = 0;
		this.endTime = 0;
	}
	display() {
		if (this.running) this.endTime = Date.now();
		return this.toString(this.time());
	}
	toString(msec) {
		let min = Math.floor(msec / 60000);
		let sec = (msec / 1000) % 60;
		return min.toString().padStart(2, 0) + ':' + sec.toFixed(3).toString().padStart(6, 0);
	}
}

const timer = new Timer();

timer.enabled = false;
timer.maystart = false;

function toggleTimer() {
	timer.enabled = !timer.enabled;
	if (timer.enabled) {
		timerON.style.display = 'block'
		timerOFF.style.display = 'none';
		button_scramble.style.animation = 'highlight 1.5s';
		timer_display.style.color = '#565670';
		timer_display.style.opacity = 1;
		timer_display.style.transform = 'translateY(0%)';
	}
	else {
		timerON.style.display = 'none';
		timerOFF.style.display = 'block';
		button_scramble.style.animation = 'none';
		timer_display.style.color = '#565670';
		timer_display.style.opacity = 0;
		timer_display.style.transform = 'translateY(100%)';
		timer.reset();
		timer.maystart = false;
		Rubik.undoCap = 0;
	}
}

function scrambleCube() {
	if (timer.enabled) {
		Rubik.reset();
		Rubik.rotateCube(
			Math.random() * 2 * Math.PI,
			Math.random() * 2 * Math.PI,
			Math.random() * 2 * Math.PI
		);
	}
	Rubik.scrambleCube();
}

class Sound {
	constructor(src) {
		this.enabled = false;
		this.audio = new Audio();
		this.audio.src = src;
	}
	play() {
		if (this.enabled) {
			this.audio.currentTime = 0;
			this.audio.play();
		}
	}
	toggle() {
		this.enabled = !this.enabled;
	}
}

const sound = new Sound('assets/turn1.mp3');

function toggleSound() {
	sound.toggle();
	soundON.style.display = sound.enabled ? 'block' : 'none';
	soundOFF.style.display = !sound.enabled ? 'block' : 'none';
}

const fps = {
	startTime: Date.now(),
	frameCount: 0,
	inLoop() {
		fps.frameCount++;
		let time = Date.now() - fps.startTime;
		if (time > 1000) {
			fps_display.textContent = 'FPS: ' + (1000 * fps.frameCount / time).toFixed(2);
			fps.startTime = Date.now();
			fps.frameCount = 0;
			
			if (debug_performance) console.table([
				{ function: 'Rubik.loop()', avgTime: timeA / frames },
				{ function: 'loop logic', avgTime: timeB / frames },
				{ function: 'draw setup', avgTime: timeC / frames },
				{ function: 'draw ctx', avgTime: timeD / frames }
			]);
			timeA = 0;
			timeB = 0;
			timeC = 0;
			timeD = 0;
			frames = 0;
		}
	}
};

let debug_performance = false;
let timeA = 0;
let timeB = 0;
let timeC = 0;
let timeD = 0;
let frames = 0;

const Vor = new Voronoi(canvas_bg);

let Rubik;

function loop() {
	requestAnimationFrame(loop);
	fps.inLoop();

	let s = performance.now();
	Rubik.loop();
	Rubik.draw_loop();
	timeA += performance.now() - s

	frames++;
}