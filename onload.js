window.onload = () => {
	window.onresize();
	
	content.style.display = 'block';
	
	loop();
};

window.onresize = () => {
	canvas.width = canvas_bg.width = window.innerWidth;
	canvas.height = canvas_bg.height = window.innerHeight;
	
	Rubik.resize();
	Rubik.draw_setup();
	
	Vor.resize();
	Vor.draw_setup();
	Vor.draw();
};