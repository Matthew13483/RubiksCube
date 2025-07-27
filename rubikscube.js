"use strict";

class RubiksCube {

	constructor(canvas) {
		this.canvas = canvas;
		
		let handleStart = event => {
			event.preventDefault();
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
			event.preventDefault();
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
			event.preventDefault();
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
		
		let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
		
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
			/*M: [[[0, 1], [2, 1], [5, 1], [4, 7]], [[0, 4], [2, 4], [5, 4], [4, 4]], [[0, 7], [2, 7], [5, 7], [4, 1]]],
			E: [[[1, 3], [2, 3], [3, 3], [4, 3]], [[1, 4], [2, 4], [3, 4], [4, 4]], [[1, 5], [2, 5], [3, 5], [4, 5]]],
			S: [[[0, 3], [3, 1], [5, 5], [1, 7]], [[0, 4], [3, 4], [5, 4], [1, 4]], [[0, 5], [3, 7], [5, 3], [1, 1]]],
			x: [[[3, 0], [3, 2], [3, 8], [3, 6]], [[3, 1], [3, 5], [3, 7], [3, 3]], [[0, 2], [4, 6], [5, 2], [2, 2]], [[0, 5], [4, 3], [5, 5], [2, 5]], [[0, 8], [4, 0], [5, 8], [2, 8]],
					[[0, 1], [4, 7], [5, 1], [2, 1]], [[0, 4], [4, 4], [5, 4], [2, 4]], [[0, 7], [4, 1], [5, 7], [2, 7]],
					[[1, 0], [1, 6], [1, 8], [1, 2]], [[1, 1], [1, 3], [1, 7], [1, 5]], [[0, 0], [4, 8], [5, 0], [2, 0]], [[0, 3], [4, 5], [5, 3], [2, 3]], [[0, 6], [4, 2], [5, 6], [2, 6]]
			],
			y: [[[0, 0], [0, 2], [0, 8], [0, 6]], [[0, 1], [0, 5], [0, 7], [0, 3]], [[1, 0], [4, 0], [3, 0], [2, 0]], [[1, 1], [4, 1], [3, 1], [2, 1]], [[1, 2], [4, 2], [3, 2], [2, 2]],
					[[1, 3], [4, 3], [3, 3], [2, 3]], [[1, 4], [4, 4], [3, 4], [2, 4]], [[1, 5], [4, 5], [3, 5], [2, 5]],
					[[5, 0], [5, 6], [5, 8], [5, 2]], [[5, 1], [5, 3], [5, 7], [5, 5]], [[1, 6], [4, 6], [3, 6], [2, 6]], [[1, 7], [4, 7], [3, 7], [2, 7]], [[1, 8], [4, 8], [3, 8], [2, 8]]
			],
			z: [[[2, 0], [2, 2], [2, 8], [2, 6]], [[2, 1], [2, 5], [2, 7], [2, 3]], [[0, 6], [3, 0], [5, 2], [1, 8]], [[0, 7], [3, 3], [5, 1], [1, 5]], [[0, 8], [3, 6], [5, 0], [1, 2]],
					[[0, 3], [3, 1], [5, 5], [1, 7]], [[0, 4], [3, 4], [5, 4], [1, 4]], [[0, 5], [3, 7], [5, 3], [1, 1]],
					[[4, 0], [4, 6], [4, 8], [4, 2]], [[4, 1], [4, 3], [4, 7], [4, 5]], [[0, 0], [3, 2], [5, 8], [1, 6]], [[0, 1], [3, 5], [5, 7], [1, 3]], [[0, 2], [3, 8], [5, 6], [1, 0]]
			]*/
		};

		this.algs = {
			T: "R U R' U' R' F R2 U' R' U' R U R' F'",
			
		}
		
		this.solves = [];
		
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
						spec_mul = 0.1;
					}
					
					float len = length(v_position);
					diff_mul = min(diff_mul * 0.444 * len * len, diff_mul);
					
					vec3 ambient = 0.1 * color + 0.3 * vec3(24.0, 24.0, 48.0) / 255.0;
					vec3 diffuse = vec3(0.0);
					vec3 specular = vec3(0.0);
					
					for (int i = 0; i < 5; i++) {
						vec3 lightPos = lightSources[i];
						
						vec3 norm = normalize(v_normal);
						vec3 lightDir = normalize(lightPos - v_position);
						float diff = max(dot(norm, lightDir), 0.0);
						diffuse += lightColors[i] * diff * color;
						
						vec3 viewDir = normalize(camPos - v_position);
						vec3 reflectDir = reflect(-lightDir, norm);
						float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
						specular += lightColors[i] * spec;
					}
					diffuse = clamp(diffuse, 0.0, 1.0);
					specular = clamp(specular, 0.0, 1.0);
					
