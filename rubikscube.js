"use strict";

class RubiksCube {

	constructor(canvas) {
		this.canvas = canvas;
		
		let handleStart = event => {
			let scale = window.visualViewport ? window.visualViewport.scale : 1;
			if (scale <= 1.001) event.preventDefault();
			else return;
			if (isTouchDevice) {
				for (let i = 0; i < event.changedTouches.length; i++) {
					let touch = event.changedTouches.item(i);
					let x = touch.pageX - event.target.getBoundingClientRect().left;
					let y = touch.pageY - event.target.getBoundingClientRect().top;
					this.touchStart(x, y, touch.identifier);
				}
			} else {
				let x = event.pageX - event.target.getBoundingClientRect().left;
				let y = event.pageY - event.target.getBoundingClientRect().top;
				this.touchStart(x, y, 0);
			}
		};
		let handleMove = event => {
			let scale = window.visualViewport ? window.visualViewport.scale : 1;
			if (scale <= 1.001) event.preventDefault();
			else return;
			if (isTouchDevice) {
				for (let i = 0; i < event.changedTouches.length; i++) {
					let touch = event.changedTouches.item(i);
					let x = touch.pageX - event.target.getBoundingClientRect().left;
					let y = touch.pageY - event.target.getBoundingClientRect().top;
					this.touchMove(x, y, touch.identifier);
				}
			} else {
				let x = event.pageX - event.target.getBoundingClientRect().left;
				let y = event.pageY - event.target.getBoundingClientRect().top;
				this.touchMove(x, y, 0);
			}
		};
		let handleEnd = event => {
			let scale = window.visualViewport ? window.visualViewport.scale : 1;
			if (scale <= 1.001) event.preventDefault();
			else return;
			if (isTouchDevice) {
				for (let i = 0; i < event.changedTouches.length; i++) {
					let touch = event.changedTouches.item(i);
					this.touchEnd(touch.identifier);
				}
			}
			else this.touchEnd(0);
		};
		let handleCancel = event => {
			this.touchCancel();
		}
		
		let isTouchDevice = navigator.maxTouchPoints;
		
		this.canvas.addEventListener(isTouchDevice ? 'touchstart' : 'mousedown', handleStart);
		this.canvas.addEventListener(isTouchDevice ? 'touchmove' : 'mousemove', handleMove);
		this.canvas.addEventListener(isTouchDevice ? 'touchend' : 'mouseup', handleEnd);
		this.canvas.addEventListener(isTouchDevice ? 'touchcancel' : 'mouseout', handleCancel);
		
		this.pieces = [
			new Piece(-1, +1, +1, "UFL", "corner", [0, 2, 3, 1], [0, 0, 1, 0, 1, 0, -1, 0, 0]),
			new Piece(+1, +1, +1, "UFR", "corner", [0, 3, 4, 1], [1, 0, 0, 0, 1, 0, 0, 0, 1]),
			new Piece(-1, -1, +1, "DFL", "corner", [0, 3, 2, 6], [-1, 0, 0, 0, -1, 0, 0, 0, 1]),
			new Piece(+1, -1, +1, "DFR", "corner", [0, 4, 3, 6], [0, 0, 1, 0, -1, 0, 1, 0, 0]),
			new Piece(-1, +1, -1, "UBL", "corner", [0, 5, 2, 1], [-1, 0, 0, 0, 1, 0, 0, 0, -1]),
			new Piece(+1, +1, -1, "UBR", "corner", [0, 4, 5, 1], [0, 0, -1, 0, 1, 0, 1, 0, 0]),
			new Piece(-1, -1, -1, "DBL", "corner", [0, 2, 5, 6], [0, 0, -1, 0, -1, 0, -1, 0, 0]),
			new Piece(+1, -1, -1, "DBR", "corner", [0, 5, 4, 6], [1, 0, 0, 0, -1, 0, 0, 0, -1]),

			new Piece(0, +1, +1, "UF", "edge", [0, 3, 1], [1, 0, 0, 0, 1, 0, 0, 0, 1]),
			new Piece(0, +1, -1, "UB", "edge", [0, 5, 1], [-1, 0, 0, 0, 1, 0, 0, 0, -1]),
			new Piece(0, -1, +1, "DF", "edge", [0, 3, 6], [-1, 0, 0, 0, -1, 0, 0, 0, 1]),
			new Piece(0, -1, -1, "DB", "edge", [0, 5, 6], [1, 0, 0, 0, -1, 0, 0, 0, -1]),
			new Piece(-1, +1, 0, "UL", "edge", [0, 2, 1], [0, 0, 1, 0, 1, 0, -1, 0, 0]),
			new Piece(+1, +1, 0, "UR", "edge", [0, 4, 1], [0, 0, -1, 0, 1, 0, 1, 0, 0]),
			new Piece(-1, -1, 0, "DL", "edge", [0, 2, 6], [0, 0, -1, 0, -1, 0, -1, 0, 0]),
			new Piece(+1, -1, 0, "DR", "edge", [0, 4, 6], [0, 0, 1, 0, -1, 0, 1, 0, 0]),
			new Piece(-1, 0, +1, "FL", "edge", [0, 3, 2], [0, 1, 0, -1, 0, 0, 0, 0, 1]),
			new Piece(+1, 0, +1, "FR", "edge", [0, 3, 4], [0, -1, 0, 1, 0, 0, 0, 0, 1]),
			new Piece(-1, 0, -1, "BL", "edge", [0, 5, 2], [0, -1, 0, -1, 0, 0, 0, 0, -1]),
			new Piece(+1, 0, -1, "BR", "edge", [0, 5, 4], [0, 1, 0, 1, 0, 0, 0, 0, -1]),

			new Piece(0, 0, -1, "B", "center", [0, 5], [-1, 0, 0, 0, 0, -1, 0, -1, 0]),
			new Piece(+1, 0, 0, "R", "center", [0, 4], [0, -1, 0, 1, 0, 0, 0, 0, 1]),
			new Piece(-1, 0, 0, "L", "center", [0, 2], [0, 1, 0, -1, 0, 0, 0, 0, 1]),
			new Piece(0, 0, +1, "F", "center", [0, 3], [-1, 0, 0, 0, 0, 1, 0, 1, 0]),
			new Piece(0, +1, 0, "U", "center", [0, 1], [1, 0, 0, 0, 1, 0, 0, 0, 1]),
			new Piece(0, -1, 0, "D", "center", [0, 6], [1, 0, 0, 0, -1, 0, 0, 0, -1]),

			new Piece(0, 0, 0, "0", "core", [0], [1, 0, 0, 0, 1, 0, 0, 0, 1]),
		];
		
		this.center_pieces = {
			U: this.pieces.find(e => e.id === "U"),
			L: this.pieces.find(e => e.id === "L"),
			F: this.pieces.find(e => e.id === "F"),
			R: this.pieces.find(e => e.id === "R"),
			B: this.pieces.find(e => e.id === "B"),
			D: this.pieces.find(e => e.id === "D"),
		};
		
		this.cyclesMap = {
			U: [[[0, 0], [0, 2], [0, 8], [0, 6]], [[0, 1], [0, 5], [0, 7], [0, 3]], [[1, 0], [4, 0], [3, 0], [2, 0]], [[1, 1], [4, 1], [3, 1], [2, 1]], [[1, 2], [4, 2], [3, 2], [2, 2]]],
			D: [[[5, 0], [5, 2], [5, 8], [5, 6]], [[5, 1], [5, 5], [5, 7], [5, 3]], [[1, 6], [2, 6], [3, 6], [4, 6]], [[1, 7], [2, 7], [3, 7], [4, 7]], [[1, 8], [2, 8], [3, 8], [4, 8]]],
			F: [[[2, 0], [2, 2], [2, 8], [2, 6]], [[2, 1], [2, 5], [2, 7], [2, 3]], [[0, 6], [3, 0], [5, 2], [1, 8]], [[0, 7], [3, 3], [5, 1], [1, 5]], [[0, 8], [3, 6], [5, 0], [1, 2]]],
			B: [[[4, 0], [4, 2], [4, 8], [4, 6]], [[4, 1], [4, 5], [4, 7], [4, 3]], [[0, 0], [1, 6], [5, 8], [3, 2]], [[0, 1], [1, 3], [5, 7], [3, 5]], [[0, 2], [1, 0], [5, 6], [3, 8]]],
			L: [[[1, 0], [1, 2], [1, 8], [1, 6]], [[1, 1], [1, 5], [1, 7], [1, 3]], [[0, 0], [2, 0], [5, 0], [4, 8]], [[0, 3], [2, 3], [5, 3], [4, 5]], [[0, 6], [2, 6], [5, 6], [4, 2]]],
			R: [[[3, 0], [3, 2], [3, 8], [3, 6]], [[3, 1], [3, 5], [3, 7], [3, 3]], [[0, 2], [4, 6], [5, 2], [2, 2]], [[0, 5], [4, 3], [5, 5], [2, 5]], [[0, 8], [4, 0], [5, 8], [2, 8]]],
		};
		
		this.solves_string = JSON.parse(localStorage.getItem('solves') || '[]');
		
		for (let i = this.solves_string.length - 1; i >= 0; i--) {
			let solve_string = this.solves_string[i];
			let time = Number(solve_string.split(' ')[1]);
			let li = document.createElement('li');
			li.textContent = (time / 1000).toFixed(3);
			li.onclick = () => this.solve_click(solve_string, i);
			li.id = 'solve_' + i;
			times_list.appendChild(li);
		}
		
		this.stat = {
			c1: Infinity, c3: Infinity, c5: Infinity, c12: Infinity, c50: Infinity, c100: Infinity,
			b1: Infinity, b3: Infinity, b5: Infinity, b12: Infinity, b50: Infinity, b100: Infinity
		};
		this.updateTable(true);
		
		this.show_map = false;
		
		this.reset();
	}

