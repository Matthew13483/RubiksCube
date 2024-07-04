window.onload = () => {
	window.onresize();

	loop();
};

window.onresize = () => {
	canvas.width = canvas_bg.width = window.innerWidth;
	canvas.height = canvas_bg.height = window.innerHeight;

	Rubik.resize(canvas.width, canvas.height);

	Vor.resize(canvas_bg.width, canvas_bg.height);
	Vor.drawCells();
};