					vec3 result = ambient + diff_mul * diffuse + 0.5 * spec_mul * specular;
					
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
		this.friction = 0.95;
		this.lastTime = Date.now();
		
		this.touches = [];
		
		this.turn = { ms: [60, 30] };
		
		this.display = {};
		if (this.canvas) this.resize();
		
		this.time_display = '';
		
		this.vertex_data_length;
		this.gl_u = {};
		this.gl_f = {};
		
		this.resetCube();
	}

	resetCube() {
		this.pieces.forEach(piece => piece.reset());
		
		this.pos = { x: 0, y: 0, z: 10.5 };
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
		this.pieces.forEach(piece => {
			if (!piece.displayed) piecesNotDisplayed = true;
			if (!piece.turning) return;
			let turn_progress = (time - piece.turn.startTime) / this.turn.ms[Number(this.scrambling)];
			if (turn_progress < piece.turn.times) {
				piece.turnStep(turn_progress);
				turning_pieces = true;
			}
			else {
				piece.turnDone();
				piecesNotDisplayed = true;
			}
		});
		
		if (turning_pieces || piecesNotDisplayed) this.set_iMat();
		
		if (this.scrambling && !turning_pieces) {
			if (this.scrambleIndex < this.scramble.length) {
				this.turnCubeNotation(this.scramble[this.scrambleIndex]);
				this.scrambleIndex++;
			}
			else {
				this.scrambling = false;
				if (timer.maystart) {
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
	}

	rotateCube(ax, ay, az) {
		this.rotationMat.forEach(v => {
			let p = rotateZ(rotateY(rotateX(v, ax), ay), az)
			v.x = p.x;
			v.y = p.y;
			v.z = p.z;
		});
		this.set_mMat();
	}

	turnCube(pieces, axis, times, instant = false) {
		if (!instant) {
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
			time: timer.update()
		});
		
		if (!instant) sound.play();
		else pieces.forEach(piece => piece.turnDone());

		return true;
	}

	turnCubeNotation(move) {
		let face = move[0];
		let times = Number(move[1]) || 1;
		let clockwise = move[move.length - 1] !== "'";
		let piece = this.center_pieces[face];
		let pieceT = piece.transform(piece);
		let axis = Vnormalize(clockwise ? Vneg(pieceT) : pieceT);
		let pieces = this.pieces.filter(p => Math.abs(Vdot(axis, Vsub(p.transform(p), pieceT))) < 0.1);
		return this.turnCube(pieces, axis, times);
	}

	turnCubeMove(move, set_face = false, instant = false, inverse) {
		if (set_face) this.set_face();
		let move_i = [];
		move.split('').forEach((c, i, a) => (/[a-zA-Z]/g).test(c) && move_i.push(i));
		let moves = move_i.map((m, i, a) => move.substring(m, a[i+1]));
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
			return this.turnCube(pieces, axis, times, instant);
		});
	}

	turnUndo() {
		if (this.turns.length <= this.undoCap) return;
		let turn = this.turns[this.turns.length - 1];
		if (this.turnCube(turn.pieces, Vneg(turn.axis), turn.times)) {
			this.turns.pop();
			this.turns.pop();
			this.turnsCubeMove.pop();
			this.turnsCubeMove.pop();
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
		(inverse ? alg.split(' ').reverse() : alg.split(' ')).forEach(move => this.turnCubeMove(move, false, true, inverse));
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
		let fov = 50 * Math.PI / 180;
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
			let groups_normals = {};
			let normals = [];
			for (let i = 0; i < obj.vertices.length; i++) normals.push([]);

			for (let group in obj.groups) {
				groups_normals[group] = obj.groups[group].map(face => {
					let v0 = vertices[face[0]];
					let v1 = vertices[face[1]];
					let v2 = vertices[face[2]];
					if (!(v0 && v1 && v2)) return;
					let cross = [
						(v0[1] - v2[1]) * (v1[2] - v2[2]) - (v0[2] - v2[2]) * (v1[1] - v2[1]),
						(v0[2] - v2[2]) * (v1[0] - v2[0]) - (v0[0] - v2[0]) * (v1[2] - v2[2]),
						(v0[0] - v2[0]) * (v1[1] - v2[1]) - (v0[1] - v2[1]) * (v1[0] - v2[0])
					];
					let len = Math.hypot(...cross);
					let n = [cross[0] / len, cross[1] / len, cross[2] / len];
					face.forEach(vi => {
						if (!normals[vi].some(ns => Math.hypot(ns[0] - n[0], ns[1] - n[1], ns[2] - n[2]) < 1)) {
							normals[vi].push(n);
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

			for (let group in obj.groups) {
				obj.groups[group].forEach((face, i) => {
					let v0 = vertices[face[0]];
					let v1 = vertices[face[1]];
					let v2 = vertices[face[2]];
					if (!(v0 && v1 && v2)) return;
					let n0 = vertex_normals[face[0]];
					let n1 = vertex_normals[face[1]];
					let n2 = vertex_normals[face[2]];
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
					if (!this.scrambling) {
						let axis = Vsub(piece.transform(face[i]), piece.transform(face[(i + 1) % face.length]));
						for (let a in axis) axis[a] = Math.round(axis[a]);
						let pieces;
						if (axis.x !== 0) pieces = this.pieces.filter(p => Math.abs(p.transformDone(p).x - piece.transformDone(piece).x) < 0.1);
						if (axis.y !== 0) pieces = this.pieces.filter(p => Math.abs(p.transformDone(p).y - piece.transformDone(piece).y) < 0.1);
						if (axis.z !== 0) pieces = this.pieces.filter(p => Math.abs(p.transformDone(p).z - piece.transformDone(piece).z) < 0.1);
						this.turnCube(pieces, axis, 1);
						if (timer.maystart && !timer.running) timer.start();
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
					angle += Math.acos(Math.min(Math.max((ax * bx + ay * by) / (ad * bd), -1), 1)) * Math.sign(ax * by - ay * bx);
					touch.ax = undefined;
					touch.ay = undefined;
				}
			});

			//this.rotateVel.z = -angle;
			this.rotateCube(0, 0, this.rotateVel.z = -angle);
			//this.pos.z = Math.min(Math.max(this.pos.z + -dist * 0.01, 5), 13);
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
		if (this.scrambling) return;
		this.scrambling = true;
		this.scramble = this.generateScramble();
		this.scrambleIndex = 0;
		if (timer.enabled) {
			timer.reset();
			timer.maystart = true;
			timer_display.style.color = '#ffffff';
		}
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
		timer.maystart = false;
		this.undoCap = this.turns.length;
		
		let solution = [];
		let solution_times = [];
		
		let side = ['R', 'U', 'F', 'L', 'D', 'B'];
		let wide = {
			"R": "M'", "U": "E'", "F": "S", "L": "M", "D": "E", "B": "S'",
			"R'": "M", "U'": "E", "F'": "S'", "L'": "M'", "D'": "E'", "B'": "S",
		}
		let n = this.turnsCubeMove.length;
		for (let i = 0; i < n; i++) {
			let turn = this.turnsCubeMove[i];
			let move = turn.move;
			if (turn.shortened) continue;
			if (i < n - 1) {
				let turn1 = this.turnsCubeMove[i + 1];
				let shortened = false;
				let time_diff = turn1.time - turn.time;
				if (turn1.cube_rotations.length == 0) {
					if (time_diff < 250 && turn.move == turn1.move) {
						move = turn.move[0] + '2' + turn.move.slice(1);
						shortened = true;
					}
					if (time_diff < 100) {
						if (wide[turn1.move] == turn.move) {
							move = turn1.move.toLowerCase();
							shortened = true;
						}
						if (wide[turn.move] == turn1.move) {
							move = turn.move.toLowerCase();
							shortened = true;
						}
					}
					if (time_diff < 50 && turn1.move[0] == side[(side.indexOf(turn.move[0]) + 3) % 6]) {
						move = turn.move + turn1.move;
						shortened = true;
					}
				}
				turn1.shortened = shortened;
			}
			solution.push(...turn.cube_rotations, move);
			solution_times.push(turn.time);
		}
		
		this.solves.push({
			scramble: this.scramble.join(' '),
			time: timer.time(),
			solution: solution.join(' '),
			solution_times: solution_times.join(' ')
		});
		console.log(this.solves[this.solves.length - 1]);
	}

	get_face() {
		let centers = ['R', 'U', 'F', 'L', 'D', 'B'];
		let center_pos = centers.map(e => Vnormalize(Vmatrix(this.rotationMat, this.center_pieces[e].transform(this.center_pieces[e]))));
		const used = [];
		
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
				for (const axis of axes) {
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

	show_alg(alg) {
		this.resetCube();
		this.rotateCube(0, -0.35, 0);
		this.rotateCube(-3.5, 0, 0);
		this.turnAlgInstant(alg, true, true);
	}
	//Rubik.show_alg(Rubik.algs.T)

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
			this.turnCubeMove(move, false, true);
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
		this.rotationMatO = this.rotationMat;

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