	init_gl() {
		let gl = canvas.getContext("webgl", { alpha: true });
		if (!gl) {
			console.error('WebGL is not supported');
			return;
		}
		
		let createShader = (gl, type, source) => {
			let shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
			if (success) return shader;
			
			console.log(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
		};
		
		let vertexShaderSource = `
				attribute vec3 a_position;
				attribute vec3 a_normal;
				attribute vec3 a_color;
				attribute float a_id;
				attribute float a_type;
				
				uniform vec2 u_resolution;
				uniform mat4 u_iMat[27];
				uniform mat4 u_pMat;
				uniform mat4 u_mMat;
				uniform mat4 u_vMat;
		
				varying vec3 v_position;
				varying vec3 v_color;
				varying vec3 v_normal;
				varying float v_type;
				
				void main() {
					vec4 worldPos = u_mMat * u_iMat[int(a_id)] * vec4(a_position, 1.0);
					gl_Position = u_pMat * u_vMat * worldPos;
					v_position = vec3(worldPos);
					v_normal = mat3(u_mMat) * mat3(u_iMat[int(a_id)]) * a_normal;
					v_color = a_color;
					v_type = a_type;
				}
			`;
		let fragmentShaderSource = `
				precision mediump float;
				uniform vec3 camPos;
				
				uniform vec3 lightSources[5];
				uniform vec3 lightColors[5];
				
				uniform sampler2D u_image;
				
				varying vec3 v_position;
				varying vec3 v_color;
				varying vec3 v_normal;
				varying float v_type;
				
				void main() {
					vec2 pos = gl_FragCoord.xy;
					
					vec3 color = v_color;
					float alpha = 1.0;
					float diff_mul = 1.0;
					float spec_mul = 1.0;
					
					if (v_type == -1.0) {
						color = texture2D(u_image, v_color.xy).xyz;
						alpha = texture2D(u_image, v_color.xy).a;
					}
					if (v_type == 0.0) {
						diff_mul = 0.9;
						spec_mul = 0.5;
					}
					
					float len = length(v_position);
					diff_mul = min(diff_mul * 0.444 * len * len, diff_mul);
					
					vec3 ambient = 0.1 * color + 0.3 * vec3(24.0, 24.0, 48.0) / 255.0;
					vec3 diffuse = vec3(0.0);
					vec3 specular = vec3(0.0);
					
					vec3 norm = normalize(v_normal);
					vec3 viewDir = normalize(camPos - v_position);
					
					for (int i = 0; i < 5; i++) {
						vec3 lightPos = lightSources[i];
						
						vec3 lightDir = normalize(lightPos - v_position);
						float diff = max(dot(norm, lightDir), 0.0);
						diffuse += lightColors[i] * diff * color;
						
						vec3 reflectDir = reflect(-lightDir, norm);
						float spec = pow(max(dot(viewDir, reflectDir), 0.0), 8.0);
						specular += lightColors[i] * spec;
					}
					diffuse = clamp(diffuse, 0.0, 1.0);
					specular = clamp(specular, 0.0, 1.0);
					
					vec3 result = ambient + diff_mul * diffuse + 0.3 * spec_mul * specular;
					
					vec3 shade0 = 0.8 * v_color;
					vec3 shade1 = v_color * vec3(dot(v_normal, normalize(lightSources[0] - v_position))) * 0.3;
					vec3 result2 = shade0 + shade1;
					
					gl_FragColor = vec4(result, alpha);
				}
			`;
		
		let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		
		let createProgram = (gl, vertexShader, fragmentShader) => {
			let program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			return program;
		};
		
		let program = createProgram(gl, vertexShader, fragmentShader);
		gl.useProgram(program);
		gl.program = program;
		
		this.gl = gl;
	}

	reset() {
		this.mode = ['casual'];
		
		this.friction = 0.95;
		this.lastTime = Date.now();
		
		this.touches = [];
		
		this.turn_ms = {
			touch: 60,
			scramble: 30,
		};
		
		this.display = {};
		this.resize();
		
		this.time_display = '';
		
		this.vertex_data_length;
		this.gl_u = {};
		this.gl_f = {};
		
		this.resetCube();
	}

	resetCube() {
		this.pieces.forEach(piece => piece.reset());
		
		this.pos = { x: 0, y: 0, z: 10.5 };
		this.fov = 50 * Math.PI / 180;
		
		this.rotationMat = [
			{ x: 1, y: 0, z: 0 },
			{ x: 0, y: 1, z: 0 },
			{ x: 0, y: 0, z: 1 }
		];
		this.rotateVel = { x: 0, y: 0, z: 0 };
		
		this.map = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[2, 2, 2, 2, 2, 2, 2, 2, 2],
			[3, 3, 3, 3, 3, 3, 3, 3, 3],
			[4, 4, 4, 4, 4, 4, 4, 4, 4],
			[5, 5, 5, 5, 5, 5, 5, 5, 5],
			[6, 6, 6, 6, 6, 6, 6, 6, 6]
		];
		
		this.turn_orientation = [
			{ x: 1, y: 0, z: 0 },
			{ x: 0, y: 1, z: 0 },
			{ x: 0, y: 0, z: 1 }
		];
		
		this.turns = [];
		this.turnsCubeMove = [];
		this.undoCap = 0;
		
		this.scrambling = false;
		this.scramble;
		this.scrambleIndex = 0;
		
		this.draw_setup();
	}

