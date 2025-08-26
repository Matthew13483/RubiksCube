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
	if (show_list) toggleList();
	timer.enabled = !timer.enabled;
	timerON.classList.toggle('hidden', !timer.enabled);
	timerOFF.classList.toggle('hidden', timer.enabled);
	timer_display.style.color = '#565670';
	timer_display.classList.toggle('show', timer.enabled);
	button_scramble.style.animation = timer.enabled ? 'highlight 1.5s' : 'none';
	if (!timer.enabled) {
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

let show_dims = false;
function toggleDims() {
	show_dims = !show_dims;
	dims_container.classList.toggle('show', show_dims);
}

for (let i = 2; i <= 21; i++) {
	let option = document.createElement('div');
	option.textContent = i;
	option.classList.add('dim');
	option.onclick = () => {
		changeDim(i);
		if (show_dims) toggleDims();
	};
	dims_container.appendChild(option);
}

function changeDim(n) {
	text_dim.textContent = n;
	Rubik.dim = n;
	Rubik.create_pieces();
	Rubik.reset();
	Rubik.rotateCube(0, -0.35, 0);
	Rubik.rotateCube(-3.5, 0, 0);
	button_rotateFree.classList.toggle('disabled', !Rubik.rotateFree);
	adjust_speedLevel(4);
	animControl_container.classList.add('hidden');
	animControl_details.classList.add('hidden');
	if (show_list) toggleList();
	if (timer.enabled) toggleTimer();
}

function toggle_box() {
	Rubik.boxed = !Rubik.boxed;
	Rubik.draw_setup();
	button_box.classList.toggle('disabled', !Rubik.boxed);
}

function toggle_rotateFree() {
	Rubik.rotateFree = !Rubik.rotateFree;
	button_rotateFree.classList.toggle('disabled', !Rubik.rotateFree);
}

function adjust_speedLevel(level) {
	Array.from(button_speedLevel.children).forEach((element, i, a) => {
		element.classList.toggle('disabled', i < a.length - level);
	});
	Rubik.turn_ms.touch = [Infinity, 240, 180, 120, 60][level];
}

let show_solveInfo = false;
let element_solveInfo = null;
function toggleInfo() {
	show_solveInfo = !show_solveInfo;
	solveInfo_container.classList.toggle('show', show_solveInfo);
	if (!show_solveInfo && element_solveInfo) element_solveInfo.classList.remove('highlight');
}

slider.oninput = () => {
	Rubik.anim_input(slider);
	anim_updateSVG();
}
function animate_start(setup, alg, alg0) {
	if (show_list) toggleList();
	if (timer.enabled) toggleTimer();
	animControl_container.classList.remove('hidden');
	animControl_details.classList.remove('hidden');
	animControl_svg.innerHTML = '';
	animControl_svg.appendChild(create_alg_svg(alg).svg);
	animControl_alg.textContent = alg0;
	Rubik.animate_start(slider, setup, alg);
	anim_updateSVG();
}
function animate_end() {
	animControl_container.classList.add('hidden');
	animControl_details.classList.add('hidden');
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
	let anim_play = Rubik.anim && Rubik.anim.play;
	animPause.classList.toggle('hidden', !anim_play);
	animPlay.classList.toggle('hidden', anim_play);
}

let show_algs = false;
function toggleAlgs() {
	show_algs = !show_algs;
	algs_container.classList.toggle('show', show_algs);
	button_algs.classList.toggle('show', show_algs);
}

let alg_sets = {
	'PLL': [
		"111111111000000000000", "",
		"R U' R U R U R U' R' U' R2", //Ua perm
		"R2' U R U R' U' R3 U' R' U R'", //Ub perm
		"M2' U M2' U2 M2' U M2'", //H perm
		"M2' U2 M U M2' U M2' U M", //Z perm
		"x R' U R' D2 R U' R' D2 R2 x'", //Aa perm
		"x R2' D2 R U R' D2 R U' R x'", //Ab perm
		"x' R U' R' D R U R' D' R U R' D R U' R' D' x", //E perm
		"R U' R' U' R U R D R' U' R D' R' U2 R'", //Ra perm
		"R' U2 R' D' R U' R' D R U R U' R' U' R", //Rb Perm
		"R U R' F' R U R' U' R' F R2 U' R' U'", //Jb perm
		"R' U L' U2 R U' R' U2 R L U'", //Ja perm
		"R U R' U' R' F R2 U' R' U' R U R' F'", //T perm
		"R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", //F perm
		"F R U' R' U' R U R' F' R U R' U' R' F R F'", //Y perm
		"R' U R' U' R D' R' D R' U D' R2 U' R2' D R2", //V perm
		"R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", //Na perm
		"r' D' F r U' r' F' D r2 U r' U' r' F r F'", //Nb perm
		"R2 U R' U R' U' R U' R2 U' D R' U R D'", //Ga perm
		"R' U' R U D' R2 U R' U R U' R U' R2' D", //Gb perm
		"R2' U' R U' R U R' U R2 D' U R U' R' D", //Gc perm
		"R U R' U' D R2 U' R U' R' U R' U R2 D'", //Gd perm
	],
	'ZBLL': {
		0: "010111010000000000000", 1: "",
		'U': {
			0: "010111111000101000000", 1: "U' (L' U2 L U L' U L) (R U2' R' U' R U' R')",
			'U F-light': [
				"111111111101101101101", "U' (L' U2 L U L' U L) (R U2' R' U' R U' R')",
				"(L' U2 L U L' U L) (R U2' R' U' R U' R')",
				"(R U R' U R U2' R') U (R U2' R' U' R U' R')",
				"(R U R' U') (R U' R' U2)2 R U R'",
				"(R U2' R' U' R U' R') U' (R U R' U R U2' R')",
				"(R' U2 R U R' U R) U (R' U' R U' R' U2 R)",
				"(R' U2' R2 U R2' U) R U' (R U R' U') R U' R'",
				"(R U2' R2' U' R2 U') (R' U R' U') (R U R' U R)",
				"(R' U' R U' R' U2 R) (R U R' U R U2' R')",
				"(R U R' U R U2' R') (R' U' R U' R' U2' R)",
				"x' R2 D2 (R' U' R D2) R2' D (R U R' D') x",
				"(R' U' R U') (R U R' U') (R' U2' R U2' R U2' R')",
				"(R U R' U) (R' U' R U') (R' U2' R U2' R U2' R')"
			],
			'U B-light': [
				"111111111101101101101", "(R U R' L') U2 (R U' R' U') (R U' R' L)",
				"(R U R' L') U2 (R U' R' U') (R U' R' L)",
				"(R U R' U) L' (R U R' U') L (U' R U' R')",
				"(r U R' U' r' R U R U' R') (F R U R' U' F')",
				"r U2' (R2' F R F') U2' r' (R U R U' R')",
				"(R' U2 R) F U' (R' U R U) (R' U R U') F'",
				"(R U' R' U') (R U R D) (R' U R D') R2'",
				"F (R U R' U')2 F' U' R' (F' U' F) U R",
				"(R' U2 R) F U' (R' U' R U) F'",
				"R' D' (R U' R' D) R2 U2' R' U R U R'",
				"F (R U R' U') F' U2 (r' U r2 U' r2' U' r2 U r')",
				"R D' R2' U (R U R' U2') R2 D R'",
				"F (R U' R' U' R U2' R' U')2 F'"
			],
			'U /': [
				"111111111101101101101", "U2 R2 D (r' U2 r D') R' U2 R'",
				"R2 D (r' U2 r D') R' U2 R'",
				"R2 D (R' U2 R D') R' U2 R'",
				"(R' U' R U' R' U2 R) (R U' L' U R' U' L)",
				"R2 D (R' U R D') (R2' U R U2 R')",
				"(R' U' L U') (R U L' U) (R' U' R U') R' U R",
				"(R U' R' U') (R U2' R' UD) (R' U R U2) (R' U R D')",
				"(R U' L' U R' U' L) (R' U' R U' R' U2 R)",
				"(R U2' R2' D') (R U2 R' D) (R2 U' R' U2 R U2' R')",
				"(R' U' R U) (R U R' U') R' U F (R U R U' R') F'",
				"(R' U R' U'D') (R U' R' U2') (R U' R' D) R U' R",
				"(R' U' R U') L U' (R' U2 L' U2) R U' L U2 L'",
				"(R U' R' U) (R U R' U')2 R U L U' R' U L'"
			],
			'U \\': [
				"111111111101101101101", "R2' D' (r U2 r' D) R U2 R",
				"R2' D' (r U2 r' D) R U2 R",
				"R2' D' (R U2 R' D) R U2 R",
				"(R U R' U) R U2' R2' z (R U R' D) R U' z'",
				"R2' D' (R U' R' D) (R2 U' R' U2 R)",
				"(R U L' U R' U' L) U' (R U R' U R U' R')",
				"(R' U R U) (R' U2' R U'D') (R U' R' U2) (R U' R' D)",
				"(R' U2 R' D') (R U2 R' D) (R U2 R U R' U R)",
				"(R' U2' R2 D) (R' U2 R D') R2' U (R U2 R' U2' R)",
				"L' (R U R' U') L (U2 R U2' R') (R' U' R U' R' U2 R)",
				"(R U' R UD) (R' U R U2') (R' U R D') R' U R'",
				"(R' U R U') R' U' (R U R' U')2 (L' U R U' L)",
				"F (R U' R' U') (R U2 R' U') F' U (R' U' R U' R' U2 R)"
			],
			'U X': [
				"111111111101101101101", "x' R2 D2 (R' U2 R D2) R' U2 R' x",
				"x' R2 D2 (R' U2 R D2) R' U2 R' x",
				"x R2' D2 (R U2 R' D2) R U2 R x'",
				"(R U2' R' U' R U' R') (R2' D' R U2 R' D R U2 R)",
				"(R' U2' R U R' U R) (R2 D R' U2 R D' R' U2 R')",
				"(R' U R U) (R' U R U') R D (R' U' R D') R2 U' R",
				"(R U' R' U') (R U' R' U) R' D' (R U R' D) R2 U R'",
				"(R' U2 R U) (R' U R' D') (R U' R' D) R U R",
				"(R U' R' U') (R U2' R' U2) R' D' (R U' R' D) R",
				"(R U R' U') L' U2 (R U R' U2 L) R U' R'",
				"(R' U' R U) L U2 (R' U' R U2) L' R' U R",
				"F (R U' R' U) (R U R' U) (R U' R' F')",
				"L' (R' U R U') L (R' U' R U2) (R U R2' U R2 U2' R')"
			],
			'U FB-light': [
				"111111111101101101101", "U' R2' F' (R U R' U') (R' F R2 U') (R' U2 R2 U) (R' U R)",
				"R2' F' (R U R' U') (R' F R2 U') (R' U2 R2 U) (R' U R)",
				"R' F (R U' R' U') (R U R' F') (R U R' U') (R' F R F' R)",
				"F2 (R U' R' U') (R U R' F') (R U R' U') (R' F R F2)",
				"F' (R U R' U) (R U R' F') (R U R' U') (R' F R2 U') R' U2 (R U' R' F)",
				"R2' D' (R U2 R' D) R U2 (R U R' U2) (R U R' U R)",
				"(R2 D R' U2 R D' R' U2 R') U' (R U2 R' U' R U' R')",
				"L' (R' U2 L U2) (R U' L' U) (R' U R U') L",
				"L (R U2' R' U2) (L' U R U') (L U' L' U) R'",
				"R' U' (R U' R' U2)2 R' D' (R U2 R' D) R2",
				"(R U R' U) (R U2' R' U) (R U2' R D) (R' U2 R D') R2",
				"F U R2' D' (R U' R' D) R2 F' (R' U R)",
				"(R' U' R F) R2' D' (R U R' D) R2 U' F'"
			]
		},
		'T': {
			0: "010111111100000100000", 1: "U' (R U R' U R U2' R') (L' U' L U' L' U2 L)",
			'T FB-light': [
				"111111111101101101101", "U' (R U R' U R U2' R') (L' U' L U' L' U2 L)",
				"(R U R' U R U2' R') (L' U' L U' L' U2 L)",
				"(R U' R' U2) (R U R' U2) (R U R' U) R U' R'",
				"(R U R' U R U2' R') U' (R U2' R' U' R U' R')",
				"(R U2' R' U' R U' R') U (R U R' U R U2' R')",
				"(R' U2 R U R' U R) U' (R' U' R U' R' U2 R)",
				"(R U R' U) (R U' R' U) R' U' R2 U' R2' U2' R",
				"(R' U' R U') (R' U R U') R U R2' U R2 U2' R'",
				"(R U2' R' U' R U' R') (R' U2' R U R' U R)",
				"(R' U2 R U R' U R) (R U2' R' U' R U' R')",
				"x' D (R U' R' D') R2 D2 (R' U R D2) R2' x",
				"(R' U' R2 U R2' U R2 U2') (R' U R' U R)",
				"(R U R2' U' R2 U' R2' U2') (R U' R U' R')"
			],
			'T LR-light': [
				"111111111101101101101", "U (R U' R2' D') (r U2 r' D) (R2 U' R' U') R U' R'",
				"(R U' R2' D') (r U2 r' D) (R2 U' R' U') R U' R'",
				"(R U R' F' R U R' U' R' F R) U' (R' F R U R U' R' F')",
				"(R U2' R' U) (L U' R U L2' U) R' U' L",
				"(R U' R2' D') (r U2 r' D) R2 U R'",
				"(R' U R2 D) (r' U2 r D') R2' U' R",
				"(R' U' R U) (R' U' R2 D) (R' U R D') R' U2 R' U R",
				"(R U R' U2) R' D' (R U R' D) (R2 U' R' U) R U' R'",
				"R' U' (R U2 R D) (R' U' R D') (R2' U R U') R' U R",
				"(R U R' U') (R U R2' D') (R U' R' D) (R U2 R U' R')",
				"R2' F (R U R' U') R' F' (R' U' R2 U2') R U2 R",
				"R2' F2 (R U2 R U2') R' F' (R U R' U') R' F' R2",
				"(R' U' R U' R' U2 R) (R U R' U) (L' U R U' L) U2 R'"
			],
			'T L-light': [
				"111111111101101101101", "U L (R U' R' U) L' (R U R' U) (R U R' U') R U' R'",
				"L (R U' R' U) L' (R U R' U) (R U R' U') R U' R'",
				"(r U R' U') (r' F R F')",
				"R' D' (R U R' D) (R2 U' R' U) (R U R' U') R U R'",
				"(R U2' R' U2) (R' F R U R U' R' F')",
				"(R U R D) (R' U2 R D') (R' U' R' U) (R U' R' U') R U' R'",
				"(R U R' U) (R U R' U2) L (R U' R' U) L'",
				"(R U R' U') (R U' R') (L U' R U R' L')",
				"L' U2 (R U2' R' U2) L U R U' R'",
				"L' (R U R' U') L U (R U R' U') R U' R'",
				"F (R U R' U') R' F' U2' (R U R U') R2' U2' R",
				"(R' U2 R U2') (R' U R U') (L U' R' U L' U R)",
				"(R U' R' U') (R U R D) (R' U2 R D') R' U' R'",
			],
			'T R-light': [
				"111111111101101101101", "R2' F2 (R U2' R U2') (R' F2 R U') R' U R",
				"R2' F2 (R U2' R U2') (R' F2 R U') R' U R",
				"(l' U' L U) (R U' r' F)",
				"F R2 D (R' U' R D') R2' U' (R U2 R' U') F'",
				"(R U R' U') R' F' (R U2 R U2') R' F",
				"(R' U2 R) F U' (R' U R U) F' (R' U R)",
				"R' U' (R U' R' U') R U2 L' (R' U R U') L",
				"F U (R U2 R' U) (R U R' F')",
				"(R' U' R U) (R' U R) L' (U R' U' R) L",
				"(R U R' U') (R U R2' D') (R U2 R' D) R U' R U' R'",
				"F (R U R' U')2 F' (R U R' U') (R' F R F')",
				"R' U2' (R2 U R' U') R' U2' F' (R U2 R U2') R' F",
				"R' U (R U R' U') R' D' (R U2 R' D) R U R",
			],
			'T F-light': [
				"111111111101101101101", "(R U R' U') (R' U L' U2) (R U' R' U2 L) R2 U' R'",
				"(R U R' U') (R' U L' U2) (R U' R' U2 L) R2 U' R'",
				"(R' U R U2') L' (R' U R U') L",
				"(R U R D) (R' U' R D') (R' U2 R' U') R U' R'",
				"(R U' R' U2) L (R U' R' U) L'",
				"(R' U L U' R U L') U (R U R' U R U2' R')",
				"(r U' r U2') (R' F R U2) r2' F",
				"(R U' R' U) (R U R' U')2 R' D' (R U' R' D) R",
				"(R U R' U) (R U' R' U') L' U2 (R U2' R' U2) L",
				"R' D' (R U R' D) R U (R U' R' U) (R U' R' U') R U R'",
				"L' U2 (R U2' R' U2) L U (R U R' U') R U' R'",
				"F (R U' R' U') (R U2 R' U') F' (R' U' R U' R' U2 R)",
				"(R' U2' R U R' U R) F U (R U2' R' U) (R U R' F')"
			],
			'T B-light': [
				"111111111101101101101", "U' x (R' U2 R' D2) (R U2 R') D2 R2 x'",
				"x (R' U2 R' D2) (R U2 R') D2 R2 x'",
				"x' (R U2 R D2) (R' U2 R) D2 R2' x",
				"(R U2 R D R' U2 R D' R2') U (R U2 R' U' R U' R')",
				"(R U2 R D) (R' U2 R D') (R U' R U') R' U2 R",
				"(R' U R2 D) (R' U R D') (R' U R' U') (R U' R' U') R",
				"(F R U R' U' R' F' R) U (F' R U R' U' R' F R2 U' R')",
				"R' D' (R U R' D) (R2 U R' U2) (R U' R' U') R U' R'",
				"(R U2' R') (L' U R U) (L U2 R' U') L' U L",
				"(R' U' R' D' R U R' D R2) (R' U' R U' R' U2 R)",
				"R' D' (R U R' D) R U2 (R U2' R' U R U R')",
				"R U2' (R2' U' R2 U') R' U2 (R' U R) L' U (R' U' R) L",
				"F (R U R' U') (R U' R' U') (R U R' F')"
			]
		},
		'L': {
			0: "011111110000100001000", 1: "U' (R U2' R' U2) (R' U' R U) (R U' R' U2) R' U2' R",
			'L Pure': [
				"111111111101101101101", "U' (R U2' R' U2) (R' U' R U) (R U' R' U2) R' U2' R",
				"(R U2' R' U2) (R' U' R U) (R U' R' U2) R' U2' R",
				"(R U R' U R U2' R') U2 (R U2' R' U' R U' R')",
				"(R U2' R' U' R U' R') U (R' U2' R U R' U R)",
				"(R' U2' R U R' U R) U' (R U2' R' U' R U' R')",
				"(R U R' U R U2' R') U (R' U' R U' R' U2 R)",
				"(R' U' R U' R' U2' R) U' (R U R' U R U2' R')",
				"R2 U (R' U R' U') (R U' R' U') (R U R U') R2'",
				"R2' U' (R U R U') (R' U' R U') (R' U R' U) R2",
				"R2' U' (R U' R U R' U) (R U R' U') R' U R2",
				"R2 U (R' U' R' U) (R U R' U) (R U' R U') R2",
				"(R U2 R' U') (R U R' U')2 R U' R'",
				"(R U2' R' U' R U' R') U2 (R U R' U R U2' R')"
			],
			'L Diagonal': [
				"111111111101101101101", "F (R U R' U') (R U' R' U2') (R U2 R' U') F'",
				"F (R U R' U') (R U' R' U2') (R U2 R' U') F'",
				"F (R U' R' U') (R U R D) (R' U' R D') (R' U2 R' U') F'",
				"r U2' (R2' F R F') R U2' r'",
				"L' U2 (R U' R' U2) L (R U' R')",
				"F (R U R' U') R' F (R2 U' R' U') (R U R' F2)",
				"(R U' R' U) (R U R' U) (R U' R2' D') (R U R' D) R",
				"(R' U' R U') (L U' R' U L') (R U R' U') (R U R' U R)",
				"(R U R' U) (L' U R U' L) R' U' (R U R' U') (R U' R')",
				"(R U2' R' U') L' U2 (R U R') (L U L' U L)",
				"(L' U2 L U) R U2 (L' U' L) (R' U' R U' R')",
				"r U2' (r2' F R F') r2 R' U2 r'",
				"r U2 R (r2' F R' F') r2 U2' r'"
			],
			'L R-light': [
				"111111111101101101101", "U2 F' (r U R' U') (r' F R)",
				"F' (r U R' U') (r' F R)",
				"(R' U' R U) R' F2 (R U2 R' U2) R' F2 R2",
				"(L' U L U2) R' (L' U L U) R (U R' U R)",
				"(R U R' U') (L U2 L' U' L U') (R U' R' U) L'",
				"F (R U' R' U') (R U2 R' U') F'",
				"(R U R' U2) L U' (R U' R' U) (R U2' R') L'",
				"L' (R' U R U') L (R' U' R U') R' U R",
				"F' (R U2' R' U2) R' F (R U R U' R')",
				"(R U R' U) R' D' (R U2 R' D) R2 U' (R' U R U' R')",
				"(R U L' U) (R' U' L U') (R U R' U2') R U2' R'",
				"(R' U' R' D') (R U2 R' D) (R U R U') R' U' R",
				"F' (R U2' R' U2) R' F U2' (R U R U') R2' U2' R",
			],
			'L B-light': [
				"111111111101101101101", "(R U R' U) (R U' R' U') (R U' R') L (U' R U R') L'",
				"(R U R' U) (R U' R' U') (R U' R') L (U' R U R') L'",
				"(F R' F' r) (U R U' r')",
				"L U' (R U R') L' U2 (R U' R' U') R U' R'",
				"(R U R' U) (R U R' U') (R U R D) (R' U2 R D') R' U' R'",
				"(R U R' U') L' U2 (R U2' R' U2) L",
				"F (R U R' U') R' F' (R U2 R U2') R'",
				"(R U' R' U) (R U' R' U') R U R2' (D' R U' R' D) R",
				"L (R U' R' U) L' (R U R' U) R U' R'",
				"(R U R' U) (R U' R' U') (L' U R U') R' L",
				"R' U' (R U' R' U)2 (R U' R2' D') (R U2 R' D) R2",
				"(R U R D) (R' U2 R D') (R' U' R' U) R U R'",
				"(R' U2' R2 U) (R' U' R' U2') F (R U R U') R' F'",
			],
			'L F-Comm': [
				"111111111101101101101", "U (R U2 R D) (r' U2 r D') R2",
				"(R U2 R D) (r' U2 r D') R2",
				"(R U2 R D) (R' U2 R D') R2",
				"(R' U' R U) (R' U R U') (L U' R' U) (L' U R)",
				"(R U2' R2' D') (R U' R' D) R2 U' R'",
				"(L' U R U' L U R') (R' U2' R U R' U R)",
				"(R' U' R U2)2 y (R U2' R' U R U R')",
				"(R' U2 R U R' U R) (L' U R U' L U R')",
				"(R U2' R' U2) (R U R2' D') (R U2 R' D) R2 U2' R'",
				"F (R U R' U') R' F' U' R U (R U' R' U') R' U R",
				"(R' U R' D') (R U R' U2') (R U R' U) (D R U' R)",
				"(L U' R U L' U') (R' U R U')2 (R' U' R U R')",
				"(R U2' R' U) (L' U2 R U2') (L U R' U) (L' U L)"
			],
			'L B-Comm': [
				"111111111101101101101", "(R' U2 R' D') (r U2 r' D) R2",
				"(R' U2 R' D') (r U2 r' D) R2",
				"(R' U2 R' D') (R U2 R' D) R2",
				"(L U' R' U L' U' R) (R U2' R' U' R U' R')",
				"(R U R' U') (R U' R' U) (L' U R U' L U' R')",
				"(R U R' U2)2 y' (R' U2 R U' R' U' R)",
				"(R' U2' R2 D) (R' U R D') R2 U R",
				"(R U2' R' U' R U' R') (L U' R' U L' U' R)",
				"(R' U2 R U2') (R' U' R2 D) (R' U2 R D') R2' U2' R",
				"(R' U2' R U R' U R) (R U2' R' U2) L' (U R U' R') L",
				"(R U' R D) (R' U' R U2') (R' U' R U'D') R' U R'",
				"(L' U R' U' L U) (R U' R' U)2 R U R' U' R",
				"L (R' U' R U) L' U' (R' U' R U) (R' U' R U) R' U R"
			]
		},
		'H': {
			0: "010111010101000101000", 1: "U (R' U2' R U R' U R) U (R U R' U R U2 R')",
			'H FB-light': [
				"111111111101101101101", "U (R' U2' R U R' U R) U (R U R' U R U2 R')",
				"(R' U2' R U R' U R) U (R U R' U R U2 R')",
				"(R U2' R' U' R U' R') U' (R' U' R U' R' U2 R)",
				"(R U2 R' U') (R U R' U') R U' R'",
				"R' U2' (R U R' U') (R U R' U R)",
				"(R U R' U) (R U' R' U) R U2' R'",
				"(R' U' R U') (R' U R U') R' U2 R",
				"(R U R' U) (R U' R' U)2 R' U' R2 U' R' U R' U R",
				"(R' U' R U' R' U2 R) U (R U2' R' U' R U' R')"
			],
			'H LR-light': [
				"111111111101101101101", "(R U' L' U R' U' L)2",
				"(R U' L' U R' U' L)2",
				"F U' R2 U (R U2' R' U) R2 U2' (R' U' R F')",
				"F R' U (R U2' R2' U') (R U2 R' U') R2 U F'",
				"F (R U R' U')3 F'",
				"(R U R' U R U2' R') L' U2 (R U' R' U2) L R U' R'",
				"(R' U' R U' R' U2 R) U (R' U' R) L U2 (R' U' R) U2 L'",
				"(U2) (R U R' U R U2' R2') U2' (L U' R U L' U) R' U R",
				"(U2) (R' U' R U' R' U2 R2) U2' (L' U R' U' L U') R U' R'"
			],
			'H F-light': [
				"111111111101101101101", "U' (F' r U R' U' r' F R) (R U2' R' U' R U' R')",
				"(F' r U R' U' r' F R) (R U2' R' U' R U' R')",
				"(R U R' U R U2 R') U' (R2 D R' U R D' R' U' R')",
				"F (R U R' U') R' F' U2' (R U R' U) R2 U2' R'",
				"F U' (R U2' R' U2) (R U' R' U') (R U R' U) F'",
				"R U2' (R2' U' R2 U') R' U' (L' U R' U' L U' R)",
				"(R U2' R' U) L' U2 (R U2' R' U2) L (R U' R')",
				"(R' U2 R U') L U2 (R' U2' R U2) L' (R' U R)",
				"F (R U' R' U) (R U2 R' U') (R U R' U') F'",
				"(R U2' R' U' R U' R') (R2 D' R U' R' D R U R)",
				"(R' U2' R U R' U R) (R2 D R' U R D' R' U' R')",
				"(R' U2 R) L U2 (R' U R U2') L' U R' U R",
				"(R U2' R') L' U2 (R U' R' U2) L U' (R U' R')"
			],
			'H R-light': [
				"111111111101101101101", "U (R U R' U R U2' R') F (R U' R' U') (R U2' R' U') F'",
				"(R U R' U R U2' R') F (R U' R' U') (R U2' R' U') F'",
				"(R U R' U R U2 R') (R2' D' R U' R' D R U R)",
				"(R U2 R' U' R U' R') U (L' U R U' L U R')",
				"(R U2 R' U') R2 D (R' U R D') R2' U' R U' R'",
				"(R U2 R D) R2' D2 (R U' R' D2) (R U' R D') R2",
				"(R' U2 R U) R2' D' (R U' R' D) R2 U R' U R",
				"R' D' (R U R' D) (R2 U R' U2) (R U2' R' U) R U2' R'",
				"(R' U' R U' R' U') (L U' R U L')",
				"(R U R' U R U) (L' U R' U' L)",
				"(R U R' U') (R' U2' R2 D) (R' U R D') R2' U R2 U2' R'",
				"R2 D (R' U R D') (R2' U R2 D) (R' U2 R D') R2",
				"R2' D' (R U' R' D) (R2 U' R2' D') (R U2 R') D R2"
			]
		},
		'Pi': {
			0: "010111010101001000001", 1: "U (R U R' U R U2' R') (R' U2' R U R' U R)",
			'Pi R-light': [
				"111111111101101101101", "U (R U R' U R U2' R') (R' U2' R U R' U R)",
				"(R U R' U R U2' R') (R' U2' R U R' U R)",
				"(R U2' R' U' R U' R') (R' U' R U' R' U2' R)",
				"(R U2' R' U' R U' R') U (R U2' R' U' R U' R')",
				"(R' U' R U' R' U2 R) U (R' U' R U' R' U2 R)",
				"(R U2' R' U2) (R U' R' U2)2 R U R'",
				"(R' U2 R U2') (R' U R U2')2 R' U' R",
				"(R U' R' U2) (R U R' U2')2 R U2' R'",
				"(R' U R U2') (R' U' R U2')2 R' U2 R",
				"R U2' R2' U' R2 U' R2' U2' R",
				"R' U2' R2 U R2' U R2 U2' R'",
				"(R U2' R' U' R U' R') U' (R U2' R' U' R U' R')",
				"F (R U R' U')2 F' (R U R' U' M' U R U' r')"
			],
			'Pi L-light': [
				"111111111101101101101", "U2 F (R2 U' R U2) (R U R' U) (R' U R2 F')",
				"F (R2 U' R U2) (R U R' U) (R' U R2 F')",
				"F (R2' U' R U') (R U' R' U2) (R' U R2 F')",
				"R U2' R' x (R' U R U')3 x' R U2' R'",
				"F U (R' U' R2 U') (R2' U2' R U2) (R U R' F')",
				"(R U2 R' U') F' (R U2 R' U') (R U' R' F) R U' R'",
				"(R U R' F') (R U R' U) (R U2 R' F) (U R U2 R')",
				"(R' U2' R2 U) (R U R2' D') (R U' R' U'D) R'",
				"(R U R' U') (R U R2' D') (R U' R' D) (R U' R U2 R')",
				"R UD' (R U R' D) (R2 U' R' U') R2' U2' R",
				"(R U2' R' U) R' D' (R U R' D) R2 U' (R' U R U' R')",
				"(R U R' U) (R U R' U') (R U R D) (R' U R D') R2'",
				"R2' D' (R U R' D) R U (R U' R' U) (R U R' U R)"
			],
			'Pi /': [
				"111111111101101101101", "U2 (L' U R U' L U R') U (L' U R U' L U R')",
				"(L' U R U' L U R') U (L' U R U' L U R')",
				"(R U R' U') (R' U2' R U2) R' D' (R U' R' UD) R2 U2' R'",
				"R' F (R U R' U') R' F' (R2 U' R' U) (R U' R' U2 R)",
				"F' (R U R' U') (R' F R U') (R U' R' U') (R U R' U) R U R'",
				"(R U' L' U R' U' L) U (R' U2' R U R' U R)",
				"(L U' R' U L' U' R) (R U R' U R U2' R')",
				"(R U R' U R U2' R') U' (R U' L' U R' U' L)",
				"(R' U2' R U R' U R) (R U' L' U R' U' L)",
				"(R U R' U') R' F (R2 U R' U') (R U R' U') F'",
				"(R U2' R' U') (R U R' U') R' D' (R U' R' D) (R2 U' R' U) R U' R'",
				"L (R' U' R U) L' U2 (R' U R U') R' U2' R",
				"(R U R D) (R' U R D') R2' U' (R U R' U') (R U' R')"
			],
			'Pi \\': [
				"111111111101101101101", "(R U' L' U R' U' L) U' (R U' L' U R' U' L)",
				"(R U' L' U R' U' L) U' (R U' L' U R' U' L)",
				"(R' U' R U) (R U2' R' U2) R D (R' U R U'D') R2' U2' R",
				"(R' U2 R U R' U') (R U R2' F) (R U R U') R' F' R",
				"(R U' R' U') (R U' R' U) (R U R' U) R' F' (R U R U') R' F",
				"(L' U R U' L U R') U (R U2' R' U' R U' R')",
				"(L' U R U' L U R') (R' U' R U' R' U2 R)",
				"(R' U' R U' R' U2 R) U' (L' U R U' L U R')",
				"(R U2' R' U' R U' R') (R' U L U' R U L')",
				"(R U R' U') (R U R2' D') (R U R' D) (R U R U') (R' U R U2' R')",
				"F U (R U' R' U) (R U' R2' F') (R U R U' R')",
				"R' U2' (R U R' U') R U2 L (U' R' U R) L'",
				"L' (R U R' U') L U2 (R U' R' U) R U2' R'"
			],
			'Pi X': [
				"111111111101101101101", "U2 (R U2' R' U' R U' R') U (r U R' U') (r' F R F')",
				"(R U2' R' U' R U' R') U (r U R' U') (r' F R F')",
				"(R' U' R U' R' U2 R) U2 (r U R' U' r' F R F')",
				"R2' F (R U R U') R' F' (R U' R' U') (R U R' U R)",
				"(R U R' F') U' (R U2' R2' U') (R U' R' U2') (F R2 U' R')",
				"(R U R') L' U2 (R U2' R' U2) L U' (R U2' R')",
				"F U' (R U' R' U) (R U R' U2) (R U2' R' U) F'",
				"(R' U L' U R U' L) U (R U R2' U R2 U2' R')",
				"(R U R' U) L' U2 (R U R' U2) L R U2' R'",
				"(R' U' R U') L U2 (R' U' R U2) L' R' U2' R",
				"F U (R U' R' U) (R U2' R' U') (R U R' F')",
				"(R U R' U R U2' R') U2' (R2 D R' U2 R D' R' U2 R')",
				"(R U R D R' U' R D' R2') (R' U' R U' R' U2 R)"
			],
			'Pi LR-light': [
				"111111111101101101101", "U' F U (R U2 R' U) (R U R' F') (R U2' R' U' R U' R')",
				"F U (R U2 R' U) (R U R' F') (R U2' R' U' R U' R')",
				"(R' U' R' D' R U R' D R2) (R U2 R' U' R U' R')",
				"(R U' L' U R' U' L) U' (R U R' U R U2' R')",
				"(R' U' R U') R2' D' (R U R' D) R2 U' (R' U2 R)",
				"(R U R' U) R2 D (R' U' R D') R2' U (R U2 R')",
				"(R U2' R' U') (R U2' R' U2) (R U' R2' D') (R U' R' D) R",
				"R2 D (R' U R' D2) (R U R' D2) R2 D' (R' U2 R')",
				"(L' U R U' L U') (R' U' R U' R')",
				"(R U R' U) F' (R U2' R' U2) R' F R",
				"(R U2 R' U') R U (L' U2 L U2) R' U' (L' U L)",
				"R2' D' (R U2 R' D) (R2 U R2' D') (R U R' D) R2",
				"R2 D (R' U2 R D') (R2' U' R2 D) (R' U' R D') R2"
			]
		}
	}
};

function loadAlgs(obj, depth = 0) {
	let arr = [];
	for (let key in obj) {
		if (key == 0 || key == 1) continue;
		let group = document.createElement('div');
		let members = document.createElement('div');
		group.classList.add('alg_group');
		members.classList.add('alg_members', 'hidden');
		
		let svg = create_alg_svg(obj[key][1], obj[key][0]).svg;
		let name = document.createElement('span');
		name.textContent = key;
		let arrow = document.createElement('span');
		arrow.textContent = '▶';
		group.append(svg, name, arrow);
		
		group.onclick = () => {
			members.classList.toggle('hidden');
			arrow.textContent = members.classList.contains('hidden') ? '▶' : '▼';
			if (!members.shown) {
				if (Array.isArray(obj[key])) {
					for (let i = 2; i < obj[key].length; i++) {
						let alg_svg = create_alg_svg(obj[key][i]);
						members.appendChild(alg_svg.svg);
						members.lastElementChild.addEventListener('click', alg_svg.click);
					}
				}
				else {
					members.append(...loadAlgs(obj[key], depth + 1));
				}
			}
			members.shown = true;
		};
		arr.push(group, members);
		group.style.fontSize = Math.floor(35 * (1 - 0.2 * depth)) + 'px';
		group.style.paddingLeft = depth * 20 + 'px';
	}
	return arr;
}
algs_container.append(...loadAlgs(alg_sets));

function create_alg_svg(alg, rest) {
	let alg0 = alg;
	alg = alg.replace(/\(([^)]+)\)(\d+)?/g, (_, g, n) => (g + " ").repeat(n || 1).trim());
	let cube_map = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[2, 2, 2, 2, 2, 2, 2, 2, 2],
		[3, 3, 3, 3, 3, 3, 3, 3, 3],
		[4, 4, 4, 4, 4, 4, 4, 4, 4],
		[5, 5, 5, 5, 5, 5, 5, 5, 5],
		[6, 6, 6, 6, 6, 6, 6, 6, 6]
	];
	let map_cycles = {
		U: [[[0, 0], [0, 2], [0, 8], [0, 6]], [[0, 1], [0, 5], [0, 7], [0, 3]], [[1, 0], [4, 0], [3, 0], [2, 0]], [[1, 1], [4, 1], [3, 1], [2, 1]], [[1, 2], [4, 2], [3, 2], [2, 2]]],
		D: [[[5, 0], [5, 2], [5, 8], [5, 6]], [[5, 1], [5, 5], [5, 7], [5, 3]], [[1, 6], [2, 6], [3, 6], [4, 6]], [[1, 7], [2, 7], [3, 7], [4, 7]], [[1, 8], [2, 8], [3, 8], [4, 8]]],
		F: [[[2, 0], [2, 2], [2, 8], [2, 6]], [[2, 1], [2, 5], [2, 7], [2, 3]], [[0, 6], [3, 0], [5, 2], [1, 8]], [[0, 7], [3, 3], [5, 1], [1, 5]], [[0, 8], [3, 6], [5, 0], [1, 2]]],
		B: [[[4, 0], [4, 2], [4, 8], [4, 6]], [[4, 1], [4, 5], [4, 7], [4, 3]], [[0, 0], [1, 6], [5, 8], [3, 2]], [[0, 1], [1, 3], [5, 7], [3, 5]], [[0, 2], [1, 0], [5, 6], [3, 8]]],
		L: [[[1, 0], [1, 2], [1, 8], [1, 6]], [[1, 1], [1, 5], [1, 7], [1, 3]], [[0, 0], [2, 0], [5, 0], [4, 8]], [[0, 3], [2, 3], [5, 3], [4, 5]], [[0, 6], [2, 6], [5, 6], [4, 2]]],
		R: [[[3, 0], [3, 2], [3, 8], [3, 6]], [[3, 1], [3, 5], [3, 7], [3, 3]], [[0, 2], [4, 6], [5, 2], [2, 2]], [[0, 5], [4, 3], [5, 5], [2, 5]], [[0, 8], [4, 0], [5, 8], [2, 8]]],
		u: [[[0, 0], [0, 2], [0, 8], [0, 6]], [[0, 1], [0, 5], [0, 7], [0, 3]], [[1, 0], [4, 0], [3, 0], [2, 0]], [[1, 1], [4, 1], [3, 1], [2, 1]], [[1, 2], [4, 2], [3, 2], [2, 2]],
				[[1, 3], [4, 3], [3, 3], [2, 3]], [[1, 4], [4, 4], [3, 4], [2, 4]], [[1, 5], [4, 5], [3, 5], [2, 5]],
		],
		d: [[[5, 0], [5, 2], [5, 8], [5, 6]], [[5, 1], [5, 5], [5, 7], [5, 3]], [[1, 6], [2, 6], [3, 6], [4, 6]], [[1, 7], [2, 7], [3, 7], [4, 7]], [[1, 8], [2, 8], [3, 8], [4, 8]],
				[[1, 3], [2, 3], [3, 3], [4, 3]], [[1, 4], [2, 4], [3, 4], [4, 4]], [[1, 5], [2, 5], [3, 5], [4, 5]],
		],
		f: [[[2, 0], [2, 2], [2, 8], [2, 6]], [[2, 1], [2, 5], [2, 7], [2, 3]], [[0, 6], [3, 0], [5, 2], [1, 8]], [[0, 7], [3, 3], [5, 1], [1, 5]], [[0, 8], [3, 6], [5, 0], [1, 2]],
				[[0, 3], [3, 1], [5, 5], [1, 7]], [[0, 4], [3, 4], [5, 4], [1, 4]], [[0, 5], [3, 7], [5, 3], [1, 1]],
		],
		b: [[[4, 0], [4, 2], [4, 8], [4, 6]], [[4, 1], [4, 5], [4, 7], [4, 3]], [[0, 0], [1, 6], [5, 8], [3, 2]], [[0, 1], [1, 3], [5, 7], [3, 5]], [[0, 2], [1, 0], [5, 6], [3, 8]],
				[[0, 3], [1, 7], [5, 5], [3, 1]], [[0, 4], [1, 4], [5, 4], [3, 4]], [[0, 5], [1, 1], [5, 3], [3, 7]],
		],
		l: [[[1, 0], [1, 2], [1, 8], [1, 6]], [[1, 1], [1, 5], [1, 7], [1, 3]], [[0, 0], [2, 0], [5, 0], [4, 8]], [[0, 3], [2, 3], [5, 3], [4, 5]], [[0, 6], [2, 6], [5, 6], [4, 2]],
				[[0, 1], [2, 1], [5, 1], [4, 7]], [[0, 4], [2, 4], [5, 4], [4, 4]], [[0, 7], [2, 7], [5, 7], [4, 1]],
		],
		r: [[[3, 0], [3, 2], [3, 8], [3, 6]], [[3, 1], [3, 5], [3, 7], [3, 3]], [[0, 2], [4, 6], [5, 2], [2, 2]], [[0, 5], [4, 3], [5, 5], [2, 5]], [[0, 8], [4, 0], [5, 8], [2, 8]],
				[[0, 1], [4, 7], [5, 1], [2, 1]], [[0, 4], [4, 4], [5, 4], [2, 4]], [[0, 7], [4, 1], [5, 7], [2, 7]],
		],
		M: [[[0, 1], [2, 1], [5, 1], [4, 7]], [[0, 4], [2, 4], [5, 4], [4, 4]], [[0, 7], [2, 7], [5, 7], [4, 1]]],
		E: [[[1, 3], [2, 3], [3, 3], [4, 3]], [[1, 4], [2, 4], [3, 4], [4, 4]], [[1, 5], [2, 5], [3, 5], [4, 5]]],
		S: [[[0, 3], [3, 1], [5, 5], [1, 7]], [[0, 4], [3, 4], [5, 4], [1, 4]], [[0, 5], [3, 7], [5, 3], [1, 1]]],
		x: [[[3, 0], [3, 2], [3, 8], [3, 6]], [[3, 1], [3, 5], [3, 7], [3, 3]], [[0, 2], [4, 6], [5, 2], [2, 2]], [[0, 5], [4, 3], [5, 5], [2, 5]], [[0, 8], [4, 0], [5, 8], [2, 8]],
				[[0, 1], [4, 7], [5, 1], [2, 1]], [[0, 4], [4, 4], [5, 4], [2, 4]], [[0, 7], [4, 1], [5, 7], [2, 7]],
				[[1, 0], [1, 6], [1, 8], [1, 2]], [[1, 1], [1, 3], [1, 7], [1, 5]], [[0, 0], [4, 8], [5, 0], [2, 0]], [[0, 3], [4, 5], [5, 3], [2, 3]], [[0, 6], [4, 2], [5, 6], [2, 6]]
		],
		y: [[[0, 0], [0, 2], [0, 8], [0, 6]], [[0, 1], [0, 5], [0, 7], [0, 3]], [[1, 0], [4, 0], [3, 0], [2, 0]], [[1, 1], [4, 1], [3, 1], [2, 1]], [[1, 2], [4, 2], [3, 2], [2, 2]],
				[[1, 3], [4, 3], [3, 3], [2, 3]], [[1, 4], [4, 4], [3, 4], [2, 4]], [[1, 5], [4, 5], [3, 5], [2, 5]],
				[[5, 0], [5, 6], [5, 8], [5, 2]], [[5, 1], [5, 3], [5, 7], [5, 5]], [[1, 6], [4, 6], [3, 6], [2, 6]], [[1, 7], [4, 7], [3, 7], [2, 7]], [[1, 8], [4, 8], [3, 8], [2, 8]]
		],
		z: [[[2, 0], [2, 2], [2, 8], [2, 6]], [[2, 1], [2, 5], [2, 7], [2, 3]], [[0, 6], [3, 0], [5, 2], [1, 8]], [[0, 7], [3, 3], [5, 1], [1, 5]], [[0, 8], [3, 6], [5, 0], [1, 2]],
				[[0, 3], [3, 1], [5, 5], [1, 7]], [[0, 4], [3, 4], [5, 4], [1, 4]], [[0, 5], [3, 7], [5, 3], [1, 1]],
				[[4, 0], [4, 6], [4, 8], [4, 2]], [[4, 1], [4, 3], [4, 7], [4, 5]], [[0, 0], [3, 2], [5, 8], [1, 6]], [[0, 1], [3, 5], [5, 7], [1, 3]], [[0, 2], [3, 8], [5, 6], [1, 0]]
		]
	};
	let turnMap = move => {
		if (move.length == 0) return;
		let swap = (si1, sq1, si2, sq2) => [cube_map[si1][sq1], cube_map[si2][sq2]] = [cube_map[si2][sq2], cube_map[si1][sq1]];
		map_cycles[move[0]].forEach(e => {
			let swaps = [
				[e[0][0], e[0][1], e[1][0], e[1][1]],
				[e[0][0], e[0][1], e[2][0], e[2][1]],
				[e[0][0], e[0][1], e[3][0], e[3][1]]
			];
			if (move[move.length - 1] === "'") swaps.reverse();
			for (let i = 0; i < (Number(move[1]) || 1); i++) swaps.forEach(s => swap(...s));
		});
	}
	let move_split = move => {
		let move_i = [];
		move.split('').forEach((c, i, a) => (/[a-zA-Z]/g).test(c) && move_i.push(i));
		return move_i.map((m, i, a) => move.substring(m, a[i + 1]));
	};
	let anti = move => {
		if (move.length == 0) return '';
		let moves = move_split(move);
		return moves.map(move => {
			return (move[move.length - 1] === "'") ? move.substring(0, move.length - 1) : move + "'";
		}).join('')
	};
	let alg1 = ['z2', ...alg.split(' ').reverse().map(anti)];
	alg1.forEach(move => {
		move_split(move).forEach(turnMap);
	});
	let stickerPositions = [
		[0, 0], [0, 1], [0, 2],
		[0, 3], [0, 4], [0, 5],
		[0, 6], [0, 7], [0, 8],
		[1, 0], [1, 1], [1, 2],
		[4, 2], [4, 1], [4, 0],
		[3, 2], [3, 1], [3, 0],
		[2, 0], [2, 1], [2, 2]
	];
	let colors = objs.colors.map(c => 'rgb(' + c.join(',') + ')');
	
	let clone = alg_svg_template.content.cloneNode(true);
	let stickers = clone.querySelectorAll('.sticker');
	stickers.forEach((sticker, i) => {
		let map_color = cube_map[stickerPositions[i][0]][stickerPositions[i][1]];
		let fill = rest ? (rest[i] == '1') : true;
		sticker.setAttribute('fill', fill ? colors[map_color] : "#404040");
	});
	return { svg: clone, click: () => {
		if (Rubik.dim != 3) return;
		animate_start(alg1.join(' '), alg, alg0);
		toggleAlgs();
	} };
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

const version = 'v 0502';

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