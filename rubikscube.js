"use strict";

class RubiksCube {

	constructor() {
		this.reset();
	}

	reset() {
		this.pieces = [
			new Piece(-1, +1, +1, "UFL", "corner", [6, 1, 2, 0], [0, 90, 0]),
			new Piece(+1, +1, +1, "UFR", "corner", [6, 2, 3, 0], [0, 0, 0]),
			new Piece(-1, -1, +1, "DFL", "corner", [6, 2, 1, 5], [180, 180, 0]),
			new Piece(+1, -1, +1, "DFR", "corner", [6, 3, 2, 5], [180, 90, 0]),
			new Piece(-1, +1, -1, "UBL", "corner", [6, 4, 1, 0], [0, 180, 0]),
			new Piece(+1, +1, -1, "UBR", "corner", [6, 3, 4, 0], [0, -90, 0]),
			new Piece(-1, -1, -1, "DBL", "corner", [6, 1, 4, 5], [180, -90, 0]),
			new Piece(+1, -1, -1, "DBR", "corner", [6, 4, 3, 5], [180, 0, 0]),

			new Piece(0, +1, +1, "UFM", "edge", [6, 2, 0], [0, 0, 0]),
			new Piece(0, +1, -1, "UBM", "edge", [6, 4, 0], [0, 180, 0]),
			new Piece(0, -1, +1, "DFM", "edge", [6, 2, 5], [180, 180, 0]),
			new Piece(0, -1, -1, "DBM", "edge", [6, 4, 5], [180, 0, 0]),
			new Piece(-1, +1, 0, "ULS", "edge", [6, 1, 0], [0, 90, 0]),
			new Piece(+1, +1, 0, "URS", "edge", [6, 3, 0], [0, -90, 0]),
			new Piece(-1, -1, 0, "DLS", "edge", [6, 1, 5], [180, -90, 0]),
			new Piece(+1, -1, 0, "DRS", "edge", [6, 3, 5], [180, 90, 0]),
			new Piece(-1, 0, +1, "FLE", "edge", [6, 2, 1], [0, 0, -90]),
			new Piece(+1, 0, +1, "FRE", "edge", [6, 2, 3], [0, 0, 90]),
			new Piece(-1, 0, -1, "BLE", "edge", [6, 4, 1], [0, 180, -90]),
			new Piece(+1, 0, -1, "BRE", "edge", [6, 4, 3], [0, 180, 90]),

			new Piece(0, 0, -1, "BME", "center", [6, 4], [-90, 180, 0]),
			new Piece(+1, 0, 0, "RSE", "center", [6, 3], [0, 0, 90]),
			new Piece(-1, 0, 0, "LSE", "center", [6, 1], [0, 0, -90]),
			new Piece(0, 0, +1, "FME", "center", [6, 2], [90, 180, 0]),
			new Piece(0, +1, 0, "UMS", "center", [6, 0], [0, 0, 0]),
			new Piece(0, -1, 0, "DMS", "center", [6, 5], [180, 0, 0]),

			new Piece(0, 0, 0, "MES", "core", [6], [0, 0, 0]),
		];

		this.cyclesMap = {
			U: [[[0, 0], [0, 2], [0, 8], [0, 6]], [[0, 1], [0, 5], [0, 7], [0, 3]], [[1, 0], [4, 0], [3, 0], [2, 0]], [[1, 1], [4, 1], [3, 1], [2, 1]], [[1, 2], [4, 2], [3, 2], [2, 2]]],
			D: [[[5, 0], [5, 2], [5, 8], [5, 6]], [[5, 1], [5, 5], [5, 7], [5, 3]], [[1, 6], [2, 6], [3, 6], [4, 6]], [[1, 7], [2, 7], [3, 7], [4, 7]], [[1, 8], [2, 8], [3, 8], [4, 8]]],
			F: [[[2, 0], [2, 2], [2, 8], [2, 6]], [[2, 1], [2, 5], [2, 7], [2, 3]], [[0, 6], [3, 0], [5, 2], [1, 8]], [[0, 7], [3, 3], [5, 1], [1, 5]], [[0, 8], [3, 6], [5, 0], [1, 2]]],
			B: [[[4, 0], [4, 2], [4, 8], [4, 6]], [[4, 1], [4, 5], [4, 7], [4, 3]], [[0, 0], [1, 6], [5, 8], [3, 2]], [[0, 1], [1, 3], [5, 7], [3, 5]], [[0, 2], [1, 0], [5, 6], [3, 8]]],
			L: [[[1, 0], [1, 2], [1, 8], [1, 6]], [[1, 1], [1, 5], [1, 7], [1, 3]], [[0, 0], [2, 0], [5, 0], [4, 8]], [[0, 3], [2, 3], [5, 3], [4, 5]], [[0, 6], [2, 6], [5, 6], [4, 2]]],
			R: [[[3, 0], [3, 2], [3, 8], [3, 6]], [[3, 1], [3, 5], [3, 7], [3, 3]], [[0, 2], [4, 6], [5, 2], [2, 2]], [[0, 5], [4, 3], [5, 5], [2, 5]], [[0, 8], [4, 0], [5, 8], [2, 8]]],
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

		this.pos = { x: 0, y: 0, z: -10 };
		this.rotationMat = [
			{ x: 1, y: 0, z: 0 },
			{ x: 0, y: 1, z: 0 },
			{ x: 0, y: 0, z: 1 }
		];
		this.rotateVel = { x: 0, y: 0, z: 0 };

		this.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[2, 2, 2, 2, 2, 2, 2, 2, 2],
			[3, 3, 3, 3, 3, 3, 3, 3, 3],
			[4, 4, 4, 4, 4, 4, 4, 4, 4],
			[5, 5, 5, 5, 5, 5, 5, 5, 5]
		];

		this.touches = [];

		this.turn = { ms: [60, 30] };
		this.turns = [];
		this.undoCap = 0;

		this.scrambling = false;
		this.scramble;
		this.scrambleIndex = 0;

		this.display = {};
		if (canvas) this.resize(canvas.width, canvas.height);
	}

