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
			sT.push({
				id: touch.identifier
			});
			let x = touch.pageX - event.target.getBoundingClientRect().left;
			let y = touch.pageY - event.target.getBoundingClientRect().top;
			Rubik.touchStart(x, y, touch.identifier);
		}
	} else {
		let x = event.pageX - event.target.getBoundingClientRect().left;
		let y = event.pageY - event.target.getBoundingClientRect().top;
		Rubik.touchStart(x, y);
	}
}

function handleMove(event) {
	if (isTouchDevice) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let f = event.changedTouches.item(i);
			sT.forEach(e => {
				if (e.id == f.identifier) {
					let x = f.pageX - event.target.getBoundingClientRect().left;
					let y = f.pageY - event.target.getBoundingClientRect().top;
					Rubik.touchMove(x, y, e.id);
				}
			});
		}
	} else {
		let x = event.pageX - event.target.getBoundingClientRect().left;
		let y = event.pageY - event.target.getBoundingClientRect().top;
		Rubik.touchMove(x, y);
	}
}

function handleEnd(event) {
	if (isTouchDevice) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let f = event.changedTouches.item(i);
			sT.forEach(e => {
				if (e.id == f.identifier) {
					e.id = undefined;
				}
			});
		}
	}
	Rubik.touchEnd();
}

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