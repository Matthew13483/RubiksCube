let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

canvas.addEventListener(isTouchDevice ? 'touchstart' : 'mousedown', handleStart);
canvas.addEventListener(isTouchDevice ? 'touchmove' : 'mousemove', handleMove);
canvas.addEventListener(isTouchDevice ? 'touchend' : 'mouseup', handleEnd);
canvas.addEventListener(isTouchDevice ? 'touchcancel' : '', handleCancel);

function handleStart(event) {
	event.preventDefault();
	if (isTouchDevice) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let touch = event.changedTouches.item(i);
			let x = touch.pageX - event.target.getBoundingClientRect().left;
			let y = touch.pageY - event.target.getBoundingClientRect().top;
			Rubik.touchStart(x, y, touch.identifier);
		}
	} else {
		let x = event.pageX - event.target.getBoundingClientRect().left;
		let y = event.pageY - event.target.getBoundingClientRect().top;
		Rubik.touchStart(x, y, 0);
	}
}

function handleMove(event) {
	event.preventDefault();
	if (isTouchDevice) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let touch = event.changedTouches.item(i);
			let x = touch.pageX - event.target.getBoundingClientRect().left;
			let y = touch.pageY - event.target.getBoundingClientRect().top;
			Rubik.touchMove(x, y, touch.identifier);
		}
	} else {
		let x = event.pageX - event.target.getBoundingClientRect().left;
		let y = event.pageY - event.target.getBoundingClientRect().top;
		Rubik.touchMove(x, y, 0);
	}
}

function handleEnd(event) {
	event.preventDefault();
	if (isTouchDevice) {
		for (let i = 0; i < event.changedTouches.length; i++) {
			let touch = event.changedTouches.item(i);
			Rubik.touchEnd(touch.identifier);
		}
	}
	else Rubik.touchEnd(0);
}

function handleCancel(event) {
	Rubik.touchCancel();
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