	resize(width, height) {
		this.display.width = width;
		this.display.height = height;
	}

	loop() {
		let s = performance.now();

		let time = Date.now();
		this.pieces.forEach(piece => {
			if (!piece.turning) return;
			let turn_progress = (time - piece.turn.startTime) / this.turn.ms[Number(this.scrambling)];
			if (turn_progress < piece.turn.times) {
				let curve = t => t ** (1 / 2);
				let angle = turn_progress;
				angle = Math.floor(angle) + curve(angle - Math.floor(angle));
				angle *= Math.PI / 2;
				piece.rotationMat = piece.rotationMatO.map(v => rotateAxis(v, angle, piece.turn.axis));
			}
			else {
				piece.rotationMat = piece.rotationMatO.map(v => rotateAxis(v, piece.turn.times * Math.PI / 2, piece.turn.axis));
				piece.rotationMatO = piece.rotationMat;
				piece.turning = false;
				piece.turn = {};
			}
		});

		if (this.scrambling && !this.isTurning()) {
			if (this.scrambleIndex < this.scramble.length) {
				this.turnCubeNotation(this.scramble[this.scrambleIndex]);
				this.scrambleIndex++;
			}
			else {
				this.scrambling = false;
				if (timer.maystart) this.undoCap = this.turns.length;
			}
		}

		let touchesR = this.touches.filter(e => !e.touchingCube);
		if (touchesR.length >= 2) {
			let x = 0;
			let y = 0;
			let dist = 0;
			let angle = 0;
			touchesR.forEach(touch => {
				x += touch.x / touchesR.length;
				y += touch.y / touchesR.length;
			});
			touchesR.forEach(touch => {
				if (touch.ax !== undefined && touch.ay !== undefined) {
					let ax = touch.x - x;
					let ay = touch.y - y;
					let bx = touch.ax - x;
					let by = touch.ay - y;
					let ad = Math.hypot(ax, ay);
					let bd = Math.hypot(bx, by);
					dist += ad - bd;
					angle += Math.acos(Math.min(Math.max((ax * bx + ay * by) / (ad * bd), -1), 1)) * Math.sign(ax * by - ay * bx);
					touch.ax = undefined;
					touch.ay = undefined;
				}
			});

			this.rotateVel.z = -angle;
			this.rotateCube(0, 0, this.rotateVel.z);
			//this.pos.z = Math.min(Math.max(this.pos.z + dist * 0.01, -13), -8);
		}

		if (this.touches.length == 0) this.rotateCube(this.rotateVel.x, this.rotateVel.y, this.rotateVel.z);
		this.rotateVel.x *= 0.95;
		this.rotateVel.y *= 0.95;
		this.rotateVel.z *= 0.95;

		if (this.isSolved() && timer.running) {
			timer.stop();
			timer.maystart = false;
			this.undoCap = this.turns.length;
		}
		timerElement.textContent = timer.display();
		timeB += performance.now() - s;

		this.draw();

		let width = Math.sqrt(this.display.width * this.display.height) * 0.2;
		let y = this.display.width * 0.03;
		let x = this.display.width - y - width;
		this.drawMap(x, y, width);
	}