	resize() {
		this.display.width = this.canvas.width;
		this.display.height = this.canvas.height;
		if (this.gl) {
			this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
			this.gl.uniform2f(this.gl.getUniformLocation(this.gl.program, 'u_resolution'), this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
		}
	}

	loop() {
		let time = Date.now();
		let deltaTime = time - this.lastTime;
		
		let turning_pieces = false;
		let piecesNotDisplayed = false;
		if (this.mode[0] != 'animation') this.pieces.forEach(piece => {
			if (!piece.displayed) piecesNotDisplayed = true;
			if (!piece.turning) return;
			let turn_progress = (time - piece.turn.startTime) / piece.turn.ms;
			if (turn_progress < piece.turn.times) {
				piece.turnStep(turn_progress);
				turning_pieces = true;
			}
			else {
				piece.turnDone();
				piecesNotDisplayed = true;
			}
		});
		
		if (turning_pieces || piecesNotDisplayed || this.mode[0] == 'animation') this.set_iMat();
		
		if (this.scrambling && !turning_pieces) {
			if (this.scrambleIndex < this.scramble.length) {
				this.turnCubeNotation(this.scramble[this.scrambleIndex], this.turn_ms.scramble);
				this.scrambleIndex++;
			}
			else {
				this.scrambling = false;
				if (this.mode[0] == 'speed_solve' && this.mode[1] == 'ready') {
					this.undoCap = this.turns.length;
					this.turnsCubeMove.length = 0;
				}
			}
		}
		
		if (Math.abs(this.rotateVel.x) > 1e-3 || Math.abs(this.rotateVel.y) > 1e-3 || Math.abs(this.rotateVel.x) > 1e-3) {
			let f = this.friction ** (deltaTime / 10);
			this.rotateVel.x *= f;
			this.rotateVel.y *= f;
			this.rotateVel.z *= f;
			if (this.touches.length == 0) this.rotateCube(this.rotateVel.x * deltaTime / 10, this.rotateVel.y * deltaTime / 10, this.rotateVel.z * deltaTime / 10);
		}
		
		if (timer.running && !turning_pieces && this.isSolved()) this.justSolved();
		
		let new_time = timer.display();
		if (this.time_display != new_time) this.time_display = timer_display.textContent = new_time;
		
		if (this.show_map) this.drawMap(0, 0, 150);
		else ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		this.lastTime = time;
		
		if (this.mode[0] == 'animation') this.anim_loop();
	}

	rotateCube(ax, ay, az) {
		this.rotationMat.forEach(v => {
			let p = rotateZ(rotateY(rotateX(v, ax), ay), az);
			v.x = p.x;
			v.y = p.y;
			v.z = p.z;
		});
		this.set_mMat();
	}

	turnCube(pieces, axis, times, ms) {
		if (ms > 0) {
			if (pieces.some(p => p.turning && (p.turn.progress / p.turn.times < 0.5))) return false;
			this.pieces.forEach(p => (p.turning && (Math.abs(Vdot(p.turn.axis, axis)) < 0.9)) && p.turnDone());
			if (pieces.some(p => p.turning)) return false;
		}
		else this.pieces.forEach(p => p.turning && p.turnDone());
		
		let startTime = Date.now();
		pieces.forEach(piece => {
			piece.turning = true;
			piece.turn.startTime = startTime;
			piece.turn.axis = axis;
			piece.turn.times = times;
			piece.turn.progress = 0;
			piece.turn.ms = ms;
			piece.displayed = false;
		});
		
		this.turns.push({ pieces, axis, times });
		
		let map_turns = [];
		let center_pieces = Object.values(this.center_pieces);
		let axis_piece = center_pieces.find(piece => Vdot(Vnormalize(piece.transform(piece)), axis) == 1);
		let axis_piece_name = axis_piece.id[0];
		
		let centers = ['R', 'U', 'F', 'L', 'D', 'B'];
		let anti_axis_piece = this.center_pieces[centers[(centers.indexOf(axis_piece_name) + 3) % 6]];
		
		let move = '';
		let orientation = this.get_face_rot();
		let oriented_pieces = this.get_face().centers;
		let axis_move = centers[oriented_pieces.indexOf(axis_piece)];
		let anti_axis_move = centers[oriented_pieces.indexOf(anti_axis_piece)];
		
		if (center_pieces.every(e => pieces.includes(e))) {}
		else if (center_pieces.every(e => pieces.includes(e) ^ e === axis_piece)) map_turns.push({ face: axis_piece.id[0], clockwise: true });
		else if (center_pieces.every(e => pieces.includes(e) ^ e === anti_axis_piece)) map_turns.push({ face: anti_axis_piece.id[0], clockwise: false });
		else if (center_pieces.every(e => !pieces.includes(e) ^ e === axis_piece)) map_turns.push({ face: axis_piece.id[0], clockwise: false });
		else if (center_pieces.every(e => !pieces.includes(e) ^ e === anti_axis_piece)) map_turns.push({ face: anti_axis_piece.id[0], clockwise: true });
		else if (center_pieces.every(e => pieces.includes(e) ^ (e === axis_piece || e === anti_axis_piece))) map_turns.push({ face: axis_piece.id[0], clockwise: true }, { face: anti_axis_piece.id[0], clockwise: false });
		map_turns.forEach((turn) => this.turnMap(turn.face + (times == 1 ? '' : times) + (turn.clockwise ? '' : "'")));
		
		if (oriented_pieces.every(e => pieces.includes(e))) {}
		else if (pieces.includes(axis_piece)) move = axis_move + ((times == 2) ? '2' : '') + "'";
		else if (pieces.includes(anti_axis_piece)) move = anti_axis_move + ((times == 2) ? '2' : '');
		else if ((!pieces.includes(axis_piece)) && (!pieces.includes(anti_axis_piece))) move = { R: "M'", U: "E'", F: "S", L: "M", D: "E", B: "S'" }[anti_axis_move];
		
		let MA = (this.turnsCubeMove.length > 0) ? this.turnsCubeMove[this.turnsCubeMove.length - 1].orientation : [{ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }];
		let MB = orientation;
		
		/*
		Rubik.turnAlgInstant(Rubik.solves[0].scramble);
Rubik.turnAlgInstant(Rubik.solves[0].solution);
		*/
		
		let cube_rotations = [];
		if (Vlength(Vsub(MB[0], MA[1])) < 0.01 || Vlength(Vadd(MB[0], MA[1])) < 0.01) {
			let hp = Math.PI / 2;
			let ty = [0, -1, 1, 2].find(a => Vlength(Vsub(MB[2], rotateAxis(MA[2], hp * a, MA[1]))) < 0.01);
			if (ty) cube_rotations.push('y' + ["'", '', '', '2'][ty + 1]);
			let tz = [0, -1, 1, 2].find(a => Vlength(Vsub(MB[1], rotateAxis(MA[1], hp * a, rotateAxis(MA[2], hp * ty, MA[1])))) < 0.01);
			if (tz) cube_rotations.push('z' + ["'", '', '', '2'][tz + 1]);
		}
		else {
			let hp = Math.PI / 2;
			let ty = [0, -1, 1, 2].find(a => Vlength(Vsub(MB[0], rotateAxis(MA[0], hp * a, MA[1]))) < 0.01);
			if (ty) cube_rotations.push('y' + ["'", '', '', '2'][ty + 1]);
			let tx = [0, -1, 1, 2].find(a => Vlength(Vsub(MB[1], rotateAxis(MA[1], hp * a, rotateAxis(MA[0], hp * ty, MA[1])))) < 0.01);
			if (tx) cube_rotations.push('x' + ["'", '', '', '2'][tx + 1]);
		}
		this.turnsCubeMove.push({
			orientation: orientation,
			cube_rotations: cube_rotations,
			move: move,
			time: timer.update(),
			date: Date.now(),
			ms: ms
		});
		
		if (ms > 0) sound.play();
		else pieces.forEach(piece => piece.turnDone());

		return true;
	}

	turnCubeNotation(move, ms) {
		let face = move[0];
		let times = Number(move[1]) || 1;
		let clockwise = move[move.length - 1] !== "'";
		let piece = this.center_pieces[face];
		let pieceT = piece.transform(piece);
		let axis = Vnormalize(clockwise ? Vneg(pieceT) : pieceT);
		let pieces = this.pieces.filter(p => Math.abs(Vdot(axis, Vsub(p.transform(p), pieceT))) < 0.1);
		return this.turnCube(pieces, axis, times, ms);
	}

	turnCubeMove(move, ms = this.turn_ms.touch, inverse) {
		let move_i = [];
		move.split('').forEach((c, i, a) => (/[a-zA-Z]/g).test(c) && move_i.push(i));
		let moves = move_i.map((m, i, a) => move.substring(m, a[i+1]));
		if (this.pieces.some(p => p.turning)) return moves.map(() => false);
		return moves.map(move => {
			let face = move[0];
			let move_axes = {
				R: 1, U: 2, F: 3, L: -1, D: -2, B: -3,
				x: 1, y: 2, z: 3,
				r: 1, u: 2, f: 3, l: -1, d: -2, b: -3,
				M: -1, E: -2, S: 3
			};
			let times = Number(move[1]) || 1;
			let clockwise = (move[move.length - 1] !== "'") ^ inverse;
			let piece = Object.values(this.center_pieces).find(p => Vdot(p.transform(p), this.turn_orientation[Math.abs(move_axes[face]) - 1]) == Math.sign(move_axes[face]));
			let pieceT = piece.transform(piece);
			let axis = Vnormalize(clockwise ? Vneg(pieceT) : pieceT);
			let pieces;
			if (['R', 'U', 'F', 'L', 'D', 'B'].includes(move[0])) pieces = this.pieces.filter(p => Math.abs(Vdot(axis, Vsub(p.transform(p), pieceT))) < 0.1);
			else if (['x', 'y', 'z'].includes(move[0])) pieces = this.pieces;
			else if (['r', 'u', 'f', 'l', 'd', 'b'].includes(move[0])) pieces = this.pieces.filter(p => !(Math.abs(Vdot(axis, Vsub(p.transform(p), Vneg(pieceT)))) < 0.1));
			else if (['M', 'E', 'S'].includes(move[0])) pieces = this.pieces.filter(p => Math.abs(Vdot(axis, p.transform(p))) < 0.1);
			return this.turnCube(pieces, axis, times, ms);
		});
	}

	turnUndo() {
		if (this.turns.length <= this.undoCap) return;
		let turn = this.turns[this.turns.length - 1];
		if (this.turnCube(turn.pieces, Vneg(turn.axis), turn.times, this.turn_ms.touch)) {
			this.turns.pop();
			this.turns.pop();
		}
	}

	turnMap(side) {
		let swap = (si1, sq1, si2, sq2) => [this.map[si1][sq1], this.map[si2][sq2]] = [this.map[si2][sq2], this.map[si1][sq1]];
		this.cyclesMap[side[0]].forEach(e => {
			let swaps = [
				[e[0][0], e[0][1], e[1][0], e[1][1]],
				[e[0][0], e[0][1], e[2][0], e[2][1]],
				[e[0][0], e[0][1], e[3][0], e[3][1]]
			];
			if (side[side.length - 1] === "'") swaps.reverse();
			for (let i = 0; i < (Number(side[1]) || 1); i++) swaps.forEach(s => swap(...s));
		});
	}

	turnAlgInstant(alg, set_face = false, inverse = false) {
		if (set_face) this.set_face();
		else this.reset_face();
		(inverse ? alg.split(' ').reverse() : alg.split(' ')).forEach(move => this.turnCubeMove(move, 0, inverse));
	}

	renderP(point) {
		return this.projectP(this.transformP(point));
	}

	transformP(point) {
		return Vsub(Vmatrix(this.rotationMat, point), this.pos);
	}

	projectP(point) {
		let p = [point.x, point.y, point.z, 1];
		let pMat = this.pMat;

		let mul_mat_vec = (mat, vec) => {
			return [
				vec[0] * mat[0] + vec[1] * mat[4] + vec[2] * mat[8] + vec[3] * mat[12],
				vec[0] * mat[1] + vec[1] * mat[5] + vec[2] * mat[9] + vec[3] * mat[13],
				vec[0] * mat[2] + vec[1] * mat[6] + vec[2] * mat[10] + vec[3] * mat[14],
				vec[0] * mat[3] + vec[1] * mat[7] + vec[2] * mat[11] + vec[3] * mat[15]
			];
		}
		let result = mul_mat_vec(pMat, p);
		return {
			x: this.display.width * (result[0] / result[3] + 1) / 2,
			y: this.display.height * (-result[1] / result[3] + 1) / 2
		};
	}

	set_iMat() {
		let iMat = [];
		this.pieces.forEach((piece, i) => {
			piece.displayed = true;
			let mat = [
				piece.rotationMat[0].x, piece.rotationMat[0].y, piece.rotationMat[0].z, 0,
				piece.rotationMat[1].x, piece.rotationMat[1].y, piece.rotationMat[1].z, 0,
				piece.rotationMat[2].x, piece.rotationMat[2].y, piece.rotationMat[2].z, 0,
				0, 0, 0, 1
			];
			iMat.push(...mat);
		});
		this.gl_f.iMat = new Float32Array(iMat);
		this.gl.uniformMatrix4fv(this.gl_u['u_iMat'], false, new Float32Array(iMat));
	}

	set_pMat() {
		let fov = this.fov;
		let aspect = this.display.width / this.display.height;
		let near = 1;
		let far = 50;
		let f = 1.0 / Math.tan(fov / 2);
		let nf = 1 / (near - far);
		this.pMat = [
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (far + near) * nf, -1,
			0, 0, (2 * far * near) * nf, 0
		];
		this.gl_f.pMat = new Float32Array(this.pMat);
		this.gl.uniformMatrix4fv(this.gl_u['u_pMat'], false, this.gl_f.pMat);
	}

	set_vMat() {
		this.gl_f.vMat = new Float32Array([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			-this.pos.x, -this.pos.y, -this.pos.z, 1
		]);
		this.gl.uniformMatrix4fv(this.gl_u['u_vMat'], false, this.gl_f.vMat);
	}

	set_mMat() {
		this.gl_f.mMat = new Float32Array([
			this.rotationMat[0].x, this.rotationMat[0].y, this.rotationMat[0].z, 0,
			this.rotationMat[1].x, this.rotationMat[1].y, this.rotationMat[1].z, 0,
			this.rotationMat[2].x, this.rotationMat[2].y, this.rotationMat[2].z, 0,
			0, 0, 0, 1
		]);
		this.gl.uniformMatrix4fv(this.gl_u['u_mMat'], false, this.gl_f.mMat);
	}

	draw_setup() {
		let gl = this.gl;
		if (!gl) return;
		let program = gl.program;
		
		['u_iMat', 'u_pMat', 'u_vMat', 'u_mMat', 'camPos', 'lightSources', 'lightColors'].forEach(loc => {
			this.gl_u[loc] = gl.getUniformLocation(program, loc);
		});
		
		this.set_iMat();
		this.set_pMat();
		this.set_vMat();
		this.set_mMat();
		
		let vertex_data = [];
		this.pieces.forEach((piece, pi) => {
			let obj = objs[piece.type];
			if (!obj) return;
			let mat = piece.orient_mat;
			let colors = objs.colors.map(c => [c[0] / 255, c[1] / 255, c[2] / 255]);
			let vertices = obj.vertices.map(vec => {
				let s = 1.01;
				return [
					(vec[0] * mat[0] + vec[1] * mat[3] + vec[2] * mat[6]) / 2 + piece.x * s,
					(vec[0] * mat[1] + vec[1] * mat[4] + vec[2] * mat[7]) / 2 + piece.y * s,
					(vec[0] * mat[2] + vec[1] * mat[5] + vec[2] * mat[8]) / 2 + piece.z * s
				];
			});
			let vertex_normals = [];
			let vertex_normals0 = [];
			let groups_normals = {};
			let normals = [];
			let normals0 = [];
			for (let i = 0; i < obj.vertices.length; i++) {
				normals.push([]);
				normals0.push([]);
			}
			
			for (let group in obj.groups) {
				groups_normals[group] = obj.groups[group].map(face => {
					let v0 = vertices[face[0]];
					let v1 = vertices[face[1]];
					let v2 = vertices[face[2]];
					if (!(v0 && v1 && v2)) {
						console.error('triangle with two sides');
						return;
					}
					let cross = [
						(v0[1] - v2[1]) * (v1[2] - v2[2]) - (v0[2] - v2[2]) * (v1[1] - v2[1]),
						(v0[2] - v2[2]) * (v1[0] - v2[0]) - (v0[0] - v2[0]) * (v1[2] - v2[2]),
						(v0[0] - v2[0]) * (v1[1] - v2[1]) - (v0[1] - v2[1]) * (v1[0] - v2[0])
					];
					let len = Math.hypot(...cross);
					let n = [cross[0] / len, cross[1] / len, cross[2] / len];
					face.forEach(vi => {
						if (normals[vi].every(ns => (ns[0] * n[0] + ns[1] * n[1] + ns[2] * n[2]) < 0.7)) {
							normals[vi].push(n);
						}
						if (group == '0' && normals0[vi].every(ns => (ns[0] * n[0] + ns[1] * n[1] + ns[2] * n[2]) < 0.7)) {
							normals0[vi].push(n);
						}
					});
					return n;
				});
			}
			
			normals.forEach((nss, i) => {
				let n = [0, 0, 0];
				nss.forEach(ns => {
					n[0] += ns[0];
					n[1] += ns[1];
					n[2] += ns[2];
				});
				/*n[0] /= nss.length;
				n[1] /= nss.length;
				n[2] /= nss.length;*/
				let len = Math.hypot(...n);
				n[0] /= len;
				n[1] /= len;
				n[2] /= len;
				vertex_normals[i] = n;
			});
			normals0.forEach((nss, i) => {
				let n = [0, 0, 0];
				nss.forEach(ns => {
					n[0] += ns[0];
					n[1] += ns[1];
					n[2] += ns[2];
				});
				/*n[0] /= nss.length;
				n[1] /= nss.length;
				n[2] /= nss.length;*/
				let len = Math.hypot(...n);
				n[0] /= len;
				n[1] /= len;
				n[2] /= len;
				vertex_normals0[i] = n;
			});
			
			for (let group in obj.groups) {
				obj.groups[group].forEach((face, i) => {
					let v0 = vertices[face[0]];
					let v1 = vertices[face[1]];
					let v2 = vertices[face[2]];
					if (!(v0 && v1 && v2)) return;
					let n = groups_normals[group][i];
					let n0;
					let n1;
					let n2;
					if (group == '0') {
						n0 = vertex_normals0[face[0]];
						n1 = vertex_normals0[face[1]];
						n2 = vertex_normals0[face[2]];
					}
					else {
						n0 = vertex_normals[face[0]];
						n1 = vertex_normals[face[1]];
						n2 = vertex_normals[face[2]];
					}
					
					let c = colors[piece.color[Number(group)]];
					let t = piece.color[Number(group)];
					vertex_data.push(
						...v0, ...n0, ...c, pi, t,
						...v1, ...n1, ...c, pi, t,
						...v2, ...n2, ...c, pi, t
					);
				});
			}
		});
		
		let size = 0.7;
		let xz = 0.5 * size;
		let y = 1.1000 / 2 + 1.011;
		vertex_data.push(
			-xz, y, -xz, 0, 1, 0, 0, 0, 0, 24, -1,
			-xz, y, +xz, 0, 1, 0, 0, 1, 0, 24, -1,
			+xz, y, +xz, 0, 1, 0, 1, 1, 0, 24, -1,
			-xz, y, -xz, 0, 1, 0, 0, 0, 0, 24, -1,
			+xz, y, +xz, 0, 1, 0, 1, 1, 0, 24, -1,
			+xz, y, -xz, 0, 1, 0, 1, 0, 0, 24, -1
		);
		
		this.vertex_data_length = vertex_data.length;
		
		let positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_data), gl.STATIC_DRAW);
		
