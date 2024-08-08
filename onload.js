window.onload = () => {
	Rubik = new RubiksCube();
	Rubik.rotateCube(0, -0.35, 0);
	Rubik.rotateCube(-3.5, 0, 0);

	window.onresize();

	content.style.display = 'block';

	loop();
};

window.onresize = () => {
	canvas.width = canvas_bg.width = window.innerWidth;
	canvas.height = canvas_bg.height = window.innerHeight;

	Rubik.resize(canvas.width, canvas.height);

	Vor.resize();
	Vor.draw();
};