	draw() {
		let s = performance.now();
		/*let polys = [];
		this.pieces.forEach(piece => {
			piece.box.forEach((face, i) => {
				if (!isPolyVis(face.map(point => this.transformP(piece.transform(point))))) return;
				let dist = Vlength(this.transformP(centroid(face.map(p => piece.transform(p)))));
				polys.push({ dist, face, piece, i });
			});
		});
		polys.sort((a, b) => (b.dist + 1 * (!b.piece.boxFaces[b.i])) - (a.dist + 1 * (!a.piece.boxFaces[a.i])));
		polys.forEach(poly => {
			let { face, piece, i } = poly;
			ctx.beginPath();
			face.forEach((point, i) => {
				let { x, y } = this.renderP(piece.transform(point));
				ctx[i == 0 ? "moveTo" : "lineTo"](x, y);
			});
			ctx.closePath();
			ctx.fillStyle = piece.boxColors[i];
			ctx.fill();
		});*/
		
		let drawPolys = [];
		this.pieces.forEach((piece, i) => {
			piece.geometry.forEach((poly, i) => {
				let face = [];
				let face_tP = [];
				let face_rP = [];
				poly.points.forEach(point => {
					let point1 = piece.transform(point);
					let point2 = this.transformP(point1);
					let point3 = this.projectP(point2);
					face.push(point1);
					face_tP.push(point2);
					face_rP.push(point3);
				});
				
				if (isPolyVis(face_tP)) {
					let cen = centroid(face);
					let dist = Vlength(this.transformP(cen));
					let colorI = piece.color[poly.color];
					let light = basicLighting(face_tP);
					drawPolys.push({ dist, face_rP, piece, colorI, light });
				}
			});
		});
		drawPolys.sort((a, b) => (b.dist + 1 * (b.colorI == 6)) - (a.dist + 1 * (a.colorI == 6)));
		
		timeC += performance.now() - s;
		let s1 = performance.now();
		drawPolys.forEach(poly => {
			let { face_rP, piece, colorI, light } = poly;
			ctx.beginPath();
			face_rP.forEach((point, i) => ctx[i == 0 ? "moveTo" : "lineTo"](point.x, point.y));
			ctx.closePath();
			ctx.fillStyle = colors[colorI];
			ctx.fill();
			ctx.fillStyle = (light < 0) ? "black" : "white";
			ctx.globalAlpha = Math.abs(light) * ((colorI !== 6) ? shading.surface : shading.internals);
			ctx.fill();
			ctx.globalAlpha = 1;
		});
		timeD += performance.now() - s1;
	}

	drawMap(x, y, w) {
		let h = w * 3 / 4;
		let siW = w / 4;
		let sqW = siW / 3;
		let faceCoords = [
			[1 * siW, 0 * siW],
			[0 * siW, 1 * siW],
			[1 * siW, 1 * siW],
			[2 * siW, 1 * siW],
			[3 * siW, 1 * siW],
			[1 * siW, 2 * siW]
		];
		this.map.forEach((si, i) => {
			let siX = faceCoords[i][0];
			let siY = faceCoords[i][1];
			si.forEach((sq, j) => {
				let sqX = (j % 3) * sqW;
				let sqY = Math.floor(j / 3) * sqW;
				let padding = 0.07;
				ctx.fillStyle = colors[sq];
				ctx.fillRect(x + siX + sqX + padding * sqW, y + siY + sqY + padding * sqW, sqW - 2 * padding * sqW, sqW - 2 * padding * sqW);
			});
		});
	}

