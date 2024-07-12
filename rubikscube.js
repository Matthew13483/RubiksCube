"use strict";

class RubiksCube {

	constructor() {
		this.reset();
	}

	reset() {
		this.pieces = [
			new Piece(-1, +1, -1, "UFL", "corner", [6, 1, 2, 0], [0, 90, 0]),
			new Piece(+1, +1, -1, "UFR", "corner", [6, 2, 3, 0], [0, 0, 0]),
			new Piece(-1, -1, -1, "DFL", "corner", [6, 2, 1, 5], [180, 180, 0]),
			new Piece(+1, -1, -1, "DFR", "corner", [6, 3, 2, 5], [180, 90, 0]),
			new Piece(-1, +1, +1, "UBL", "corner", [6, 4, 1, 0], [0, 180, 0]),
			new Piece(+1, +1, +1, "UBR", "corner", [6, 3, 4, 0], [0, -90, 0]),
			new Piece(-1, -1, +1, "DBL", "corner", [6, 1, 4, 5], [180, -90, 0]),
			new Piece(+1, -1, +1, "DBR", "corner", [6, 4, 3, 5], [180, 0, 0]),

			new Piece(0, +1, -1, "UFM", "edge", [6, 2, 0], [0, 0, 0]),
			new Piece(0, +1, +1, "UBM", "edge", [6, 4, 0], [0, 180, 0]),
			new Piece(0, -1, -1, "DFM", "edge", [6, 2, 5], [180, 180, 0]),
			new Piece(0, -1, +1, "DBM", "edge", [6, 4, 5], [180, 0, 0]),
			new Piece(-1, +1, 0, "ULS", "edge", [6, 1, 0], [0, 90, 0]),
			new Piece(+1, +1, 0, "URS", "edge", [6, 3, 0], [0, -90, 0]),
			new Piece(-1, -1, 0, "DLS", "edge", [6, 1, 5], [180, -90, 0]),
			new Piece(+1, -1, 0, "DRS", "edge", [6, 3, 5], [180, 90, 0]),
			new Piece(-1, 0, -1, "FLE", "edge", [6, 2, 1], [0, 0, 90]),
			new Piece(+1, 0, -1, "FRE", "edge", [6, 2, 3], [0, 0, -90]),
			new Piece(-1, 0, +1, "BLE", "edge", [6, 4, 1], [0, 180, 90]),
			new Piece(+1, 0, +1, "BRE", "edge", [6, 4, 3], [0, 180, -90]),

			new Piece(0, 0, +1, "BME", "center", [6, 4], [-90, 0, 0]),
			new Piece(+1, 0, 0, "RSE", "center", [6, 3], [0, 0, -90]),
			new Piece(-1, 0, 0, "LSE", "center", [6, 1], [0, 0, 90]),
			new Piece(0, 0, -1, "FME", "center", [6, 2], [90, 0, 0]),
			new Piece(0, +1, 0, "UMS", "center", [6, 0], [0, 0, 0]),
			new Piece(0, -1, 0, "DMS", "center", [6, 5], [180, 0, 0]),

			new Piece(0, 0, 0, "MES", "core", [6], [0, 0, 0]),
		];
		this.Gpieces = [
			new Gpiece(-1, +1, -1, "UFL", [1, 0, 1, 0, 1, 0]),
			new Gpiece(+1, +1, -1, "UFR", [1, 0, 1, 0, 0, 1]),
			new Gpiece(-1, -1, -1, "DFL", [0, 1, 1, 0, 1, 0]),
			new Gpiece(+1, -1, -1, "DFR", [0, 1, 1, 0, 0, 1]),
			new Gpiece(-1, +1, +1, "UBL", [1, 0, 0, 1, 1, 0]),
			new Gpiece(+1, +1, +1, "UBR", [1, 0, 0, 1, 0, 1]),
			new Gpiece(-1, -1, +1, "DBL", [0, 1, 0, 1, 1, 0]),
			new Gpiece(+1, -1, +1, "DBR", [0, 1, 0, 1, 0, 1]),

			new Gpiece(0, +1, -1, "UFM", [1, 0, 1, 0, 0, 0]),
			new Gpiece(0, +1, +1, "UBM", [1, 0, 0, 1, 0, 0]),
			new Gpiece(0, -1, -1, "DFM", [0, 1, 1, 0, 0, 0]),
			new Gpiece(0, -1, +1, "DBM", [0, 1, 0, 1, 0, 0]),
			new Gpiece(-1, +1, 0, "ULS", [1, 0, 0, 0, 1, 0]),
			new Gpiece(+1, +1, 0, "URS", [1, 0, 0, 0, 0, 1]),
			new Gpiece(-1, -1, 0, "DLS", [0, 1, 0, 0, 1, 0]),
			new Gpiece(+1, -1, 0, "DRS", [0, 1, 0, 0, 0, 1]),
			new Gpiece(-1, 0, -1, "FLE", [0, 0, 1, 0, 1, 0]),
			new Gpiece(+1, 0, -1, "FRE", [0, 0, 1, 0, 0, 1]),
			new Gpiece(-1, 0, +1, "BLE", [0, 0, 0, 1, 1, 0]),
			new Gpiece(+1, 0, +1, "BRE", [0, 0, 0, 1, 0, 1]),

			new Gpiece(0, 0, +1, "BME", [0, 0, 0, 1, 0, 0]),
			new Gpiece(+1, 0, 0, "RSE", [0, 0, 0, 0, 0, 1]),
			new Gpiece(-1, 0, 0, "LSE", [0, 0, 0, 0, 1, 0]),
			new Gpiece(0, 0, -1, "FME", [0, 0, 1, 0, 0, 0]),
			new Gpiece(0, +1, 0, "UMS", [1, 0, 0, 0, 0, 0]),
			new Gpiece(0, -1, 0, "DMS", [0, 1, 0, 0, 0, 0])
		];

		this.cycles = {
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

		this.turnAtlas = {
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

		this.pos = { x: 0, y: 0, z: 21 };
		this.rotationMat = [
			{ x: 1, y: 0, z: 0 },
			{ x: 0, y: 1, z: 0 },
			{ x: 0, y: 0, z: 1 },
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
		this.touching = false;

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
		this.pieces.forEach(piece => {
			let turn_progress = (Date.now() - piece.turn.startTime) / this.turn.ms[Number(this.scrambling)];
			if (piece.turning && piece.pieceId == piece.turn.pieceId && turn_progress > piece.turn.times) {
				let angle = (piece.turn.clockwise * 2 - 1) * (1 * 90 * Math.PI / 180);
				let a1 = Math.atan2(piece.turn.piece.z, piece.turn.piece.y);
				let tP2 = rotateX(a1, piece.turn.piece);
				let a2 = Math.atan2(tP2.x, tP2.y);
				let piecesToTurn = this.pieces.filter(e => e.turning && e.turn.pieceId == piece.turn.pieceId);
				for (let i = 0; i < piece.turn.times; i++) {
					let cyclePieceIds = e => {
						if (piece.turn.clockwise) {
							this.findPiece(e[0]).pieceIdN = e[1];
							this.findPiece(e[1]).pieceIdN = e[2];
							this.findPiece(e[2]).pieceIdN = e[3];
							this.findPiece(e[3]).pieceIdN = e[0];
						}
						else {
							this.findPiece(e[0]).pieceIdN = e[3];
							this.findPiece(e[1]).pieceIdN = e[0];
							this.findPiece(e[2]).pieceIdN = e[1];
							this.findPiece(e[3]).pieceIdN = e[2];
						}
					};
					let cycles = this.cycles[piece.turn.face];
					cycles.forEach(e => cyclePieceIds(e.split(",")));
					piecesToTurn.forEach(e => {
						e.turning = false;
						e.pieceId = e.pieceIdN;
						Object.assign(e, this.rotateAngle(a1, a2, angle, e));
						e.geometry.forEach(e => e.points.forEach(p => Object.assign(p, this.rotateAngle(a1, a2, angle, p))));
					});
				}
			}
		});

		if (this.scrambling && !this.isTurning()) {
			if (this.scrambleIndex < this.scramble.length) {
				this.turnCube(this.scramble[this.scrambleIndex]);
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

			this.rotateVel.z = angle;
			this.rotateCube(0, 0, this.rotateVel.z);
			//this.pos.z = Math.min(Math.max(this.pos.z - dist * 0.01, 15), 40);
		}

		if (!this.touching) this.rotateCube(this.rotateVel.x, this.rotateVel.y, this.rotateVel.z);
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
		let drawPolys = [];
		this.pieces.forEach(c => {
			let angle, a1, a2;
			if (c.turning) {
				angle = Math.min((Date.now() - c.turn.startTime) / this.turn.ms[Number(this.scrambling)], c.turn.times);
				let curve = t => t ** (1 / 2)
				angle = Math.floor(angle) + curve(angle - Math.floor(angle));
				angle = (c.turn.clockwise * 2 - 1) * (angle * 90 * Math.PI / 180);
				a1 = Math.atan2(c.turn.piece.z, c.turn.piece.y);
				let tP2 = rotateX(a1, c.turn.piece);
				a2 = Math.atan2(tP2.x, tP2.y);
			}
			c.geometry.forEach(e => {
				let points = e.points;
				if (c.turning) points = e.points.map(p => this.rotateAngle(a1, a2, angle, p));
				if (clockwise(...points.map(point => Vadd(Vmatrix(this.rotationMat, point), this.pos)))) {
					let cen = centroid(points);
					let dist = Vlength(Vadd(Vmatrix(this.rotationMat, cen), this.pos));
					let colorI = c.color[e.color];
					if (true || colorI !== 6) drawPolys.push({ dist, points, colorI });
				}
			});
		});
		drawPolys.sort((a, b) => (b.dist + 1 * (b.colorI == 6)) - (a.dist + 1 * (a.colorI == 6)));
		timeC += performance.now() - s;
		let s1 = performance.now();
		drawPolys.forEach(poly => {
			ctx.beginPath();
			poly.points.forEach((point, i) => {
				let { x, y } = this.render(point);
				ctx[i == 0 ? "moveTo" : "lineTo"](x, y);
			});
			ctx.closePath();
			ctx.fillStyle = colors[poly.colorI];
			ctx.fill();
			let value = (poly.colorI !== 6) ? shading.surface : shading.internals;
			if (value > 0) {
				let light = basicLighting(...poly.points.map(point => Vmatrix(this.rotationMat, point)));
				ctx.fillStyle = (light > 0) ? "black" : "white";
				ctx.globalAlpha = Math.abs(light) * value;
				ctx.fill();
				ctx.globalAlpha = 1;
			}
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
				let sqY = (Math.floor(j / 3)) * sqW;
				let padding = 0.07;
				ctx.fillStyle = colors[sq];
				ctx.fillRect(x + siX + sqX + padding * sqW, y + siY + sqY + padding * sqW, sqW - 2 * padding * sqW, sqW - 2 * padding * sqW);
			});
		});
	}

	rotateCube(ax, ay, az) {
		this.rotationMat.forEach(v => {
			let p = v;
			p = rotateY(ay, p);
			p = rotateX(ax, p);
			p = rotateZ(az, p);
			v.x = p.x;
			v.y = p.y;
			v.z = p.z;
		});
	}

	turnCube(side) {
		let turning = false;
		if (this.pieces.map(e => e.turning && (e.pieceId + "xyz").split("").find(e => e == side[0])).reduce((a, b) => a || b)) return false;
		this.pieces.forEach(e => {
			if ((e.pieceId + "xyz").split("").find(e => e == side[0])) {
				e.turning = true;
				turning = true;
				e.turn.startTime = Date.now();
				e.turn.face = side[0];
				e.turn.clockwise = side[side.length - 1] !== "'";
				e.turn.piece = this.findPiece({
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
				e.turn.pieceId = {
					U: "UMS",
					D: "DMS",
					F: "FME",
					B: "BME",
					L: "LSE",
					R: "RSE",
					M: "MES",
					E: "MES",
					S: "MES",
					x: "MES",
					y: "MES",
					z: "MES"
				} [side[0]];
				e.turn.times = Number(side[1]) || 1;
			}
		});

		this.turnMap(side);
		this.turns.push(side);
		sound.play();
		return turning;
	}

	turnUndo() {
		if (this.turns.length <= this.undoCap) return;
		let side = this.turns[this.turns.length - 1];
		let side2 = (side[side.length - 1] !== "'") ? side + "'" : side.slice(0, -1);
		if (this.turnCube(side2)) this.turns.splice(this.turns.length - 2, 2);
	}

	turnAbsolute(side) {
		this.turnCube(this.pieces.find(e => e.pieceIdO == {
			U: "UMS",
			D: "DMS",
			F: "FME",
			B: "BME",
			L: "LSE",
			R: "RSE",
			M: "LSE",
			E: "DMS",
			S: "FME"
		} [side[0]]).pieceId[0]);
	}

	rotateAngle(a1, a2, angle, p0) {
		let p = { x: p0.x, y: p0.y, z: p0.z };
		p = rotateX(a1, p);
		p = rotateZ(a2, p);
		p = rotateY(angle, p);
		p = rotateZ(-a2, p);
		p = rotateX(-a1, p);
		return p;
	}

	render(point) {
		let p = Vmatrix(this.rotationMat, point);
		let { x, y } = c32(Vadd(p, this.pos), this.display.width, this.display.height);
		return { x: x + this.display.width / 2, y: -y + this.display.height / 2 };
	}

	turnMap(side) {
		let swap = (si1, sq1, si2, sq2) => [this.map[si1][sq1], this.map[si2][sq2]] = [this.map[si2][sq2], this.map[si1][sq1]];
		this.cyclesMap[side[0]].forEach(e => {
			for (let i = 0; i < (Number(side[1]) || 1); i++) {
				let swaps = [
					[e[0][0], e[0][1], e[1][0], e[1][1]],
					[e[0][0], e[0][1], e[2][0], e[2][1]],
					[e[0][0], e[0][1], e[3][0], e[3][1]]
				];
				if (side[side.length - 1] === "'") swaps.reverse();
				swaps.forEach(s => swap(...s));
			}
		});
	}

	touchStart(x, y, id) {
		this.touching = true;
		let touch = { id };
		this.touches.push(touch);
		let touchingCube = false,
			cube, face, faceI, gotLine = false;
		this.rotateVel.x = this.rotateVel.y = 0;
		this.Gpieces.forEach((c, i1) => {
			c.faces.forEach((e, i) => {
				if (!clockwise(...[e.p1, e.p2, e.p3].map(point => Vadd(Vmatrix(this.rotationMat, point), this.pos)))) return;
				let Ply = { points: [e.p1, e.p2, e.p3, e.p4].map(p => this.render(p)) };
				if (c.acFaces[i] && cllnPolyPnt(Ply, { x, y })) {
					touchingCube = true;
					cube = this.Gpieces[i1];
					face = cube.faces[i];
					faceI = i;
				}
			});
		});
		Object.assign(touch, { x, y, touchingCube, cube, face, faceI, gotLine });
	}

	touchMove(x, y, id) {
		this.touching = true;
		let touch = this.touches.find(e => e.id === id);
		if (!touch) return;
		if (touch.touchingCube && !touch.gotLine) {
			let { cube, face } = touch;
			let Ply = { points: [face.p1, face.p2, face.p3, face.p4].map(p => this.render(p)) };
			let lines = Ply.points.map((e, i, a) => new Line(e, a[(i + 1) % a.length]));
			lines.forEach((e, i) => {
				let a = Math.atan2(y - touch.y, x - touch.x);
				let d = Math.hypot(touch.y - y, touch.x - x) * 10;
				let p = new Point(touch.x + Math.cos(a) * d, touch.y + Math.sin(a) * d);
				if (cllnLineLine(e, new Line(touch, p))) {
					if (!this.scrambling) {
						this.turnCube(this.turnAtlas[cube.pieceId][touch.faceI].split(",")[i]);
						if (timer.maystart && !timer.running) timer.start();
					}
					touch.gotLine = true;
				}
			});
		}
		if (!touch.touchingCube) {
			touch.ax = touch.x;
			touch.ay = touch.y;
			this.rotateVel.x = -(touch.y - y) * (2 * Math.PI) / Math.sqrt(this.display.width * this.display.height);
			this.rotateVel.y = (touch.x - x) * (2 * Math.PI) / Math.sqrt(this.display.width * this.display.height);
			this.rotateCube(this.rotateVel.x, this.rotateVel.y, 0);
		}
		Object.assign(touch, { x, y });
	}

	touchEnd(id) {
		this.touching = false;
		this.touches.splice(this.touches.findIndex(e => e.id === id), 1);
	}

	touchCancel() {
		this.touching = false;
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
		return this.pieces.map(e => e.turning).reduce((a, b) => a || b);
	}

	isSolved() {
		return this.map.map(e => e.reduce((a, b) => a && b === e[0], true)).reduce((a, b) => a && b);
	}
}

class Piece {
	constructor(x, y, z, pieceId, pieceType, color = [6, 7, 7, 7], rot = [0, 0, 0]) {
		this.x = x * 2.03;
		this.y = y * 2.03;
		this.z = z * 2.03;
		this.pieceId = this.pieceIdN = this.pieceIdO = pieceId;
		this.pieceType = pieceType;
		this.geometry = JSON.parse(JSON.stringify(m3ds[pieceType])).map(e => {
			return {
				color: e.color,
				points: e.points.map(f => {
					let p = {
						x: f[0] + this.x,
						y: f[1] + this.y,
						z: f[2] + this.z
					}
					p = rotateX(rot[0] * Math.PI / 180, p, this);
					p = rotateY(rot[1] * Math.PI / 180, p, this);
					p = rotateZ(rot[2] * Math.PI / 180, p, this);
					return p;
				})
			}
		});
		this.color = color;
		this.turn = {};
	}
}

class Gpiece {
	constructor(x, y, z, pieceId, acFaces) {
		this.x = x * 2;
		this.y = y * 2;
		this.z = z * 2;
		this.pieceId = this.pieceIdN = pieceId;
		this.acFaces = acFaces;
		this.faces = [
			[[-1, +1, +1], [+1, +1, +1], [+1, +1, -1], [-1, +1, -1]],
			[[-1, -1, -1], [+1, -1, -1], [+1, -1, +1], [-1, -1, +1]],
			[[-1, +1, -1], [+1, +1, -1], [+1, -1, -1], [-1, -1, -1]],
			[[+1, +1, +1], [-1, +1, +1], [-1, -1, +1], [+1, -1, +1]],
			[[-1, +1, +1], [-1, +1, -1], [-1, -1, -1], [-1, -1, +1]],
			[[+1, +1, -1], [+1, +1, +1], [+1, -1, +1], [+1, -1, -1]]
		].map((e, i) => {
			return new Sticker(
				new Point(e[0][0] + this.x, e[0][1] + this.y, e[0][2] + this.z),
				new Point(e[1][0] + this.x, e[1][1] + this.y, e[1][2] + this.z),
				new Point(e[2][0] + this.x, e[2][1] + this.y, e[2][2] + this.z),
				new Point(e[3][0] + this.x, e[3][1] + this.y, e[3][2] + this.z)
			);
		});
	}
}

class Sticker {
	constructor(p1, p2, p3, p4) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.p4 = p4;
	}
}