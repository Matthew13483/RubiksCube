window.onload = () => {
	window.onresize();

	loop();
};

window.onresize = () => {
	canvas.width = canvas_bg.width = window.innerWidth;
	canvas.height = canvas_bg.height = window.innerHeight;

	Vor.resize(canvas_bg.width, canvas_bg.height);
};