	rotateCube(ax, ay, az) {
		this.rotationMat.forEach(v => {
			let p = v;
			p = rotateX(p, ax);
			p = rotateY(p, ay);
			p = rotateZ(p, az);
			v.x = p.x;
			v.y = p.y;
			v.z = p.z;
		});
	}

	turnCube(pieces, axis, times) {
		if (pieces.some(p => p.turning)) return;
		let startTime = Date.now();
		pieces.forEach(piece => {
			piece.turning = true;
			piece.turn.startTime = startTime;
			piece.turn.axis = axis;
			piece.turn.times = times;
		});

		let turns = [];
		let U = this.findPiece('UMS');
		let L = this.findPiece('LSE');
		let F = this.findPiece('FME');
		let R = this.findPiece('RSE');
		let B = this.findPiece('BME');
		let D = this.findPiece('DMS');
		let test = (A, Z) => {
			if (pieces.includes(A)) turns.push({ face: A.pieceId[0], clockwise: false });
			else if (pieces.includes(Z)) turns.push({ face: Z.pieceId[0], clockwise: true });
			else turns.push({ face: A.pieceId[0], clockwise: true }, { face: Z.pieceId[0], clockwise: false });
		};
		if (Vdot(Vnormalize(U.transform(U)), axis) == 1) test(U, D);
		if (Vdot(Vnormalize(L.transform(L)), axis) == 1) test(L, R);
		if (Vdot(Vnormalize(F.transform(F)), axis) == 1) test(F, B);
		if (Vdot(Vnormalize(R.transform(R)), axis) == 1) test(R, L);
		if (Vdot(Vnormalize(B.transform(B)), axis) == 1) test(B, F);
		if (Vdot(Vnormalize(D.transform(D)), axis) == 1) test(D, U);
		turns.forEach((turn) => this.turnMap(turn.face + (times == 1 ? '' : times) + (turn.clockwise ? '' : "'")));

		this.turns.push({ pieces, axis, times });
		sound.play();

		return true;
	}

	turnCubeNotation(side) {
		let face = side[0];
		let times = Number(side[1]) || 1;
		let clockwise = side[side.length - 1] !== "'";
		let piece = this.findPiece({
			U: "UMS",
			L: "LSE",
			F: "FME",
			R: "RSE",
			B: "BME",
			D: "DMS",
		} [face]);
		let pieceN = Vnormalize(piece.transform(piece));
		let axis = clockwise ? Vneg(pieceN) : pieceN;
		for (let a in axis) axis[a] = Math.round(axis[a]);
		let pieces;
		if (axis.x !== 0) pieces = this.pieces.filter(p => Math.abs(p.transform(p).x - piece.transform(piece).x) < 0.1);
		if (axis.y !== 0) pieces = this.pieces.filter(p => Math.abs(p.transform(p).y - piece.transform(piece).y) < 0.1);
		if (axis.z !== 0) pieces = this.pieces.filter(p => Math.abs(p.transform(p).z - piece.transform(piece).z) < 0.1);

		return this.turnCube(pieces, axis, times);
	}

	turnUndo() {
		if (this.turns.length <= this.undoCap) return;
		let turn = this.turns[this.turns.length - 1];
		let axis = Vneg(turn.axis);
		if (this.turnCube(turn.pieces, axis, turn.times)) this.turns.splice(this.turns.length - 2, 2);
	}

	rotateAngle(a1, a2, angle, p0) {
		let p = { x: p0.x, y: p0.y, z: p0.z };
		p = rotateX(p, a1);
		p = rotateZ(p, a2);
		p = rotateY(p, angle);
		p = rotateZ(p, -a2);
		p = rotateX(p, -a1);
		return p;
	}

