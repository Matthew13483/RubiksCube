// 3/7/22

const origin = { x: 0, y: 0, z: 0 };

var ctx = canvas.getContext('2d');

const pos = { z: 21 };
let scale = 1;

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
		this.enabled = false;
		this.time = [0, 0];
		
	}
	start() {
		
	}
	stop() {
		
	}
	reset() {
		this.time = [0, 0];
	}
	display() {
		
	}
	toggle() {
		this.enabled = !this.enabled;
	}
}

const timer = new Timer();

function toggleTimer() {
	timer.toggle();
	tON.style.display = timer.enabled ? 'block' : 'none';
	tOFF.style.display = !timer.enabled ? 'block' : 'none';
}

const fps = {
	visible: false,
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
	fps.inLoop();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	Rubik.loop();
}