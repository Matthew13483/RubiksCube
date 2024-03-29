let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

let startEvent = isTouchDevice ? 'touchstart' : 'mousedown';
let moveEvent = isTouchDevice ? 'touchmove' : 'mousemove';
let endEvent = isTouchDevice ? 'touchend' : 'mouseup';

canvas.addEventListener(startEvent, handleStart);
canvas.addEventListener(moveEvent, handleMove);
canvas.addEventListener(endEvent, handleEnd);

function handleStart(event) {
	if (isTouchDevice) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let touch = event.changedTouches[i];
			if (typeof st.identifier == "undefined") {
				st.identifier = touch.identifier;
				let x = touch.pageX - event.target.getBoundingClientRect().left;
				let y = touch.pageY - event.target.getBoundingClientRect().top;
				TouchStart(x, y);
			}
		}
	} else {
		let x = event.pageX - event.target.getBoundingClientRect().left;
		let y = event.pageY - event.target.getBoundingClientRect().top;
		TouchStart(x, y);
	}
	touching = true;
}

function handleMove(event) {
	if (isTouchDevice) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let f = event.changedTouches.item(i);
			if (st.identifier == f.identifier) {
				let x = f.pageX - event.target.getBoundingClientRect().left;
				let y = f.pageY - event.target.getBoundingClientRect().top;
				TouchMove(x, y);
			}
		}
	} else {
		let x = event.pageX - event.target.getBoundingClientRect().left;
		let y = event.pageY - event.target.getBoundingClientRect().top;
		TouchMove(x, y);
	}
	touching = true;
}

function handleEnd(event) {
	if (isTouchDevice) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let f = event.changedTouches.item(i);
			if (st.identifier == f.identifier) {
				st.identifier = undefined;
			}
		}
	}
	touching = false;
}

function TouchStart(x, y) {
	st.x = x;
	st.y = y;
	let intng = false;
	let cube;
	let face;
	let faceI;
	rotateI.x = rotateI.y = 0;
	Rubik.Gpieces.forEach((c, i1) => {
		c.faces.forEach((e, i) => {
			let p1 = c32(e.p1.x * scale, e.p1.y * scale, e.p1.z + pos.z);
			let p2 = c32(e.p2.x * scale, e.p2.y * scale, e.p2.z + pos.z);
			let p3 = c32(e.p3.x * scale, e.p3.y * scale, e.p3.z + pos.z);
			let p4 = c32(e.p4.x * scale, e.p4.y * scale, e.p4.z + pos.z);
			let Ply = new Polygon([
				new Point(p1.x + canvas.width / 2, -p1.y + canvas.height / 2),
				new Point(p2.x + canvas.width / 2, -p2.y + canvas.height / 2),
				new Point(p3.x + canvas.width / 2, -p3.y + canvas.height / 2),
				new Point(p4.x + canvas.width / 2, -p4.y + canvas.height / 2)
			]);
			if (clockwise(e.p1, e.p2, e.p3) && c.acFaces[i] && cllnPolyPnt(Ply, st)) {
				intng = true;
				cube = Rubik.Gpieces[i1];
				face = cube.faces[i];
				faceI = i;
			}
		});
	});
	st.intng = intng;
	st.cube = cube;
	st.face = face;
	st.faceI = faceI;
	st.gotLine = false;
}

function TouchMove(x, y) {
	let ax = -(st.y - y);
	let ay = (st.x - x);
	if (st.intng && !st.gotLine) {
		let c = st.cube;
		let e = st.face;
		let p1 = c32(e.p1.x * scale, e.p1.y * scale, e.p1.z + pos.z);
		let p2 = c32(e.p2.x * scale, e.p2.y * scale, e.p2.z + pos.z);
		let p3 = c32(e.p3.x * scale, e.p3.y * scale, e.p3.z + pos.z);
		let p4 = c32(e.p4.x * scale, e.p4.y * scale, e.p4.z + pos.z);
		let Ply = new Polygon([
			new Point(p1.x + canvas.width / 2, -p1.y + canvas.height / 2),
			new Point(p2.x + canvas.width / 2, -p2.y + canvas.height / 2),
			new Point(p3.x + canvas.width / 2, -p3.y + canvas.height / 2),
			new Point(p4.x + canvas.width / 2, -p4.y + canvas.height / 2)
		]);
		let lines = Ply.points.map((e, i, a) => new Line(e, a[(i + 1) % a.length]));
		if (turnAtlas[c.pieceId]) {
			lines.forEach((e, i2) => {
				let a = Math.atan2(y - st.y, x - st.x);
				let d = canvas.width; //Math.hypot(st.y - y, st.x - x) * 1e6;
				let p = new Point(st.x + Math.cos(a) * d, st.y + Math.sin(a) * d);
				if (cllnLineLine(e, new Line(st, p))) {
					Turn(turnAtlas[c.pieceId][st.faceI].split(",")[i2]);
					st.gotLine = true;
				}
			});
		}
	}
	if (!st.intng) {
		Rubik.rotateCube(ax * (300 / Math.min(canvas.width, canvas.height)), ay * (300 / Math.min(canvas.width, canvas.height)));
		rotateI.x = ax * (300 / Math.min(canvas.width, canvas.height));
		rotateI.y = ay * (300 / Math.min(canvas.width, canvas.height));
	}

	st.x = x;
	st.y = y;
};

/*
canvas.ontouchstart = e => {
	for (let i = 0; i < e.changedTouches.length; i++) {
		let f = e.changedTouches.item(i);
		if (typeof st.identifier == "undefined") {
			st.identifier = f.identifier;
			let x = f.pageX - e.target.getBoundingClientRect().left;
			let y = f.pageY - e.target.getBoundingClientRect().top;
			TouchStart(x, y);
		}
	}
	touching = true;
};

canvas.ontouchmove = e => {
	for (let i = 0; i < e.changedTouches.length; i++) {
		let f = e.changedTouches.item(i);
		if (st.identifier == f.identifier) {
			let x = f.pageX - e.target.getBoundingClientRect().left;
			let y = f.pageY - e.target.getBoundingClientRect().top;
			TouchMove(x, y);
		}
	}
	touching = true;
};

canvas.ontouchend = e => {
	for (let i = 0; i < e.changedTouches.length; i++) {
		let f = e.changedTouches.item(i);
		if (st.identifier == f.identifier) {
			st.identifier = undefined;
		}
	}
	touching = false;
};
*/
