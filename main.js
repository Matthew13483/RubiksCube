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

let turning = false;
const turn = {
	angle: 0,
	speed: 15,
};

let touching = false;

const rotateI = { x: 0, y: 0 };

const sound = new Audio();
sound.src = `assets/turn.mp3`;
let soundAllowed = false;

let scrambling = false;
let scramble;
let scrambleIndex = 0;

let sT = [];
const pos = { z: 22 };
let scale = 1;

function toggleSound() {
	soundAllowed = !soundAllowed;
	button_allowAudio.innerHTML = soundAllowed ? '<path d="M14.016 3.234C18.047 4.125 21 7.734 21 12s-2.953 7.875-6.984 8.766v-2.063c2.906-.844 4.969-3.516 4.969-6.703s-2.063-5.859-4.969-6.703V3.234zM16.5 12a4.451 4.451 0 0 1-2.484 4.031V7.968c1.5.75 2.484 2.25 2.484 4.031zM3 9h3.984L12 3.984v16.031l-5.016-5.016H3v-6z"/>' : '<path d="M12 3.984v4.219L9.891 6.094zM4.266 3L21 19.734 19.734 21l-2.063-2.063c-1.078.844-2.297 1.5-3.656 1.828v-2.063c.844-.234 1.594-.656 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016H2.999v-6h4.734L2.999 4.264zm14.718 9c0-3.188-2.063-5.859-4.969-6.703V3.234c4.031.891 6.984 4.5 6.984 8.766a8.87 8.87 0 0 1-1.031 4.172l-1.5-1.547A6.901 6.901 0 0 0 18.984 12zM16.5 12c0 .234 0 .422-.047.609l-2.438-2.438V7.968c1.5.75 2.484 2.25 2.484 4.031z"/>';
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
	if (turning) {
		speed = !scrambling ? turn.speed : 40;
		turnS(speed);
		if (turn.angle > 90) {
			turnS(90 - turn.angle);
			turn.angle = 0;
			turning = false;
			for (let i = 0; i < turn.times; i++) {
				let C = cycles[turn.face];
				let Cf = e => {
					if (turn.clockwise) {
						fc(e[0]).pieceIdN = e[1];
						fc(e[1]).pieceIdN = e[2];
						fc(e[2]).pieceIdN = e[3];
						fc(e[3]).pieceIdN = e[0];
					}
					else {
						fc(e[0]).pieceIdN = e[3];
						fc(e[1]).pieceIdN = e[0];
						fc(e[2]).pieceIdN = e[1];
						fc(e[3]).pieceIdN = e[2];
					}
				};
				C.forEach(e => Cf(e.split(",")));
				Rubik.pieces.forEach(e => {
					e.turning = false;
					e.pieceId = e.pieceIdN;
				});
			}
			if (scrambling) {
				if (scrambleIndex < scramble.length - 1) {
					scrambleIndex++;
					Turn(scramble[scrambleIndex]);
				}
				else scrambling = false;
			}
		}
	}
	if (!touching) Rubik.rotateCube(rotateI.x, rotateI.y);
	rotateI.x *= 0.8;
	rotateI.y *= 0.8;
	Rubik.draw();
}

function fc(id) {
	return Rubik.pieces.find(e => e.pieceId == id);
}

function Turn(side) {
	if (turning || side.length == 0) return;
	Rubik.pieces.forEach(e => e.turning = (e.pieceId + "xyz").split("").find(e => e == side[0]));
	turning = true;
	turn.face = side[0];
	turn.clockwise = side[side.length - 1] !== "'";
	turn.piece = fc({
		U: "UMS",
		D: "DMS",
		F: "FME",
		B: "BME",
		L: "LSE",
		R: "RSE",
		M: "LSE",
		E: "DMS",
		S: "FME",
		x: "RSE",
		y: "UMS",
		z: "FME"
	} [side[0]]);
	turn.times = Number(side[1]) || 1;
	if (soundAllowed) {
		sound.play();
		sound.currentTime = 0.14;
	}
}

function Turn2(side) {
	let e = Rubik.pieces.find(e => e.pieceIdO == {
		U: "UMS",
		D: "DMS",
		F: "FME",
		B: "BME",
		L: "LSE",
		R: "RSE",
		M: "LSE",
		E: "DMS",
		S: "FME"
	} [side[0]]);
	Turn(e.pieceId[0]);
}

function turnS(a) {
	turn.angle += a;
	Rubik.pieces.forEach(c => {
		if (c.turning) {
			let a1 = Math.atan2(turn.piece.z, turn.piece.y);
			let tP2 = rotateX(turn.piece, origin, a1);
			let a2 = Math.atan2(tP2.x, tP2.y);
			let rf = (p) => {
				p = rotateX(p, origin, a1);
				p = rotateZ(p, origin, a2);
				p = rotateY(p, origin, turn.times * (turn.clockwise ? 1 : -1) * (a * Math.PI / 180));
				p = rotateZ(p, origin, -a2);
				p = rotateX(p, origin, -a1);
				return p;
			};
			Object.assign(c, rf(c));
			c.geometry.forEach(e => e.points.forEach(p => Object.assign(p, rf(p))));
		}
	});
}

function generateScramble(length = 21) {
	let getRandomI = arr => Math.floor(Math.random() * arr.length);
	let p_axis = [["R", "L"], ["U", "D"], ["F", "B"]];
	let p_symbol = ["", "'", "2"];
	let scr = [];
	for (let i = 0; i < length; i++) {
		let avail_axis = [0, 1, 2];
		let avail_dir = [0, 1];
		if (scr.length > 1 && scr[scr.length - 1].axis == scr[scr.length - 2].axis) {
			avail_axis.splice(scr[scr.length - 1].axis, 1);
		}
		let axis = avail_axis[getRandomI(avail_axis)];
		if (scr.length > 0 && scr[scr.length - 1].axis == axis) {
			avail_dir.splice(scr[scr.length - 1].dir, 1);
		}
		let dir = avail_dir[getRandomI(avail_dir)];
		let symbol = getRandomI(p_symbol);
		scr.push({ axis, dir, symbol });
	}
	return scr.map(e => p_axis[e.axis][e.dir] + p_symbol[e.symbol]).join(" ");
}

function Scramble() {
	if (scrambling) return;
	scrambling = true;
	scramble = generateScramble().split(" ");
	scrambleIndex = 0;
	Turn(scramble[0]);
}