	renderP(point) {
		return this.projectP(this.transformP(point));
	}

	transformP(point) {
		return Vadd(Vmatrix(this.rotationMat, point), this.pos);
	}

	projectP(point) {
		let FOV = 60 * Math.PI / 180;
		let fl = Math.hypot(this.display.width, this.display.height) / (2 * Math.tan(FOV / 2));
		let x = point.x * fl / -point.z;
		let y = point.y * fl / -point.z;
		return { x: x + this.display.width / 2, y: -y + this.display.height / 2 };
	}

	turnMap(side) {
		let swap = (si1, sq1, si2, sq2) => [this.map[si1][sq1], this.map[si2][sq2]] = [this.map[si2][sq2], this.map[si1][sq1]];
		this.cyclesMap[side[0]].forEach(e => {
			let swaps = [
				[e[0][0], e[0][1], e[1][0], e[1][1]],
				[e[0][0], e[0][1], e[2][0], e[2][1]],
				[e[0][0], e[0][1], e[3][0], e[3][1]]
			];
			if (side[side.length - 1] === "'") swaps.reverse();
			for (let i = 0; i < (Number(side[1]) || 1); i++) swaps.forEach(s => swap(...s));
		});
	}

	touchStart(x, y, id) {
		let touch = { id };
		this.touches.push(touch);
		let touchingCube = false,
			cube, face, faceI, pieceI, gotLine = false;
		this.rotateVel.x = this.rotateVel.y = 0;
		this.pieces.some((piece, I) => {
			return piece.box.some((e, i) => {
				if (!isPolyVis(e.map(point => this.transformP(piece.transform(point))))) return false;
				let Ply = { points: e.map(p => this.renderP(piece.transform(p))) };
				if (piece.boxFaces[i] && cllnPolyPnt(Ply, { x, y })) {
					touchingCube = true;
					cube = piece.box;
					face = cube[i];
					faceI = i;
					pieceI = I;
				}
				return touchingCube;
			});
		});
		Object.assign(touch, { x, y, touchingCube, cube, face, faceI, pieceI, gotLine });
	}

	touchMove(x, y, id) {
		let touch = this.touches.find(e => e.id === id);
		if (!touch) return;
		if (touch.touchingCube && !touch.gotLine) {
			let { cube, face, pieceI } = touch;
			let piece = this.pieces[pieceI];
			let Ply = { points: face.map(p => this.renderP(piece.transform(p))) };
			let lines = Ply.points.map((e, i, a) => new Line(e, a[(i + 1) % a.length]));
			lines.forEach((e, i) => {
				let a = Math.atan2(y - touch.y, x - touch.x);
				let d = Math.hypot(touch.y - y, touch.x - x) * 10;
				let p = new Point(touch.x + Math.cos(a) * d, touch.y + Math.sin(a) * d);
				if (cllnLineLine(e, new Line(touch, p))) {
					if (!this.scrambling) {
						let axis = Vsub(piece.transform(face[i]), piece.transform(face[(i + 1) % face.length]));
						for (let a in axis) axis[a] = Math.round(axis[a]);
						let pieces;
						if (axis.x !== 0) pieces = this.pieces.filter(p => Math.abs(p.transform(p).x - piece.transform(piece).x) < 0.1);
						if (axis.y !== 0) pieces = this.pieces.filter(p => Math.abs(p.transform(p).y - piece.transform(piece).y) < 0.1);
						if (axis.z !== 0) pieces = this.pieces.filter(p => Math.abs(p.transform(p).z - piece.transform(piece).z) < 0.1);
						let times = 1;
						if (pieces.length == 9) this.turnCube(pieces, axis, times);
						if (timer.maystart && !timer.running) timer.start();
					}
					touch.gotLine = true;
				}
			});
		}
		if (!touch.touchingCube) {
			touch.ax = touch.x;
			touch.ay = touch.y;
			this.rotateVel.x = (touch.y - y) * (2 * Math.PI) / Math.sqrt(this.display.width * this.display.height);
			this.rotateVel.y = (touch.x - x) * (2 * Math.PI) / Math.sqrt(this.display.width * this.display.height);
			this.rotateCube(this.rotateVel.x, this.rotateVel.y, 0);
		}
		Object.assign(touch, { x, y });
	}

