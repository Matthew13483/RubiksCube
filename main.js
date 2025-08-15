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

function toggleTimer() {
	timer.enabled = !timer.enabled;
	timerON.classList.toggle('hidden', !timer.enabled);
	timerOFF.classList.toggle('hidden', timer.enabled);
	if (timer.enabled) {
		button_scramble.style.animation = 'highlight 1.5s';
		timer_display.style.color = '#565670';
		timer_display.style.opacity = 1;
		timer_display.style.transform = 'translateY(0%)';
	}
	else {
		button_scramble.style.animation = 'none';
		timer_display.style.color = '#565670';
		timer_display.style.opacity = 0;
		timer_display.style.transform = 'translateY(100%)';
		timer.reset();
		if (Rubik.mode[0] == 'speed_solve') Rubik.mode = ['casual'];
		Rubik.undoCap = 0;
	}
}

function scrambleCube() {
	Rubik.scrambleCube();
}

class Sound {
	constructor(src) {
		this.enabled = false;
		this.audio = new Audio();
		this.audio.src = src;
		this.audio.preload = 'auto';
		this.audio.load();
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
	soundON.classList.toggle('hidden', !sound.enabled);
	soundOFF.classList.toggle('hidden', sound.enabled);
}

let show_list = false;
function toggleList() {
	show_list = !show_list;
	times_container.classList.toggle('show', show_list);
	if (!show_list && show_solveInfo) toggleInfo();
}

let show_solveInfo = false;
let element_solveInfo = null;
function toggleInfo() {
	show_solveInfo = !show_solveInfo;
	if (!show_solveInfo && element_solveInfo) element_solveInfo.classList.remove('highlight');
	solveInfo_container.classList.toggle('show', show_solveInfo);
}

//setTimeout(animate_start, 3000);
slider.oninput = () => {
	Rubik.anim_input(slider);
	anim_updateSVG();
}
function animate_start() {
	animControl_container.style.display = 'block';
	Rubik.animate_start(slider);
	anim_updateSVG();
}
function animate_end() {
	animControl_container.style.display = 'none';
	Rubik.animate_end(slider);
	anim_updateSVG();
}
function anim_start() {
	Rubik.anim_start(slider);
	anim_updateSVG();
}
function anim_backward() {
	Rubik.anim_backward(slider);
	anim_updateSVG();
}
function anim_play() {
	Rubik.anim_play(slider);
	anim_updateSVG();
}
function anim_forward() {
	Rubik.anim_forward(slider);
	anim_updateSVG();
}
function anim_end() {
	Rubik.anim_end(slider);
	anim_updateSVG();
}
function anim_updateSVG() {
	animPause.classList.toggle('hidden', !Rubik.anim.play);
	animPlay.classList.toggle('hidden', Rubik.anim.play);
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
				MS += '..' + version;
				for (let key in table) {
					let pad = '.'.repeat(12 - key.length);
					let time = Number(table[key]).toFixed(4);
					MS += `\n${key}${pad}${time}`;
				}
				MS += '\n' + Rubik.mode.join(' ');
			}
			fps_display.textContent = 'FPS: ' + (1000 * fps.frameCount / time).toFixed(2) + MS;
			fps.startTime = Date.now();
			fps.frameCount = 0;
			
			timeA = timeB = timeC = timeD = 0;
			frames = 0;
		}
	}
};

let isTouchDevice = navigator.maxTouchPoints;
let undo = { flag: false, startTime: 0 };
button_undo.addEventListener(isTouchDevice ? 'touchstart' : 'mousedown', () => {
	undo.startTime = Date.now();
	undo.flag = true;
});
button_undo.addEventListener(isTouchDevice ? 'touchmove' : 'mousemove', () => undo.flag = false);
button_undo.addEventListener(isTouchDevice ? 'touchend' : 'mouseup', () => undo.flag = false);
button_undo.addEventListener(isTouchDevice ? 'touchcancel' : 'mouseout', () => undo.flag = false);

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

let Rubik;
let Vor;

requestIdleCallback(() => {
	Rubik = new RubiksCube(canvas);
	Vor = new Voronoi(canvas_bg);
	
	requestIdleCallback(() => {
		Rubik.init_gl();
		Rubik.rotateCube(0, -0.35, 0);
		Rubik.rotateCube(-3.5, 0, 0);
	});
	
	requestIdleCallback(() => {
		Vor.init_gl();
	});
	
	requestIdleCallback(() => {
		refresh();
		loop();
	});
});

let resizeTimeout;
window.onresize = () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(refresh, 10);
};

function refresh() {
	canvas.width = canvas_bg.width = window.innerWidth + 1;
	canvas.height = canvas_bg.height = window.innerHeight;
	
	if (Rubik && Vor) {
		Rubik.resize();
		Rubik.draw_setup();
		
		Vor.resize();
		Vor.draw_setup();
		Vor.draw();
	}
}

//let stats;
//let loaded = false;

const version = 'v 0400';

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