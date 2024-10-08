window.onload = () => {
	window.onresize();

	content.style.display = 'block';

	loop();
};

window.onresize = () => {
	canvas.width = canvas_bg.width = window.innerWidth;
	canvas.height = canvas_bg.height = window.innerHeight;

	Rubik.resize(canvas.width, canvas.height);
	Rubik.draw_setup();

	Vor.resize();
	Vor.draw();
};