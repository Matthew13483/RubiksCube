window.onload = () => {
	window.onresize();

	window.Rubik = new RubiksCube();
	Rubik.rotateCube(200, -20, 0);

	loop();
};

window.onresize = () => {
	canvas.width = canvas_bg.width = window.innerWidth;
	canvas.height = canvas_bg.height = window.innerHeight;
	Vor.resize(canvas_bg.width, canvas_bg.height);
};