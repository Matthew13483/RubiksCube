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
		this.update();
		this.running = false;
	}
	reset() {
		this.running = false;
		this.startTime = 0;
		this.endTime = 0;
	}
	update() {
		if (this.running) this.endTime = Date.now();
		return this.time();
	}
	display() {
		this.update();
		return this.timeToString();
	}
	timeToString() {
		let time = this.time();
		let min = Math.floor(time / 60000);
		let sec = (time / 1000) % 60;
		return min.toString().padStart(2, '0') + ':' + sec.toFixed(3).padStart(6, 0);
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
		Rubik.resetCube();
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
			let table = {
				'Main_Loop': Number((timeA / frames).toFixed(4)),
				'R_loop': Number((timeB / frames).toFixed(4)),
				'R_draw_loop': Number((timeC / frames).toFixed(4)),
				'Vor_draw': Number((timeD / frames).toFixed(4))
			};
			debug_table.push(table);
			
			let MS = '';
			if (debug_performance) {
				let maxL = 0;
				Object.keys(table).forEach((key, i) => {
					if (key.length > maxL) maxL = key.length;
				});
				Object.keys(table).forEach((key, i) => {
					let pad = '<span style="opacity: 0.3">' + '.'.repeat(maxL - key.length) + '</span>';
					MS += '<br>' + key + pad + ': ' + table[key].toFixed(4);
				});
				MS = '<span style="font-size:13px;">' + MS + '</span>';
			}
			
			fps_display.innerHTML = 'FPS: ' + (1000 * fps.frameCount / time).toFixed(2) + MS;
			fps.startTime = Date.now();
			fps.frameCount = 0;
			
			timeA = timeB = timeC = timeD = 0;
			frames = 0;
		}
	}
};

let undo = {
	flag: false,
	startTime: 0
};
button_undo.ontouchstart = () => {
	undo.startTime = Date.now();
	undo.flag = true;
};
button_undo.ontouchmove = button_undo.ontouchend = button_undo.ontouchcancel = () => {
	undo.flag = false;
};

canvas_map.width = 150;
canvas_map.height = 113;
let ctx = canvas_map.getContext('2d');

let debug_performance = false;
let debug_table = [];

function debug(last_n) {
	table = debug_table;
	if (last_n && last_n <= debug_table.length) table = debug_table.slice(debug_table.length - last_n);
	console.table(table);
}
function debug_ave(n) {
	let limit = debug_table.length;
	if (n && n <= debug_table.length) limit = n;
	let a = [];
	for (let i = 0; i < Object.keys(debug_table[0]).length; i++) a.push(0);
	let c = 0;
	for (i = 0; i < limit; i++) {
		Object.values(debug_table[i]).forEach((t, i) => a[i] += Number(t));
		c++;
	}
	console.log('count: ' + c);
	let m = a.map(m => (m / c).toFixed(4));
	let table = Object.keys(debug_table[0]).map((f, i) => ({ function: f, avgTime: m[i] }));
	
	console.table(table);
}

let timeA = 0;
let timeB = 0;
let timeC = 0;
let timeD = 0;
let frames = 0;

const Vor = new Voronoi(canvas_bg);

const Rubik = new RubiksCube(canvas);
Rubik.rotateCube(0, -0.35, 0);
Rubik.rotateCube(-3.5, 0, 0);

//let stats;
//let loaded = false;

function loop() {
	requestAnimationFrame(loop);
	//if (loaded) stats.begin();
	fps.inLoop();

	let s = performance.now();

	if (undo.flag && (Date.now() - undo.startTime) > 300) Rubik.turnUndo();

	let s1 = performance.now();
	Rubik.loop();
	timeB += performance.now() - s1;
	let s2 = performance.now();
	Rubik.draw_loop();
	timeC += performance.now() - s2;

	let s3 = performance.now();
	if (fps.frameCount % 3 == 0) Vor.draw();
	timeD += performance.now() - s3;

	timeA += performance.now() - s;

	frames++;
	//if (loaded) stats.end();
}

/*const script = document.createElement('script');
script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js';
script.onload = () => {
	stats = new Stats();
	stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(stats.dom);
	loaded = true;
};
document.head.appendChild(script);*/




window.onload = () => {
	window.onresize();
	
	content.style.display = 'block';
	
	loop();
};

window.onresize = () => {
	canvas.width = canvas_bg.width = window.innerWidth;
	canvas.height = canvas_bg.height = window.innerHeight;
	
	Rubik.resize();
	Rubik.draw_setup();
	
	Vor.resize();
	Vor.draw_setup();
	Vor.draw();
};