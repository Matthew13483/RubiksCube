// 3/7/22

const cycles = {
	U: ["UFR,UFL,UBL,UBR", "UFM,ULS,UBM,URS"],
	D: ["DFL,DFR,DBR,DBL", "DFM,DRS,DBM,DLS"],
	F: ["UFL,UFR,DFR,DFL", "UFM,FRE,DFM,FLE"],
	B: ["UBR,UBL,DBL,DBR", "UBM,BLE,DBM,BRE"],
	L: ["UBL,UFL,DFL,DBL", "ULS,FLE,DLS,BLE"],
	R: ["UFR,UBR,DBR,DFR", "URS,BRE,DRS,FRE"],
	M: ["UFM,DFM,DBM,UBM", "UMS,FME,DMS,BME"],
	E: ["FLE,FRE,BRE,BLE", "FME,RSE,BME,LSE"],
	S: ["URS,DRS,DLS,ULS", "UMS,RSE,DMS,LSE"],
	x: ["UFR,UBR,DBR,DFR", "URS,BRE,DRS,FRE", "DBM,DFM,UFM,UBM", "DMS,FME,UMS,BME", "DFL,UFL,UBL,DBL", "DLS,FLE,ULS,BLE"],
	y: ["UFR,UFL,UBL,UBR", "UFM,ULS,UBM,URS", "BRE,FRE,FLE,BLE", "BME,RSE,FME,LSE", "DBR,DFR,DFL,DBL", "DBM,DRS,DFM,DLS"],
	z: ["UFL,UFR,DFR,DFL", "UFM,FRE,DFM,FLE", "URS,DRS,DLS,ULS", "UMS,RSE,DMS,LSE", "DBL,UBL,UBR,DBR", "DBM,BLE,UBM,BRE"],
};

const turnAtlas = {
	UFL: ["L',F,L,F'", "", "L',U',L,U", "", "F,U',F',U", ""],
	UFR: ["R,F,R',F'", "", "R,U',R',U", "", "", "F',U',F,U"],
	DFL: ["", "L',F',L,F", "L',D,L,D'", "", "F,D,F',D'", ""],
	DFR: ["", "R,F',R',F", "R,D,R',D'", "", "", "F',D,F,D'"],
	UBL: ["L',B',L,B", "", "", "L,U',L',U", "B',U',B,U", ""],
	UBR: ["R,B',R',B", "", "", "R',U',R,U", "", "B,U',B',U"],
	DBL: ["", "L',B,L,B'", "", "L,D,L',D'", "B',D,B,D'", ""],
	DBR: ["", "R,B,R',B'", "", "R',D,R,D'", "", "B,D,B',D'"],
	UFM: ["M',F,M,F'", "", "M',U',M,U", "", "", ""],
	UBM: ["M',B',M,B", "", "", "M,U',M',U", "", ""],
	DFM: ["", "M',F',M,F", "M',D,M,D'", "", "", ""],
	DBM: ["", "M',B,M,B'", "", "M,D,M',D'", "", ""],
	ULS: ["L',S,L,S'", "", "", "", "S,U',S',U", ""],
	URS: ["R,S,R',S'", "", "", "", "", "S',U',S,U"],
	DLS: ["", "L',S',L,S", "", "", "S,D,S',D'", ""],
	DRS: ["", "R,S',R',S", "", "", "", "S',D,S,D'"],
	FLE: ["", "", "L',E,L,E'", "", "F,E,F',E'", ""],
	FRE: ["", "", "R,E,R',E'", "", "", "F',E,F,E'"],
	BLE: ["", "", "", "L,E,L',E'", "B',E,B,E'", ""],
	BRE: ["", "", "", "R',E,R,E'", "", "B,E,B',E'"],
	UMS: ["M',S,M,S'", "", "", "", "", ""],
	DMS: ["", "M',S',M,S", "", "", "", ""],
	FME: ["", "", "M',E,M,E'", "", "", ""],
	BME: ["", "", "", "M,E,M',E'", "", ""],
	LSE: ["", "", "", "", "S,E,S',E'", ""],
	RSE: ["", "", "", "", "", "S',E,S,E'"]
};

const origin = { x: 0, y: 0, z: 0 };

var ctx = canvas.getContext("2d");

let sT = [];
const pos = { z: 22 };
let scale = 1;

class Sound {
	constructor(src, offset) {
		this.enabled = false;
		this.audio = new Audio();
		this.audio.src = src;
		this.offset = offset;
	}
	play() {
		if (this.enabled) {
			this.audio.play();
			this.audio.currentTime = this.offset;
		}
	}
	toggle() {
		this.enabled = !this.enabled;
	}
}

const sound = new Sound('assets/turn.mp3', 0.14);

function toggleSound() {
	sound.toggle();
	sON.style.display = sound.enabled ? 'block' : 'none';
	sOFF.style.display = !sound.enabled ? 'block' : 'none';
}

class Timer {
	constructor() {
		this.enabled = false;
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
			if (fps.visible) fps.display.innerHTML = "FPS: " + (1000 * fps.frameCount / time).toFixed(2);
			fps.startTime = new Date().getTime();
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