		let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 11 * Float32Array.BYTES_PER_ELEMENT, 0);
		
		let normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
		gl.enableVertexAttribArray(normalAttributeLocation);
		gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 11 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
		
		let colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
		gl.enableVertexAttribArray(colorAttributeLocation);
		gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 11 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
		
		let idAttributeLocation = gl.getAttribLocation(program, 'a_id');
		gl.enableVertexAttribArray(idAttributeLocation);
		gl.vertexAttribPointer(idAttributeLocation, 1, gl.FLOAT, false, 11 * Float32Array.BYTES_PER_ELEMENT, 9 * Float32Array.BYTES_PER_ELEMENT);
		
		let typeAttributeLocation = gl.getAttribLocation(program, 'a_type');
		gl.enableVertexAttribArray(typeAttributeLocation);
		gl.vertexAttribPointer(typeAttributeLocation, 1, gl.FLOAT, false, 11 * Float32Array.BYTES_PER_ELEMENT, 10 * Float32Array.BYTES_PER_ELEMENT);
		
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		this.logo = new Image();
		this.logo.src = "logo.svg";
		this.logo.onload = () => {
			let texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.logo);
		};
		
		let lightSources = [
			0, 10, 0,
			5, 0, 10,
			-20, 0, 10,
			0, -20, -10,
			+20, 0, 10
		];
		let lightColors = [
			0.7, 0.7, 0.7,
			0.5, 0.5, 0.5,
			0.4, 0.4, 0.4,
			0.4, 0.4, 0.4,
			0.4, 0.4, 0.4,
		];
		gl.uniform3fv(this.gl_u['lightSources'], new Float32Array(lightSources));
		gl.uniform3fv(this.gl_u['lightColors'], new Float32Array(lightColors));
		
		gl.uniform3f(this.gl_u['camPos'], this.pos.x, this.pos.y, this.pos.z);
	}

	draw_loop() {
		let gl = this.gl;
		if (!gl) return;
		let program = gl.program;
		
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLES, 0, this.vertex_data_length / 11);
	}

	drawMap(x, y, w) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		let h = w * 3 / 4;
		let siW = w / 4;
		let sqW = siW / 3;
		let faceCoords = [
			[1 * siW, 0 * siW],
			[0 * siW, 1 * siW],
			[1 * siW, 1 * siW],
			[2 * siW, 1 * siW],
			[3 * siW, 1 * siW],
			[1 * siW, 2 * siW]
		];
		this.map.forEach((si, i) => {
			let siX = faceCoords[i][0];
			let siY = faceCoords[i][1];
			si.forEach((sq, j) => {
				let sqX = (j % 3) * sqW;
				let sqY = Math.floor(j / 3) * sqW;
				let padding = 0.07;
				ctx.fillStyle = 'rgb(' + objs.colors[sq].join(',') + ')';
				ctx.fillRect(x + siX + sqX + padding * sqW, y + siY + sqY + padding * sqW, sqW - 2 * padding * sqW, sqW - 2 * padding * sqW);
			});
		});
	}

	touchStart(x, y, id) {
		let touch = { id };
		this.touches.push(touch);
		let touchingCube = false,
			cube, face, faceI, pieceI, gotLine = false;
		this.rotateVel.x = this.rotateVel.y = 0;
		this.pieces.some((piece, I) => {
			return piece.box.some((e, i) => {
				let poly = e.map(point => this.transformP(piece.transform(point)));
				let isPolyVis = Vdot(getNormal(poly), poly[1]) < 0;
				if (!isPolyVis) return false;
				let Ply = { points: e.map(p => this.renderP(piece.transform(p))) };
				if (piece.boxFaces[i] && cllnPolyPnt(Ply, { x, y })) {
					touchingCube = true;
					cube = piece.box;
					face = cube[i];
					faceI = i;
					pieceI = I;
				}
				return touchingCube;
			});
		});
		Object.assign(touch, { x, y, touchingCube, cube, face, faceI, pieceI, gotLine });
	}

	touchMove(x, y, id) {
		let touch = this.touches.find(e => e.id === id);
		if (!touch) return;
		if (touch.touchingCube && !touch.gotLine) {
			let { cube, face, pieceI } = touch;
			let piece = this.pieces[pieceI];
			let Ply = { points: face.map(p => this.renderP(piece.transform(p))) };
			let lines = Ply.points.map((e, i, a) => ({ p1: e, p2: a[(i + 1) % a.length] }));
			lines.forEach((e, i) => {
				let a = Math.atan2(y - touch.y, x - touch.x);
				let d = Math.hypot(touch.y - y, touch.x - x) * 10;
				let p = {
					x: touch.x + Math.cos(a) * d,
					y: touch.y + Math.sin(a) * d
				};
				if (cllnLineLine(e, { p1: touch, p2: p })) {
					if (!this.scrambling && this.mode[0] != 'animation') {
						let axis = Vsub(piece.transformDone(face[i]), piece.transformDone(face[(i + 1) % face.length]));
						for (let a in axis) axis[a] = Math.round(axis[a]);
						let pieces;
						if (axis.x !== 0) pieces = this.pieces.filter(p => Math.abs(p.transformDone(p).x - piece.transformDone(piece).x) < 0.1);
						if (axis.y !== 0) pieces = this.pieces.filter(p => Math.abs(p.transformDone(p).y - piece.transformDone(piece).y) < 0.1);
						if (axis.z !== 0) pieces = this.pieces.filter(p => Math.abs(p.transformDone(p).z - piece.transformDone(piece).z) < 0.1);
						this.turnCube(pieces, axis, 1, this.turn_ms.touch);
						if (this.mode[0] == 'replay') this.mode = ['casual'];
						if (this.mode[0] == 'speed_solve' && this.mode[1] == 'ready' && !timer.running) {
							this.mode[1] = 'go';
							timer.start();
						}
					}
					touch.gotLine = true;
				}
			});
		}
		if (!touch.touchingCube) {
			touch.ax = touch.x;
			touch.ay = touch.y;
			this.rotateVel.x = (touch.y - y) * (2 * Math.PI) / Math.sqrt(this.display.width * this.display.height);
			this.rotateVel.y = (touch.x - x) * (2 * Math.PI) / Math.sqrt(this.display.width * this.display.height);
			this.rotateCube(this.rotateVel.x, this.rotateVel.y, 0);
		}
		Object.assign(touch, { x, y });
		let touchesR = this.touches.filter(e => !e.touchingCube);
		if (touchesR.length >= 2) {
			let x = 0;
			let y = 0;
			let dist = 0;
			let angle = 0;
			touchesR.forEach(touch => {
				x += touch.x / touchesR.length;
				y += touch.y / touchesR.length;
			});
			touchesR.forEach(touch => {
				if (touch.ax !== undefined && touch.ay !== undefined) {
					let ax = touch.x - x;
					let ay = touch.y - y;
					let bx = touch.ax - x;
					let by = touch.ay - y;
					let ad = Math.hypot(ax, ay);
					let bd = Math.hypot(bx, by);
					dist += ad - bd;
					let d_angle = Math.acos(Math.min(Math.max((ax * bx + ay * by) / (ad * bd), -1), 1)) * Math.sign(ax * by - ay * bx);
					if (!isNaN(d_angle)) angle += d_angle;
					else console.log('d_angle is NaaaN');
					touch.ax = undefined;
					touch.ay = undefined;
				}
			});

			this.rotateCube(0, 0, this.rotateVel.z = -angle);
			/*this.pos.z = Math.min(Math.max(this.pos.z + -dist * 0.01, 7), 1300);
			this.set_vMat();
			this.gl.uniform3f(this.gl_u['camPos'], this.pos.x, this.pos.y, this.pos.z);*/
		}
	}

	touchEnd(id) {
		this.touches.splice(this.touches.findIndex(e => e.id === id), 1);
	}

	touchCancel() {
		this.touches.length = 0;
	}

	generateScramble(length = 21) {
		let getRandomI = arr => Math.floor(Math.random() * arr.length);
		let p_axis = [["R", "L"], ["U", "D"], ["F", "B"]];
		let p_symbol = ["", "'", "2"];
		let scr = [];
		for (let i = 0; i < length; i++) {
			let avail_axis = [0, 1, 2];
			let avail_dir = [0, 1];
			if (scr.length > 1 && scr[scr.length - 1].axis == scr[scr.length - 2].axis) {
				avail_axis.splice(scr[scr.length - 1].axis, 1);
			}
			let axis = avail_axis[getRandomI(avail_axis)];
			if (scr.length > 0 && scr[scr.length - 1].axis == axis) {
				avail_dir.splice(scr[scr.length - 1].dir, 1);
			}
			let dir = avail_dir[getRandomI(avail_dir)];
			let symbol = getRandomI(p_symbol);
			scr.push({ axis, dir, symbol });
		}
		return scr.map(e => p_axis[e.axis][e.dir] + p_symbol[e.symbol]);
	}

	scrambleCube() {
		if (this.scrambling || this.mode[0] == 'animation') return;
		if (timer.enabled) {
			timer.reset();
			this.mode = ['speed_solve', 'ready'];
			this.resetCube();
			this.rotateCube(
				Math.random() * 2 * Math.PI,
				Math.random() * 2 * Math.PI,
				Math.random() * 2 * Math.PI
			);
			timer_display.style.color = '#ffffff';
		}
		else {
			this.mode = ['casual'];
		}
		this.scrambling = true;
		this.scramble = this.generateScramble();
		this.scrambleIndex = 0;
	}

	isSolved() {
		for (let i = 0; i < this.map.length; i++) {
			let face = this.map[i];
			let color = face[0];
			for (let j = 0; j < face.length; j++) {
				if (face[j] != color) return false;
			}
		}
		return true;
	}

	justSolved() {
		timer.stop();
		this.mode = ['casual'];
		this.undoCap = this.turns.length;
		
		let solution = [];
		let solution_times = [];
		
		this.turnsCubeMove.forEach(turn => {
			solution.push(...turn.cube_rotations, turn.move);
			solution_times.push(turn.time);
		});
		
		let solve = {
			date: this.turnsCubeMove[0].date,
			time: timer.time(),
			scramble: this.scramble.join(' '),
			solution: solution.join(' '),
			ms: this.turnsCubeMove[0].ms,
			solution_times: solution_times
		};
		this.solves_string.push(this.solve_toString(solve));
		
		let solves = JSON.stringify(this.solves_string);
		localStorage.setItem('solves', solves);
		localStorage.setItem('solves_data', `${solves.length * 2} bytes, ${this.solves_string.length} solves`);
		
		let i = this.solves_string.length - 1;
		let solve_string = this.solves_string[i];
		let time = Number(solve_string.split(' ')[1]);
		let li = document.createElement('li');
		li.textContent = (time / 1000).toFixed(3);
		li.onclick = () => this.solve_click(solve_string, i);
		li.id = 'solve_' + i;
		times_list.insertBefore(li, times_list.firstChild);
		
		this.updateTable(false);
	}

	get_face() {
		let centers = ['R', 'U', 'F', 'L', 'D', 'B'];
		let center_pos = centers.map(e => Vnormalize(Vmatrix(this.rotationMat, this.center_pieces[e].transform(this.center_pieces[e]))));
		let used = [];
		
		let pickIndex = dir => {
			let maxDot = -Infinity, idx = -1;
			for (let i = 0; i < center_pos.length; i++) {
				if (used.includes(i)) continue;
				let dot = Vdot(center_pos[i], dir);
				if (dot > maxDot) {
					maxDot = dot;
					idx = i;
				}
			}
			used.push(idx);
			used.push((idx + 3) % 6);
			return idx;
		};
		
		let iR = pickIndex({ x: 1, y: 0, z: 0 });
		let iU = pickIndex({ x: 0, y: 1, z: 0 });
		let iF = pickIndex({ x: 0, y: 0, z: 1 });
		
		return {
			orientation: [
				Vnormalize(this.center_pieces[centers[iR]]),
				Vnormalize(this.center_pieces[centers[iU]]),
				Vnormalize(this.center_pieces[centers[iF]])
			],
			centers: [
				this.center_pieces[centers[iR]],
				this.center_pieces[centers[iU]],
				this.center_pieces[centers[iF]],
				this.center_pieces[centers[(iR + 3) % 6]],
				this.center_pieces[centers[(iU + 3) % 6]],
				this.center_pieces[centers[(iF + 3) % 6]]
			]
		};
	}

	get_face_rot() {
		let transpose = M => [
			{ x: M[0].x, y: M[1].x, z: M[2].x },
			{ x: M[0].y, y: M[1].y, z: M[2].y },
			{ x: M[0].z, y: M[1].z, z: M[2].z }
		];
		
		let snap = M => {
			let axes = ['x', 'y', 'z'];
			let used = [];
			return M.map(row => {
				let maxAxis = null;
				let maxVal = -Infinity;
				for (let axis of axes) {
					if (used.includes(axis)) continue;
					let val = Math.abs(row[axis]);
					if (val > maxVal) {
						maxAxis = axis;
						maxVal = val;
					}
				}
				used.push(maxAxis);
				return { x: 0, y: 0, z: 0, [maxAxis]: Math.sign(row[maxAxis]) };
			});
		};
		
		return snap(transpose(this.rotationMat));
	}

	set_face() {
		this.turn_orientation = this.get_face().orientation;
	}

	reset_face() {
		this.turn_orientation = [
			{ x: 1, y: 0, z: 0 },
			{ x: 0, y: 1, z: 0 },
			{ x: 0, y: 0, z: 1 }
		];
	}

	go_face() {
		this.rotationMat[0] = Vscale(this.turn_orientation[0], 1);
		this.rotationMat[1] = Vscale(this.turn_orientation[1], 1);
		this.rotationMat[2] = Vscale(this.turn_orientation[2], 1);
	}

	exec(n = 100) {
		for (let i = 0; i < n; i++) {
			let moves = [
				'R', 'U', 'F', 'L', 'D', 'B',
				'x', 'y', 'z',
				'r', 'u', 'f', 'l', 'd', 'b',
				'M', 'E', 'S'
			];
			let turns = ['', "2"]
			let dir = ['', "'"]
			let pick = arr => arr[Math.floor(Math.random() * arr.length)];
			let move = pick(moves) + pick(turns) + pick(dir);
			this.turnCubeMove(move, 0);
		}
	}

	replay(solve) {
		this.mode = ['replay'];
		let { scramble, time, solution, solution_times, ms } = solve;
		let solution1 = solution.split(' ');
		let solution_times1 = solution_times.map(n => Number(n));
		
		this.resetCube();
		for (let i = 0; i < solution1.length; i++) {
			let move = solution1[0];
			if (['x', 'y', 'z'].includes(move[0])) {
				scramble += ' ' + move;
				solution1.shift();
			}
			else {
				break;
			}
		}
		this.turnAlgInstant(scramble);
		this.rotateCube(0, 0.35, 0);
		this.rotateCube(-0.35, 0, 0);
		
		let turn, rotation = [], time0 = 0, time1 = 0;
		let time_i = 0;
		let moves = [];
		for (let i = 0; i < solution1.length; i++) {
			let move = solution1[i];
			if (['x', 'y', 'z'].includes(move[0])) {
				rotation.push(move);
			}
			else {
				let r_ms = ms;
				let dt = time1 - time0;
				if (dt - ms < r_ms * rotation.length) {
					r_ms = (dt - ms) / rotation.length;
				}
				rotation.forEach((move, i) => {
					moves.push({
						move: move,
						time: time1 - r_ms * (rotation.length - i),
						ms: r_ms
					});
				});
				rotation = [];
				time0 = solution_times1[time_i];
				time1 = solution_times1[time_i + 1];
				time_i ++;
				moves.push({
					move: move,
					time: time0,
					ms: ms
				});
			}
		}
		
		let time_a;
		let i = 0;
		let count = 0;
		let loop = () => {
			if (this.mode[0] !== 'replay') return;
			count++;
			let { move, time, ms } = moves[i];
			let success = false;
			let time_b = Date.now() - time_a;
			let time_d = time - time_b;
			if (time_b > time) {
				success = this.turnCubeMove(move, ms)[0];
			}
			if (success) i++;
			let delay = Math.max(0, success ? 0 : Math.floor(time_d * 0.9));
			if (i < moves.length) setTimeout(loop, delay);
			else this.mode = ['casual'];
		}
		setTimeout(() => {
			time_a = Date.now();
			loop();
		}, 2000);
	}

	solve_toString(object) {
		let codeToMove = ["R", "U", "F", "L", "D", "B", "x", "y", "z", "M", "E", "S", "R'", "U'", "F'", "L'", "D'", "B'", "x'", "y'", "z'", "M'", "E'", "S'", "R2", "U2", "F2", "L2", "D2", "B2", "x2", "y2", "z2", "M2", "E2", "S2"];
		let moves_compress = moves => {
			return moves.map(move => {
				let i = codeToMove.indexOf(move);
				return i.toString(36);
			});
		};
		let number_compress = numbers => {
			return numbers.map(number => {
				return (number < 1296) ? number.toString(36).padStart(2, '0') : '_' + number.toString(36).padStart(3, '0');
			});
		};
		let solution_times = object.solution_times;
		let dt = [];
		let n = solution_times.length;
		for (let i = 0; i < n - 1; i++) {
			dt.push(solution_times[i + 1] - solution_times[i]);
		}
		return [
			object.date,
			object.time,
			moves_compress(object.scramble.split(' ')).join(''),
			moves_compress(object.solution.split(' ')).join(''),
			object.ms,
			number_compress(dt).join('')
		].join(' ');
	}

	solve_toObject(string) {
		let [ date, time, scrambleC, solutionC, ms, dt] = string.split(' ');
		let codeToMove = ["R", "U", "F", "L", "D", "B", "x", "y", "z", "M", "E", "S", "R'", "U'", "F'", "L'", "D'", "B'", "x'", "y'", "z'", "M'", "E'", "S'", "R2", "U2", "F2", "L2", "D2", "B2", "x2", "y2", "z2", "M2", "E2", "S2"];
		
		let moves_decompress = moves => {
			let out = new Array(moves.length);
			for (let j = 0; j < moves.length; j++) {
				let move = moves[j];
				let char = move.charCodeAt(0);
				let i = char - (char >= 97 ? 87 : 48);
				out[j] = codeToMove[i];
			}
			return out.join(' ');
		};
		let solution_times = new Array(Math.floor(dt.length / 2) + 1).fill('');
		solution_times = [0];
		for (let i = 0, j = 0; i < dt.length; i += 2) {
			let _ = +(dt[i] == '_');
			let time = parseInt(dt.slice(i + _, i + 2 + 2 * _), 36)
			solution_times[j + 1] = solution_times[j] + time;
			j++;
			i += 2 * _;
		}
		
		return {
			date: Number(date),
			time: Number(time),
			scramble: moves_decompress(scrambleC),
			solution: moves_decompress(solutionC),
			ms: Number(ms),
			solution_times: solution_times
		};
	}

	solve_click(solve_string, i) {
		let solve = this.solve_toObject(solve_string);
		let element = document.getElementById('solve_' + i);
		
		if (show_solveInfo && element_solveInfo === element) toggleInfo();
		else if (!show_solveInfo) toggleInfo();
		
		solveInfo_time.innerHTML = (solve.time / 1000).toFixed(3);
		solveInfo_time.onclick = () => this.replay(solve);
		
		let now = new Date(solve.date);
		let formattedDate = now.toLocaleDateString('en-US', { dateStyle: 'medium' });
		let formattedTime = now.toLocaleTimeString('en-US', { timeStyle: 'short' });
		
		solveInfo_date.innerHTML = formattedDate + '<br>' + formattedTime;
		
		solveInfo_scramble.innerHTML = solve.scramble;
		
		if (element_solveInfo) element_solveInfo.classList.remove('highlight');
		if (show_solveInfo) element.classList.add('highlight');
		element_solveInfo = element;
		/*element.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});*/
		//this.replay(solve);
	}

	updateTable(init) {
		let len = this.solves_string.length;
		let times = new Array(len);
		for (let i = len - 1; i >= 0; i--) {
			times[i] = Number(this.solves_string[i].split(' ')[1]);
		}
		
		let worker = new Worker(`data:text/javascript,
			function getTrimmedAvg(times, start, size) {
				let trim = 0;
				if (size >= 5) trim = 1;
				if (size >= 10) trim = Math.round(0.05 * size);
				
				let sum = 0;
				let minVals = new Array(trim).fill(Infinity);
				let maxVals = new Array(trim).fill(-Infinity);
				for (let j = 0; j < size; j++) {
					let val = times[start + j];
					sum += val;
					if (val < minVals[trim - 1]) {
						let k;
						for (k = trim - 1; k > 0 && val < minVals[k - 1]; k--) {
							minVals[k] = minVals[k - 1];
						}
						minVals[k] = val;
					}
					if (val > maxVals[trim - 1]) {
						let k;
						for (k = trim - 1; k > 0 && val > maxVals[k - 1]; k--) {
							maxVals[k] = maxVals[k - 1];
						}
						maxVals[k] = val;
					}
				}
				for (let i = 0; i < trim; i++) {
					sum -= minVals[i];
					sum -= maxVals[i];
				}
				return sum / (size - 2 * trim);
			}
			onmessage = function(e) {
				let { init, len, stat, times } = e.data;
				
				if (len >= 1) stat.c1 = getTrimmedAvg(times, len - 1, 1);
				if (len >= 3) stat.c3 = getTrimmedAvg(times, len - 3, 3);
				if (len >= 5) stat.c5 = getTrimmedAvg(times, len - 5, 5);
				if (len >= 12) stat.c12 = getTrimmedAvg(times, len - 12, 12);
				if (len >= 50) stat.c50 = getTrimmedAvg(times, len - 50, 50);
				if (len >= 100) stat.c100 = getTrimmedAvg(times, len - 100, 100);
				
				if (!init) {
					if (stat.c1 < stat.b1) stat.b1 = stat.c1;
					if (stat.c3 < stat.b3) stat.b3 = stat.c3;
					if (stat.c5 < stat.b5) stat.b5 = stat.c5;
					if (stat.c12 < stat.b12) stat.b12 = stat.c12;
					if (stat.c50 < stat.b50) stat.b50 = stat.c50;
					if (stat.c100 < stat.b100) stat.b100 = stat.c100;
				}
				else for (let i = 0; i < len; i++) {
					if (len - i >= 1) stat.b1 = Math.min(stat.b1, getTrimmedAvg(times, i, 1));
					if (len - i >= 3) stat.b3 = Math.min(stat.b3, getTrimmedAvg(times, i, 3));
					if (len - i >= 5) stat.b5 = Math.min(stat.b5, getTrimmedAvg(times, i, 5));
					if (len - i >= 12) stat.b12 = Math.min(stat.b12, getTrimmedAvg(times, i, 12));
					if (len - i >= 50) stat.b50 = Math.min(stat.b50, getTrimmedAvg(times, i, 50));
					if (len - i >= 100) stat.b100 = Math.min(stat.b100, getTrimmedAvg(times, i, 100));
				}
				
				postMessage(stat);
			};
		`);
		worker.onmessage = e => {
			this.stat = e.data;
			for (let key in this.stat) {
				document.getElementById('stat_' + key).textContent = (this.stat[key] == Infinity) ? '-' : (this.stat[key] / 1000).toFixed(3);
			}
		};
		worker.postMessage({ init, len, stat: this.stat, times });
		
		stat_len.textContent = len;
	}

	get_anim(setup, alg) {
		this.resetCube();
		this.turnAlgInstant(setup);
		let alg_moves = alg.split(' ');
		let changes_mat = new Array(alg_moves + 1);
		changes_mat[0] = this.pieces.map(piece => piece.rotationMat);
		let turns = new Array(alg_moves.length);
		alg_moves.forEach((move, i) => {
			this.turnAlgInstant(move);
			changes_mat[i + 1] = this.pieces.map(piece => piece.rotationMat);
			turns[i] = this.turns[this.turns.length - 1];
		});
		let m_ms = 200;
		let p_ms = 50;
		let n = alg_moves.length;
		let duration = n * (m_ms + p_ms);
		
		return { setup, alg, m_ms, p_ms, n, duration, changes_mat, turns };
	}

	anim_prog(anim, prog) {
		prog = Math.min(Math.max(prog, 0), 1);
		let i = Math.floor(anim.n * prog);
		let t = anim.n * prog - i;
		let at = Math.min(t * ((anim.m_ms + anim.p_ms) / anim.m_ms), 1);
		let current_mat = anim.changes_mat[i];
		this.pieces.forEach((piece, i) => {
			piece.rotationMat = piece.rotationMatO = current_mat[i];
			piece.displayed = false;
		});
		if (i < anim.n) {
			let pieces = anim.turns[i].pieces;
			let times = anim.turns[i].times;
			pieces.forEach(piece => {
				piece.turn.times = times;
				piece.turn.axis = anim.turns[i].axis;
				piece.turnStep(at * times);
			});
		}
	}

	anim_input(slider) {
		this.anim_prog(this.anim, slider.value / this.anim.n);
		this.anim.value = slider.value;
		this.anim.play = false;
	}

	animate_start(slider, setup, alg) {
		this.mode = ['animation'];
		this.anim = this.get_anim(setup, alg);
		this.rotateCube(0, 0.35, 0);
		this.rotateCube(-0.35, 0, 0);
		this.anim_prog(this.anim, 0);
		this.anim.value = 0;
		this.anim.play = false;
		slider.step = 0.0001;
		slider.min = 0;
		slider.max = this.anim.n;
		slider.value = 0;
	}
	
	animate_end(slider) {
		this.mode = ['casual'];
		this.resetCube();
		this.turnAlgInstant(this.anim.setup);
		this.rotateCube(0, 0.35, 0);
		this.rotateCube(-0.35, 0, 0);
		this.anim = null;
		slider.value = 0;
	}

	anim_start(slider) {
		this.anim_prog(this.anim, 0);
		this.anim.value = 0;
		this.anim.play = false;
		slider.value = 0;
	}

	anim_backward(slider) {
		if (!this.anim.move) this.anim.value = Math.max(Math.round(this.anim.value - 1), 0);
		this.anim.play = false;
	}

	anim_play(slider) {
		if (this.anim.value == this.anim.n) anim_start();
		this.anim.play = !this.anim.play;
		this.anim.date = Date.now();
		this.anim.preval = Number(slider.value);
		this.anim.move = false;
	}

	anim_forward(slider) {
		if (!this.anim.move) this.anim.value = Math.min(Math.round(this.anim.value + 1), this.anim.n);
		this.anim.play = false;
	}

	anim_end(slider) {
		this.anim_prog(this.anim, 1);
		this.anim.value = this.anim.n;
		this.anim.play = false;
		slider.value = slider.max;
	}

	anim_loop() {
		if (this.anim.play) {
			let dt = Date.now() - this.anim.date;
			let duration = this.anim.n * (this.anim.m_ms + this.anim.p_ms);
			let prog = dt / duration + this.anim.preval / this.anim.n;
			if (prog > 1) {
				this.anim_end(slider);
				anim_updateSVG();
			}
			else {
				this.anim.value = slider.value = prog * this.anim.n;
				this.anim_prog(this.anim, prog);
			}
		}
		else if (this.anim.move) {
			let dt = Date.now() - this.anim.date;
			let duration = this.anim.n * (this.anim.m_ms + this.anim.p_ms);
			let prog = dt / duration;
			let value = this.anim.preval + prog * this.anim.n * Math.sign(this.anim.value - this.anim.preval);
			if (Math.sign(this.anim.value - value) != Math.sign(this.anim.value - this.anim.preval)) {
				value = this.anim.value;
				this.anim.move = false;
			}
			slider.value = value;
			
			this.anim_prog(this.anim, value / this.anim.n);
		}
		else if (Math.abs(Number(slider.value) - this.anim.value) > 0.0001) {
			this.anim.move = true;
			this.anim.date = Date.now();
			this.anim.preval = Number(slider.value);
		}
	}

}

