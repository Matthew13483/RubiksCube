class RubiksCube {
	constructor(pieces, Gpieces) {
		this.pieces = pieces;
		this.Gpieces = Gpieces;
		this.turn = {
			turning: false,
			angle: 0,
			speed: 15
		};
		this.scrambling = false;
		this.scramble;
		this.scrambleIndex = 0;

		this.map
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
		}[side[0]]);
		this.turn.times = Number(side[1]) || 1;
		if (soundAllowed) {
			sound.play();
			sound.currentTime = 0.14;
		}
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
