window.onload = () => {
	window.onresize();

	window.Rubik = new RubiksCube();
	Rubik.rotateCube(200, -20, 0);

	loop();
};

window.onresize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	scale = Math.min(canvas.width, canvas.height) / 360;
};