class Piece {

	constructor(x, y, z, id, type, color, orient_mat = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
		this.set = { x, y, z, id, type, color, orient_mat };
		this.reset();
	}

	reset() {
		this.x = this.set.x;
		this.y = this.set.y;
		this.z = this.set.z;
		this.id = this.set.id;
		this.type = this.set.type;
		this.color = this.set.color;
		this.orient_mat = this.set.orient_mat;
		
		this.box = [
			[[-1, +1, -1], [+1, +1, -1], [+1, +1, +1], [-1, +1, +1]],
			[[-1, +1, -1], [-1, +1, +1], [-1, -1, +1], [-1, -1, -1]],
			[[-1, +1, +1], [+1, +1, +1], [+1, -1, +1], [-1, -1, +1]],
			[[+1, +1, +1], [+1, +1, -1], [+1, -1, -1], [+1, -1, +1]],
			[[+1, +1, -1], [-1, +1, -1], [-1, -1, -1], [+1, -1, -1]],
			[[-1, -1, +1], [+1, -1, +1], [+1, -1, -1], [-1, -1, -1]]
		].map((e, i) => e.map(f => ({
			x: (f[0] / 2) + this.x * 1,
			y: (f[1] / 2) + this.y * 1,
			z: (f[2] / 2) + this.z * 1
		})));
		this.boxFaces = this.box.map(face => Vdot(getNormal(face), this) > 0);

		this.rotationMat = [
			{ x: 1, y: 0, z: 0 },
			{ x: 0, y: 1, z: 0 },
			{ x: 0, y: 0, z: 1 }
		];
		this.rotationMatO = [
			{ x: 1, y: 0, z: 0 },
			{ x: 0, y: 1, z: 0 },
			{ x: 0, y: 0, z: 1 }
		];

		this.turning = false;
		this.turn = {};

		this.displayed = false;
	}

	transform(p) {
		return Vmatrix(this.rotationMat, p);
	}

	transformDone(p) {
		let mat = this.turning ? this.rotationMatO.map(v => rotateAxis(v, this.turn.times * Math.PI / 2, this.turn.axis)) : this.rotationMat;
		return Vmatrix(mat, p);
	}

	turnStep(turn_progress) {
		this.turn.progress = turn_progress;
		//let curve = t => t ** (1 / 2);
		//let curve = t => (-t * t * t + 3 * t) / 2;
		
		//https://easings.net/#easeInOutSine
		let curve = x => -(Math.cos(Math.PI * x) - 1) / 2;
		let angle = (Math.PI / 2) * (Math.floor(turn_progress) + curve(turn_progress - Math.floor(turn_progress)));
		this.rotationMat = this.rotationMatO.map(v => rotateAxis(v, angle, this.turn.axis));
	}

	turnDone() {
		this.rotationMat = this.rotationMatO.map(v => rotateAxis(v, this.turn.times * Math.PI / 2, this.turn.axis));
		this.rotationMatO = this.rotationMat;
		this.turning = false;
		this.turn = {};
	}

}