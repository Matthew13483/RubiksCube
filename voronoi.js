class Voronoi {
	constructor(dw, dh, gw, gh) {
		this.display = { width: dw, height: dh };
		this.grid = { width: gw, height: gh, cells: [] };
		for (let y = 0; y < gh; y++) {
			for (let x = 0; x < gw; x++) {
				this.grid.cells.push({
					x: Math.random(),
					y: Math.random(),
					c: Math.random()
				});
			}
		}
		this.grid.cells_neighbors = this.grid.cells.map((p, i) => {
			let x = i % this.grid.width;
			let y = Math.floor(i / this.grid.width);
			let n = [];
			let scope = +3;
			for (let ny = -scope; ny <= scope; ny++) {
				for (let nx = -scope; nx <= scope; nx++) {
					if (!(nx === 0 && ny === 0)) {
						if (x + nx >= 0 && x + nx < this.grid.width && y + ny >= 0 && y + ny < this.grid.height) {
							n.push((x + nx) + (y + ny) * this.grid.width);
						}
					}
				}
			}
			return n;
		});
		this.gl = GL(canvas_bg);
	}

	resize(dw, dh) {
		this.display.width = dw;
		this.display.height = dh;
		GLresize(this.gl);
	}

	movePoints() {
		let randomWalk = p => {
			if (!p.vx) p.vx = 0;
			if (!p.vy) p.vy = 0;
			p.x += p.vx;
			p.y += p.vy;
			if (p.x < 0) p.x = p.vx *= -1;
			if (p.x >= 1) p.x = 1 + (p.vx *= -1);
			if (p.y < 0) p.y = p.vy *= -1;
			if (p.y >= 1) p.y = 1 + (p.vy *= -1);
			p.vx += 0.001 * (0.1 * (Math.random() - 0.5) - 0.01 * p.vx);
			p.vy += 0.001 * (0.1 * (Math.random() - 0.5) - 0.01 * p.vy);
		};
		this.grid.cells.forEach(cell => {
			randomWalk(cell);
			if (!cell.vc) cell.vc = 0;
			cell.c += cell.vc;
			if (cell.c < 0) cell.c = cell.vc *= -1;
			if (cell.c >= 1) cell.c = 1 + (cell.vc *= -1);
			cell.vc += 0.001 * (0.1 * (Math.random() - 0.5) - 0.01 * cell.vc);
		});
	}

	grid2display() {
		return this.grid.cells.map((cell, i) => ({
			x: ((i % this.grid.width) + cell.x) * this.display.width / this.grid.width,
			y: (Math.floor(i / this.grid.width) + cell.y) * this.display.height / this.grid.height
		}));
	}

	bisector(p, q) {
		let x1 = p.x;
		let y1 = p.y;
		let x2 = q.x;
		let y2 = q.y;
		let x0 = (x1 + x2) / 2;
		let y0 = (y1 + y2) / 2;
		let a = x2 - x1;
		let b = y2 - y1;
		let c = -a * x0 - b * y0;
		return { a: a, b: b, c: c };
	}

	intersections(line, poly) {
		let tol = 1e-9;
		let ints = [];
		poly.forEach((A, i) => {
			let B = poly[(i + 1) % poly.length];
			let ux = line.a;
			let uy = line.b;
			let uz = line.c;
			let vx = A.y - B.y;
			let vy = B.x - A.x;
			let vz = A.x * B.y - B.x * A.y;
			let z1 = uy * vz - uz * vy;
			let z2 = uz * vx - ux * vz;
			let z3 = ux * vy - uy * vx;
			if (Math.abs(z3) > tol) {
				let x = z1 / z3;
				let y = z2 / z3;
				let x1 = Math.min(A.x, B.x) - tol;
				let x2 = Math.max(A.x, B.x) + tol;
				let y1 = Math.min(A.y, B.y) - tol;
				let y2 = Math.max(A.y, B.y) + tol;
				if (x1 <= x && x <= x2 && y1 <= y && y <= y2) ints.push({ p: { x: x, y: y }, i: i });
			}
		});
		return ints;
	}

	inPoly(p, poly) {
		let x0 = 0;
		let y0 = 0;
		poly.forEach(v => {
			x0 += v.x / poly.length;
			y0 += v.y / poly.length;
		});
		let a = (p.y - y0);
		let b = -(p.x - x0);
		let c = -a * x0 - b * y0;
		let ints = this.intersections({ a: a, b: b, c: c }, poly);
		if (ints.length < 2) return false;
		let p1 = ints[0].p;
		let p2 = ints[1].p;
		let v1 = { x: p1.x - p.x, y: p1.y - p.y };
		let v2 = { x: p2.x - p.x, y: p2.y - p.y };
		return (v1.x * v2.x + v1.y * v2.y) < 0;
	}

	getCells() {
		let S = this.grid2display();
		let padding = this.display.width / this.grid.width;
		let Box = [
			{ x: -padding, y: -padding },
			{ x: this.display.width + padding, y: -padding },
			{ x: this.display.width + padding, y: this.display.height + padding },
			{ x: -padding, y: this.display.height + padding }
		];
		let cells = [];
		S.forEach((p, i) => {
			let cell = Box;
			this.grid.cells_neighbors[i].forEach(j => {
				let q = S[j];
			//S.forEach(q => {
				//if (q === p) return;
				let B = this.bisector(p, q);
				let ints = this.intersections(B, cell);
				if (ints.length === 2) {
					let t1 = ints[0].p;
					let t2 = ints[1].p;
					let xi = [];
					let xj = [];
					for (let i = (ints[0].i + 1) % cell.length; i != (ints[1].i + 1) % cell.length; i = (i + 1) % cell.length) {
						xi.push(cell[i]);
					}
					for (let i = (ints[1].i + 1) % cell.length; i != (ints[0].i + 1) % cell.length; i = (i + 1) % cell.length) {
						xj.push(cell[i]);
					}
					let newCell = [t1, ...xi, t2];
					if (!this.inPoly(p, newCell)) newCell = [t2, ...xj, t1];
					cell = newCell;
				}
			});
			cells.push(cell);
		});
		return cells;
	}

	draw() {
		/*this.grid2display().forEach(e => {
			ctx_bg.beginPath();
			ctx_bg.arc(e.x, e.y, 3, 0, 2 * Math.PI);
			ctx_bg.lineWidth = 1;
			ctx_bg.strokeStyle = '#d95252';
			ctx_bg.stroke();
		});*/
	}

	drawCells() {
		this.getCells().forEach((cell, i) => {
			let x = i % this.grid.width;
			let y = Math.floor(i / this.grid.width);
			let f = 3;
			let [r, g, b] = [24, 24, 48];
			let [r2, g2, b2] = [32, 32, 64];
			let r3 = r + Math.floor((r2 - r) * (y / this.grid.height) + this.grid.cells[i].c * f);
			let g3 = g + Math.floor((g2 - g) * (y / this.grid.height) + this.grid.cells[i].c * f);
			let b3 = b + Math.floor((b2 - b) * (y / this.grid.height) + this.grid.cells[i].c * f);
			GLdrawPoly(this.gl, cell, [ r3 / 255, g3 / 255, b3 / 255, 1 ]);
		});
	}
}