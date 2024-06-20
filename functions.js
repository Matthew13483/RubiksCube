function map(x, x1, x2, y1, y2) {
	return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

function getNormal(a, b, c) {
	let l1 = new Point(a.x - b.x, a.y - b.y, a.z - b.z);
	let l2 = new Point(c.x - b.x, c.y - b.y, c.z - b.z);
	let normal = new Point(
		l1.y * l2.z - l1.z * l2.y,
		l1.z * l2.x - l1.x * l2.z,
		l1.x * l2.y - l1.y * l2.x
	);
	let l = Math.hypot(normal.x, normal.y, normal.z);
	normal.x /= l;
	normal.y /= l;
	normal.z /= l;
	return normal;
}

function clockwise(a, b, c) {
	let normal = getNormal(a, b, c);
	let p = new Point(0, 0, -pos.z);
	return (
		normal.x * (b.x - p.x) +
		normal.y * (b.y - p.y) +
		normal.z * (b.z - p.z)) > 0;
}

function basicLighting(a, b, c, d) {
	return getNormal(a, b, c).y;
}

function c32(x, y, z, w, h) {
	let FOV = 60 * Math.PI / 180;
	let fl = Math.hypot(w, h) / (2 * Math.tan(FOV / 2));
	return {
		x: x * fl / z,
		y: y * fl / z
	}
}

function rotateX(p, rp, a) {
	return {
		x: p.x,
		y: (p.y - rp.y) * Math.cos(a) + (p.z - rp.z) * Math.sin(a) + rp.y,
		z: (p.z - rp.z) * Math.cos(a) - (p.y - rp.y) * Math.sin(a) + rp.z
	};
}

function rotateY(p, rp, a) {
	return {
		x: (p.x - rp.x) * Math.cos(a) + (p.z - rp.z) * Math.sin(a) + rp.x,
		y: p.y,
		z: (p.z - rp.z) * Math.cos(a) - (p.x - rp.x) * Math.sin(a) + rp.z
	};
}

function rotateZ(p, rp, a) {
	return {
		x: (p.x - rp.x) * Math.cos(a) - (p.y - rp.y) * Math.sin(a) + rp.x,
		y: (p.y - rp.y) * Math.cos(a) + (p.x - rp.x) * Math.sin(a) + rp.y,
		z: p.z
	};
}

class Point {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Line {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}
}

class Polygon {
	constructor(points) {
		this.points = points;
	}
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

function cllnPolyPnt(poly, pnt) {
	let maxX = poly.points.map(e => e.x).reduce((a, b) => a > b ? a : b);
	return poly.points.map((e, i, a) => {
		return cllnLineLine(new Line(e, a[(i + 1) % a.length]), new Line(pnt, new Point(Math.abs(maxX) * 2, pnt.y))) ? 1 : 0;
	}).reduce((a, b) => a + b) % 2 == 1;
}