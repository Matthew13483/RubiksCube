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

const sound = new Audio();
sound.src = `assets/turn.mp3`;
let soundAllowed = false;

let sT = [];
const pos = { z: 22 };
let scale = 1;

function toggleSound() {
	soundAllowed = !soundAllowed;
	button_allowAudio.innerHTML = soundAllowed ? '<path d="M14.016 3.234C18.047 4.125 21 7.734 21 12s-2.953 7.875-6.984 8.766v-2.063c2.906-.844 4.969-3.516 4.969-6.703s-2.063-5.859-4.969-6.703V3.234zM16.5 12a4.451 4.451 0 0 1-2.484 4.031V7.968c1.5.75 2.484 2.25 2.484 4.031zM3 9h3.984L12 3.984v16.031l-5.016-5.016H3v-6z"/>' : '<path d="M12 3.984v4.219L9.891 6.094zM4.266 3L21 19.734 19.734 21l-2.063-2.063c-1.078.844-2.297 1.5-3.656 1.828v-2.063c.844-.234 1.594-.656 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016H2.999v-6h4.734L2.999 4.264zm14.718 9c0-3.188-2.063-5.859-4.969-6.703V3.234c4.031.891 6.984 4.5 6.984 8.766a8.87 8.87 0 0 1-1.031 4.172l-1.5-1.547A6.901 6.901 0 0 0 18.984 12zM16.5 12c0 .234 0 .422-.047.609l-2.438-2.438V7.968c1.5.75 2.484 2.25 2.484 4.031z"/>';
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

function turnS(a) {
	Rubik.turn.angle += a;
	Rubik.pieces.forEach(c => {
		if (c.turning) {
			let a1 = Math.atan2(Rubik.turn.piece.z, Rubik.turn.piece.y);
			let tP2 = rotateX(Rubik.turn.piece, origin, a1);
			let a2 = Math.atan2(tP2.x, tP2.y);
			let rf = (p) => {
				p = rotateX(p, origin, a1);
				p = rotateZ(p, origin, a2);
				p = rotateY(p, origin, Rubik.turn.times * (Rubik.turn.clockwise ? 1 : -1) * (a * Math.PI / 180));
				p = rotateZ(p, origin, -a2);
				p = rotateX(p, origin, -a1);
				return p;
			};
			Object.assign(c, rf(c));
			c.geometry.forEach(e => e.points.forEach(p => Object.assign(p, rf(p))));
		}
	});
}