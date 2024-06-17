class RubiksCube {
	constructor(pieces, Gpieces) {
		this.pieces = pieces;
		this.Gpieces = Gpieces;
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
