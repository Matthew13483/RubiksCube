function dist(a, b) {
	return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function Vlength(v) {
	return Math.sqrt(Vdot(v, v));
}

function Vneg(v) {
	return { x: -v.x, y: -v.y, z: -v.z };
}

function Vadd(...vec) {
	return vec.reduce((a, b) => ({
		x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z
	}));
}

function Vsub(a, b) {
	return {
		x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z
	};
}

function Vscale(v, s) {
	return {
		x: v.x * s,
		y: v.y * s,
		z: v.z * s
	};
}

function Vnormalize(v) {
	return Vscale(v, 1 / Vlength(v));
}

function Vdot(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

function Vcross(a, b) {
	return {
		x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x
	};
}

function Vmatrix(mat, v) {
	//return Vadd(Vscale(mat[0], v.x), Vscale(mat[1], v.y), Vscale(mat[2], v.z));
	return {
		x: mat[0].x * v.x + mat[1].x * v.y + mat[2].x * v.z,
		y: mat[0].y * v.x + mat[1].y * v.y + mat[2].y * v.z,
		z: mat[0].z * v.x + mat[1].z * v.y + mat[2].z * v.z
	};
}

function getNormal(poly) {
	return Vnormalize(Vcross(Vsub(poly[0], poly[1]), Vsub(poly[2], poly[1])));
}

function centroid(poly) {
	let areaT = 0;
	let centroidT = { x: 0, y: 0, z: 0 };
	for (let i = 2; i < poly.length; i++) {
		let v1 = poly[0];
		let v2 = poly[i - 1];
		let v3 = poly[i];
		let a = Vsub(v2, v1);
		let b = Vsub(v3, v1);
		let area = Vlength(Vcross(a, b)) / 2;
		let centroid = Vscale(Vadd(v1, v2, v3), 1 / 3);
		areaT += area;
		centroidT = Vadd(centroidT, Vscale(centroid, area));
	}
	centroidT = Vscale(centroidT, 1 / areaT);
	return centroidT;
}

function rotateX(point, angle) {
	return Vmatrix([
		{ x: 1, y: 0, z: 0 },
		{ x: 0, y: Math.cos(angle), z: -Math.sin(angle) },
		{ x: 0, y: Math.sin(angle), z: Math.cos(angle) }
	], point);
	/*{
		x: p.x,
		y: (p.y - rp.y) * Math.cos(a) + (p.z - rp.z) * Math.sin(a) + rp.y,
		z: (p.z - rp.z) * Math.cos(a) - (p.y - rp.y) * Math.sin(a) + rp.z
	};*/
}

function rotateY(point, angle) {
	return Vmatrix([
		{ x: Math.cos(angle), y: 0, z: Math.sin(angle) },
		{ x: 0, y: 1, z: 0 },
		{ x: -Math.sin(angle), y: 0, z: Math.cos(angle) }
	], point);
	/*{
		x: (p.x - rp.x) * Math.cos(a) + (p.z - rp.z) * Math.sin(a) + rp.x,
		y: p.y,
		z: (p.z - rp.z) * Math.cos(a) - (p.x - rp.x) * Math.sin(a) + rp.z
	};*/
}

function rotateZ(point, angle) {
	return Vmatrix([
		{ x: Math.cos(angle), y: -Math.sin(angle), z: 0 },
		{ x: Math.sin(angle), y: Math.cos(angle), z: 0 },
		{ x: 0, y: 0, z: 1 }
	], point);
	/*{
		x: (p.x - rp.x) * Math.cos(a) - (p.y - rp.y) * Math.sin(a) + rp.x,
		y: (p.y - rp.y) * Math.cos(a) + (p.x - rp.x) * Math.sin(a) + rp.y,
		z: p.z
	};*/
}

function rotateAxis(point, angle, axis) {
	let v = point;
	let k = axis;
	//vrot = vcosθ + (k×v)sinθ + k(k•v)(1-cosθ)
	return Vadd(Vscale(v, Math.cos(angle)), Vscale(Vcross(k, v), Math.sin(angle)), Vscale(k, Vdot(k, v) * (1 - Math.cos(angle))));
}

function cllnLineLine(l1, l2) {
	let x1 = l1.p1.x;
	let y1 = l1.p1.y;
	let x2 = l1.p2.x;
	let y2 = l1.p2.y;
	let x3 = l2.p1.x;
	let y3 = l2.p1.y;
	let x4 = l2.p2.x;
	let y4 = l2.p2.y;
	let den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;
	if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
		return {
			x: x1 + ua * (x2 - x1),
			y: y1 + ua * (y2 - y1)
		};
	}
	return false;
}

function cllnPolyPnt(poly, point) {
	let maxX = 2 * Math.abs(poly.points.map(e => e.x).reduce((a, b) => a > b ? a : b));
	return poly.points.map((e, i, a) => {
		return cllnLineLine(
			{ p1: e, p2: a[(i + 1) % a.length] },
			{ p1: point, p2: { x: maxX, y: point.y } }
		) ? 1 : 0;
	}).reduce((a, b) => a + b) % 2 == 1;
}