	touchEnd(id) {
		this.touches.splice(this.touches.findIndex(e => e.id === id), 1);
	}

	touchCancel() {
		this.touches.length = 0;
	}

	generateScramble(length = 21) {
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
		return scr.map(e => p_axis[e.axis][e.dir] + p_symbol[e.symbol]);
	}

	scrambleCube() {
		if (this.scrambling) return;
		this.scrambling = true;
		this.scramble = this.generateScramble();
		this.scrambleIndex = 0;
		if (timer.enabled) {
			timer.reset();
			timer.maystart = true;
			timerElement.style.color = '#ffffff';
		}
	}

	findPiece(id) {
		return this.pieces.find(e => e.pieceId === id);
	}

	isTurning() {
		return this.pieces.some(e => e.turning);
	}

	isSolved() {
		return this.map.every(e => e.reduce((a, b) => a && b === e[0], true));
	}
}

class Piece {
	constructor(x, y, z, pieceId, pieceType, color = [6, 7, 7, 7], rot = [0, 0, 0]) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.pieceId = this.pieceIdN = this.pieceIdO = pieceId;
		this.pieceType = pieceType;
		this.geometry = m3ds[pieceType].map(e => ({
			color: e.color,
			points: e.points.map(f => {
				let p = {
					x: (f[0] / 2),
					y: (f[1] / 2),
					z: (f[2] /-2)
				}
				p = rotateX(p, rot[0] * Math.PI / 180);
				p = rotateY(p, rot[1] * Math.PI / 180);
				p = rotateZ(p, rot[2] * Math.PI / 180);
				
				return Vadd(p, Vscale(this, 1.02));
			})
		}));
		this.box = [
			[[-1, +1, -1], [+1, +1, -1], [+1, +1, +1], [-1, +1, +1]],
			[[-1, +1, -1], [-1, +1, +1], [-1, -1, +1], [-1, -1, -1]],
			[[-1, +1, +1], [+1, +1, +1], [+1, -1, +1], [-1, -1, +1]],
			[[+1, +1, +1], [+1, +1, -1], [+1, -1, -1], [+1, -1, +1]],
			[[+1, +1, -1], [-1, +1, -1], [-1, -1, -1], [+1, -1, -1]],
			[[-1, -1, +1], [+1, -1, +1], [+1, -1, -1], [-1, -1, -1]]
		].map((e, i) => e.map(f => ({
			x: (f[0] / 2) + x * 1,
			y: (f[1] / 2) + y * 1,
			z: (f[2] / 2) + z * 1
		})));
		this.boxFaces = this.box.map(face => {
			let faceNormal = getNormal(face);
			return Vdot(faceNormal, this) > 0;
		});
		this.boxColors = this.box.map((face, i) => {
			let faceNormal = getNormal(face);
			if (!this.boxFaces[i]) return colors[6];
			if (Vdot(faceNormal, { x: 0, y: +1, z: 0 }) == 1) return colors[0];
			if (Vdot(faceNormal, { x: -1, y: 0, z: 0 }) == 1) return colors[1];
			if (Vdot(faceNormal, { x: 0, y: 0, z: +1 }) == 1) return colors[2];
			if (Vdot(faceNormal, { x: +1, y: 0, z: 0 }) == 1) return colors[3];
			if (Vdot(faceNormal, { x: 0, y: 0, z: -1 }) == 1) return colors[4];
			if (Vdot(faceNormal, { x: 0, y: -1, z: 0 }) == 1) return colors[5];
		});

		this.rotationMat = [
			{ x: 1, y: 0, z: 0 },
			{ x: 0, y: 1, z: 0 },
			{ x: 0, y: 0, z: 1 }
		];
		this.rotationMatO = this.rotationMat;
		this.transform = p => {
			//return Vmatrix(this.rotationMatD, Vmatrix(this.rotationMat, p));
			return Vmatrix(this.rotationMat, p);
		};

		this.color = color;
		this.turn = {};
	}
}