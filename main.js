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
	S: ["URS,DRS,DLS,ULS", "UMS,RSE,DMS,LSE"]
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

let turning = false;
const turn = {
	angle: 0,
	speed: 20,
	soundAllowed: audioAllow,
	sound: new Audio(),
};
turn.sound.src = `assets/turn.mp3`;

let scrambling = false;
const st = {};
const pos = { z: 22 };
let scale = 1;

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
	if (turning) {
		turn.angle += turn.speed;
		turnS(turn.speed);
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
				Cf(C[0].split(","));
				Cf(C[1].split(","));
				Rubik.pieces.forEach(e => {
					e.turning = false;
					e.pieceId = e.pieceIdN;
				});
			}
		}
	}

	Rubik.draw();
}

function fc(id) {
	return Rubik.pieces.find(e => e.pieceId == id);
}

function Turn(side) {
	if (turning || side.length == 0) return;
	Rubik.pieces.forEach(e => e.turning = e.pieceId.split("").find(e => e == side[0]));
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
		S: "FME"
	} [side[0]]);
	turn.times = Number(side[1]) || 1;
	if (turn.soundAllowed.checked) {
		turn.sound.play();
		turn.sound.currentTime = 0.14;
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

function generateScramble(length = 20) {
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
	let scramble = generateScramble().split(" ");
	let t = turn.speed;
	turn.speed = 40;
	let i = 0;
	let r = () => {
		Turn(scramble[i]);
		i++;
		setTimeout((i < scramble.length) ? r : (() => {
			turn.speed = t;
			scrambling = false;
		}), 100);
	};
	r();
}
