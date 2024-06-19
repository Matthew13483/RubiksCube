class RubiksCube {
	constructor() {
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

			new Piece(0, 0, 0, "", "core", [6], [0, 0, 0]),
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

		this.turn = {
			turning: false,
			angle: 0,
			speed: 15
		};
		this.scrambling = false;
		this.scramble;
		this.scrambleIndex = 0;

		this.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[2, 2, 2, 2, 2, 2, 2, 2, 2],
			[3, 3, 3, 3, 3, 3, 3, 3, 3],
			[4, 4, 4, 4, 4, 4, 4, 4, 4],
			[5, 5, 5, 5, 5, 5, 5, 5, 5]
		];
	}
	draw() {
		let drawFaces = [];
		this.pieces.forEach(c => {
			c.geometry.forEach(e => {
				if (clockwise(...e.points)) {
					let cx = 0;
					let cy = 0;
					let cz = 0;
					e.points.forEach((p, i, a) => {
						cx += p.x / a.length;
						cy += p.y / a.length;
						cz += p.z / a.length;
					});
					let dist = Math.hypot(cx * scale, cy * scale, cz + pos.z);
					drawFaces.push([dist, e, c, c.color[e.color]]);
				}
			});
		});
		drawFaces.sort((a, b) => (b[0] + (b[3] == 6 ? 1 : 0)) - (a[0] + (a[3] == 6 ? 1 : 0)));
		drawFaces.forEach(e => {
			ctx.beginPath();
			e[1].points.forEach((e1, i) => {
				let p = c32(e1.x * scale, e1.y * scale, e1.z + pos.z);
				ctx[i == 0 ? "moveTo" : "lineTo"](p.x + canvas.width / 2, -p.y + canvas.height / 2);
			});
			ctx.closePath();
			ctx.fillStyle = colors[e[3]];
			ctx.fill();
			let v = (e[3] !== 6) ? shading.surface : shading.internals;
			if (v > 0) {
				let bl = basicLighting(...e[1].points);
				ctx.fillStyle = (bl > 0) ? "black" : "white";
				ctx.globalAlpha = Math.abs(bl) * v;
				ctx.fill();
				ctx.globalAlpha = 1;
			}
		});
		/*this.pieces.forEach(c => {
			let p = c32(c.x * scale * 1.5, c.y * scale * 1.5, c.z + pos.z);
			ctx.strokeStyle = "#00ffff";
			ctx.strokeText(c.pieceIdO, p.x + canvas.width / 2, -p.y + canvas.height / 2);
		});*/
	}
	rotateCube(ax, ay) {
		let rf = p => {
			p = rotateY(p, origin, ay * Math.PI / 180);
			p = rotateX(p, origin, ax * Math.PI / 180);
			return p;
		};
		this.pieces.forEach((p1, i) => {
			Object.assign(p1, rf(p1));
			p1.geometry.forEach(e => e.points.forEach(p => Object.assign(p, rf(p))));
			if (i < this.Gpieces.length) {
				let p2 = this.Gpieces[i];
				Object.assign(p2, rf(p2));
				p2.faces.forEach(e => {
					e.p1 = rf(e.p1);
					e.p2 = rf(e.p2);
					e.p3 = rf(e.p3);
					e.p4 = rf(e.p4);
				});
			}
		});
	}
	turnCube(side) {
		if (this.turn.turning) return;
		this.pieces.forEach(e => e.turning = (e.pieceId + "xyz").split("").find(e => e == side[0]));
		this.turn.turning = true;
		this.turn.face = side[0];
		this.turn.clockwise = side[side.length - 1] !== "'";
		this.turn.piece = this.findPiece({
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
		this.turn.times = Number(side[1]) || 1;
		this.turnMap();
		if (soundAllowed) {
			sound.play();
			sound.currentTime = 0.14;
		}
	}
	turnMap() {
		this.turn.face
		this.turn.clockwise
		this.turn.times
		let swapCycles = {
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
		let swap = (si1, sq1, si2, sq2) => [this.map[si1][sq1], this.map[si2][sq2]] = [this.map[si2][sq2], this.map[si1][sq1]];
		swapCycles[this.turn.face].forEach(e => {
			if (this.turn.clockwise)
				for (let i = 0; i < this.turn.times; i++) {
					swap(e[0][0], e[0][1], e[1][0], e[1][1]);
					swap(e[0][0], e[0][1], e[2][0], e[2][1]);
					swap(e[0][0], e[0][1], e[3][0], e[3][1]);
				}
			else
				for (let i = 0; i < this.turn.times; i++) {
					swap(e[0][0], e[0][1], e[3][0], e[3][1]);
					swap(e[0][0], e[0][1], e[2][0], e[2][1]);
					swap(e[0][0], e[0][1], e[1][0], e[1][1]);
				}
		});
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
				ctx.fillStyle = colors[sq];
				let padding = 0.05
				ctx.fillRect(x + siX + sqX + padding * sqW, y + siY + sqY + padding * sqW, sqW - 2 * padding * sqW, sqW - 2 * padding * sqW);
			});
		})
	}
	loop() {
		if (this.turn.turning) {
			turnS(!this.scrambling ? this.turn.speed : 40);
			if (this.turn.angle > 90) {
				turnS(90 - this.turn.angle);
				this.turn.angle = 0;
				this.turn.turning = false;
				for (let i = 0; i < this.turn.times; i++) {
					let C = cycles[this.turn.face];
					let Cf = e => {
						if (this.turn.clockwise) {
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
					C.forEach(e => Cf(e.split(",")));
					this.pieces.forEach(e => {
						e.turning = false;
						e.pieceId = e.pieceIdN;
					});
				}
				if (this.scrambling) {
					if (this.scrambleIndex < this.scramble.length - 1) {
						this.scrambleIndex++;
						this.turnCube(this.scramble[this.scrambleIndex]);
					}
					else this.scrambling = false;
				}
			}
		}
		if (!touching) this.rotateCube(rotateI.x, rotateI.y);
		rotateI.x *= 0.95;
		rotateI.y *= 0.95;
		this.draw();
		this.drawMap(canvas.width - 10 - 100, 10, 100);
		if (this.isSolved()) {
			ctx.strokeStyle = "lime";
			ctx.strokeRect(canvas.width - 10 - 100, 10, 100, 75);
		}
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
		return scr.map(e => p_axis[e.axis][e.dir] + p_symbol[e.symbol]).join(" ");
	}
	scrambleCube() {
		if (this.scrambling) return;
		this.scrambling = true;
		this.scramble = this.generateScramble().split(" ");
		this.scrambleIndex = 0;
		this.turnCube(this.scramble[0]);
	}
	findPiece(id) {
		return Rubik.pieces.find(e => e.pieceId == id);
	}
	isSolved() {
		return this.map.map(e => e.reduce((a, b) => a && b === e[0], true)).reduce((a, b) => a && b, true);
	}
}

class Piece {
	constructor(x, y, z, pieceId, geometry, color = [6, 7, 7, 7], rot = [0, 0, 0]) {
		this.x = x * 2.02;
		this.y = y * 2.02;
		this.z = z * 2.02;
		this.pieceId = this.pieceIdN = this.pieceIdO = pieceId;
		this.geometry = JSON.parse(JSON.stringify(m3ds[geometry])).map(e => {
			return {
				color: e.color,
				points: e.points.map(f => {
					let p = {
						x: f[0] + this.x,
						y: f[1] + this.y,
						z: f[2] + this.z
					}
					p = rotateX(p, this, rot[0] * Math.PI / 180);
					p = rotateY(p, this, rot[1] * Math.PI / 180);
					p = rotateZ(p, this, rot[2] * Math.PI / 180);
					return p;
				})
			}
		});
		this.color = color;
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