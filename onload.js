window.onload = () => {
	window.onresize();

	window.Rubik = new RubiksCube([
		new Piece(-1, +1, -1, "UFL", "corner", [6, 4, 2, 0], [0, 90, 0]),
		new Piece(+1, +1, -1, "UFR", "corner", [6, 2, 5, 0], [0, 0, 0]),
		new Piece(-1, -1, -1, "DFL", "corner", [6, 2, 4, 1], [180, 180, 0]),
		new Piece(+1, -1, -1, "DFR", "corner", [6, 5, 2, 1], [180, 90, 0]),
		new Piece(-1, +1, +1, "UBL", "corner", [6, 3, 4, 0], [0, 180, 0]),
		new Piece(+1, +1, +1, "UBR", "corner", [6, 5, 3, 0], [0, -90, 0]),
		new Piece(-1, -1, +1, "DBL", "corner", [6, 4, 3, 1], [180, -90, 0]),
		new Piece(+1, -1, +1, "DBR", "corner", [6, 3, 5, 1], [180, 0, 0]),
	
		new Piece(0, +1, -1, "UFM", "edge", [6, 2, 0], [0, 0, 0]),
		new Piece(0, +1, +1, "UBM", "edge", [6, 3, 0], [0, 180, 0]),
		new Piece(0, -1, -1, "DFM", "edge", [6, 2, 1], [180, 180, 0]),
		new Piece(0, -1, +1, "DBM", "edge", [6, 3, 1], [180, 0, 0]),
		new Piece(-1, +1, 0, "ULS", "edge", [6, 4, 0], [0, 90, 0]),
		new Piece(+1, +1, 0, "URS", "edge", [6, 5, 0], [0, -90, 0]),
		new Piece(-1, -1, 0, "DLS", "edge", [6, 4, 1], [180, -90, 0]),
		new Piece(+1, -1, 0, "DRS", "edge", [6, 5, 1], [180, 90, 0]),
		new Piece(-1, 0, -1, "FLE", "edge", [6, 2, 4], [0, 0, 90]),
		new Piece(+1, 0, -1, "FRE", "edge", [6, 2, 5], [0, 0, -90]),
		new Piece(-1, 0, +1, "BLE", "edge", [6, 3, 4], [0, 180, 90]),
		new Piece(+1, 0, +1, "BRE", "edge", [6, 3, 5], [0, 180, -90]),
	
		new Piece(0, 0, +1, "BME", "center", [6, 3], [-90, 0, 0]),
		new Piece(+1, 0, 0, "RSE", "center", [6, 5], [0, 0, -90]),
		new Piece(-1, 0, 0, "LSE", "center", [6, 4], [0, 0, 90]),
		new Piece(0, 0, -1, "FME", "center", [6, 2], [90, 0, 0]),
		new Piece(0, +1, 0, "UMS", "center", [6, 0], [0, 0, 0]),
		new Piece(0, -1, 0, "DMS", "center", [6, 1], [180, 0, 0]),
	
		new Piece(0, 0, 0, "", "core", [6], [0, 0, 0]),
	], [
		new Gpiece(-1, +1, -1, "UFL", [1, 0, 1, 0, 1, 0]),
		new Gpiece(+1, +1, -1, "UFR", [1, 0, 1, 0, 0, 1]),
		new Gpiece(-1, -1, -1, "DFL", [0, 1, 1, 0, 1, 0]),
		new Gpiece(+1, -1, -1, "DFR", [0, 1, 1, 0, 0, 1]),
		new Gpiece(-1, +1, +1, "UBL", [1, 0, 0, 1, 1, 0]),
		new Gpiece(+1, +1, +1, "UBR", [1, 0, 0, 1, 0, 1]),
		new Gpiece(-1, -1, +1, "DBL", [0, 1, 0, 1, 1, 0]),
		new Gpiece(+1, -1, +1, "DBR", [0, 1, 0, 1, 0, 1]),
	
		new Gpiece(0, +1, -1, "UFM", [1, 0, 1, 0, 0, 0]),
		new Gpiece(0, +1, +1, "UBM", [1, 0, 0, 1, 0, 0]),
		new Gpiece(0, -1, -1, "DFM", [0, 1, 1, 0, 0, 0]),
		new Gpiece(0, -1, +1, "DBM", [0, 1, 0, 1, 0, 0]),
		new Gpiece(-1, +1, 0, "ULS", [1, 0, 0, 0, 1, 0]),
		new Gpiece(+1, +1, 0, "URS", [1, 0, 0, 0, 0, 1]),
		new Gpiece(-1, -1, 0, "DLS", [0, 1, 0, 0, 1, 0]),
		new Gpiece(+1, -1, 0, "DRS", [0, 1, 0, 0, 0, 1]),
		new Gpiece(-1, 0, -1, "FLE", [0, 0, 1, 0, 1, 0]),
		new Gpiece(+1, 0, -1, "FRE", [0, 0, 1, 0, 0, 1]),
		new Gpiece(-1, 0, +1, "BLE", [0, 0, 0, 1, 1, 0]),
		new Gpiece(+1, 0, +1, "BRE", [0, 0, 0, 1, 0, 1]),
	
		new Gpiece(0, 0, +1, "BME", [0, 0, 0, 1, 0, 0]),
		new Gpiece(+1, 0, 0, "RSE", [0, 0, 0, 0, 0, 1]),
		new Gpiece(-1, 0, 0, "LSE", [0, 0, 0, 0, 1, 0]),
		new Gpiece(0, 0, -1, "FME", [0, 0, 1, 0, 0, 0]),
		new Gpiece(0, +1, 0, "UMS", [1, 0, 0, 0, 0, 0]),
		new Gpiece(0, -1, 0, "DMS", [0, 1, 0, 0, 0, 0])
	]);

	Rubik.rotateCube(200, -20);

	loop();
};

window.onresize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	scale = Math.min(canvas.width, canvas.height) / 360;
};
