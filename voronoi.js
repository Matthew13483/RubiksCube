class Voronoi {
	constructor(canvas) {
		this.canvas = canvas;

		this.genPoints = [];
		this.colors = [];

		for (let i = 0; i < 64; i++) {
			this.genPoints.push([
				Math.random(),
				Math.random()
			]);
			this.colors.push(Math.random());
		}

		this.startTime = Date.now();
	}

	init_gl() {
		let gl = this.canvas.getContext("webgl");

		if (!gl) {
			console.error('WebGL is not supported');
			return;
		}

		this.gl = gl;

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
			attribute vec2 a_position;
			
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
			}
		`;
		let fragmentShaderSource = `
			precision mediump float;
			uniform vec2 dim;
			uniform vec2 points[64];
			uniform float colors[64];
			
			void main() {
				vec2 pos = gl_FragCoord.xy;
				vec3 color0 = vec3(32.0, 32.0, 64.0) / 255.0;
				vec3 color1 = color0;
				vec3 color2 = color0 * 0.5;
				float colorT = 0.0;
				float minD1 = 1e20;
				//vec3 color;
				
				for (int i = 0; i < 64; i++) {
					vec2 genPos = (vec2(mod(float(i), 8.0), floor(float(i) / 8.0)) + points[i]) / 8.0;
					vec2 pixPos = dim * genPos;
					float dist = distance(pixPos, pos);
					if (dist < minD1) {
						minD1 = dist;
						colorT = (1.0 - genPos.y) + (colors[i] - 0.5) * 0.25;
						//color += vec3(1.0 / dist);
					}
				}
				
				gl_FragColor = vec4(mix(color1, color2, colorT), 1.0);
				//gl_FragColor = vec4(color, 1.0);
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

		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

		gl.program = program;
	}

	resize() {
		let gl = this.gl;
		if (!gl) return;

		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	}

	draw_setup() {
		let gl = this.gl;
		if (!gl) return;

		let positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, +1, +1, +1, -1, -1, +1, -1]), gl.STATIC_DRAW);

		let positionAttributeLocation = gl.getAttribLocation(gl.program, 'a_position');
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		this.gl_u = {
			'dim': gl.getUniformLocation(gl.program, 'dim'),
			'points': gl.getUniformLocation(gl.program, 'points'),
			'colors': gl.getUniformLocation(gl.program, 'colors')
		};

		gl.uniform2f(this.gl_u.dim, gl.drawingBufferWidth, gl.drawingBufferHeight);

		gl.uniform1fv(this.gl_u.colors, new Float32Array(this.colors));
	}

	draw() {
		let gl = this.gl;
		if (!gl) return;

		let time = Date.now() - this.startTime;
		let a = 0.01 * time / 1000;
		let sin = Math.sin(a * 2 * Math.PI);
		let cos = Math.cos(a * 2 * Math.PI);
		let genPointsT = [];
		for (let i = 0; i < 64; i++) {
			let p = this.genPoints[i];
			let x = p[0] - 0.5;
			let y = p[1] - 0.5;
			let x1 = x * cos - y * sin;
			let y1 = x * sin + y * cos;
			genPointsT.push(x1 + 0.5, y1 + 0.5);
		}

		gl.uniform2fv(this.gl_u.points, new Float32Array(genPointsT));

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
}