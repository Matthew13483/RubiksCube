// 3/7/22

const ctx = canvas.getContext('2d');

const origin = { x: 0, y: 0, z: 0 };

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
	sON.style.display = sound.enabled ? 'block' : 'none';
	sOFF.style.display = !sound.enabled ? 'block' : 'none';
}

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
		tON.style.display = 'block'
		tOFF.style.display = 'none';
		timer_container.style.display = 'block';
		button_scramble.style.animation = 'highlight 2s';
		timerElement.style.color = '#909090';
	}
	else {
		tON.style.display = 'none';
		tOFF.style.display = 'block';
		timer_container.style.display = 'none';
		button_scramble.style.animation = 'none';
		timer.reset();
		timer.maystart = false;
		Rubik.undoCap = 0;
	}
}

function scrambleCube() {
	if (timer.enabled) {
		Rubik = new RubiksCube();
		Rubik.rotateCube(20, -20, 0);
		Rubik.rotate = {
			x: (Math.random() - 0.5) * 20,
			y: (Math.random() - 0.5) * 20,
			z: (Math.random() - 0.5) * 20
		};
	}
	Rubik.scrambleCube();
}

const fps = {
	visible: true,
	display: FPS,
	startTime: Date.now(),
	frameCount: 0,
	inLoop: () => {
		fps.frameCount++;
		let time = Date.now() - fps.startTime;
		if (time > 1000) {
			if (fps.visible) fps.display.innerHTML = 'FPS: ' + (1000 * fps.frameCount / time).toFixed(2);
			fps.startTime = Date.now();
			fps.frameCount = 0;
		}
	}
};

function loop() {
	requestAnimationFrame(loop);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	fps.inLoop();
	Rubik.loop();
}