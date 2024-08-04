class Voronoi {
	constructor(canvas) {
		this.canvas = canvas;

		this.genPoints = [];
		this.colorList = [];

		for (let i = 0; i < 64; i++) {
			this.genPoints.push([
				Math.random(),
				Math.random()
			]);
			this.colorList.push(Math.random());
		}

		let gl = canvas.getContext("webgl");

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
			
			uniform vec2 u_resolution;
			
			void main() {
				gl_Position = vec4((a_position / u_resolution) * 2.0 - 1.0, 0, 1);
			}
		`;
		let fragmentShaderSource = `
			precision mediump float;
			uniform vec2 dim;
			uniform vec2 points[256];
			uniform float colors[256];
			uniform float B;
			
			void main() {
				vec2 pos = gl_FragCoord.xy;
				vec3 color1 = vec3(24.0, 24.0, 48.0) / 255.0;
				vec3 color2 = vec3(32.0, 32.0, 64.0) / 255.0;
				float colorT = 0.0;
				float minD1 = 1e20;
				
				for (int i = 0; i < 64; i++) {
					vec2 genPos = (vec2(mod(float(i), 8.0), floor(float(i) / 8.0)) + points[i]) * dim / 8.0;
					float dist = distance(genPos, pos);
					if (dist < minD1) {
						minD1 = dist;
						colorT = (1.0 - genPos.y / dim.y) + (colors[i] - 0.5) * 0.25;
					}
				}
				
				gl_FragColor = vec4(mix(color1, color2, colorT), 1.0);
			}
		`;

		let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

		let createProgram = (gl, vertexShader, fragmentShader) => {
			let program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			let success = gl.getProgramParameter(program, gl.LINK_STATUS);
			if (success) return program;

			console.log(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
		};

		let program = createProgram(gl, vertexShader, fragmentShader);

		let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
		let positionBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(program);

		gl.enableVertexAttribArray(positionAttributeLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		let size = 2;
		let type = gl.FLOAT;
		let normalize = false;
		let stride = 0;
		let offset = 0;
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

		let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
		gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

		let vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition');
		gl.enableVertexAttribArray(vertexPositionAttribute);

		let vertices = new Float32Array([
			0.0, 0.0,
			canvas.width, 0.0,
			0.0, canvas.height,
			canvas.width, canvas.height
		]);

		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.program = program;
	}

	resize() {
		let gl = this.gl;
		if (!gl) return;

		let canvas = gl.canvas;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		let resolutionUniformLocation = gl.getUniformLocation(gl.program, "u_resolution");
		gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

		let vertexPositionAttribute = gl.getAttribLocation(gl.program, 'aVertexPosition');
		gl.enableVertexAttribArray(vertexPositionAttribute);

		let vertices = new Float32Array([
			0.0, 0.0,
			canvas.width, 0.0,
			0.0, canvas.height,
			canvas.width, canvas.height
		]);

		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	}

	draw() {
		let gl = this.gl;
		if (!gl) return;

		gl.uniform2f(gl.getUniformLocation(gl.program, "dim"), gl.canvas.width, gl.canvas.height);

		gl.uniform2fv(gl.getUniformLocation(gl.program, "points"), new Float32Array(this.genPoints.flat()));
		gl.uniform1fv(gl.getUniformLocation(gl.program, "colors"), new Float32Array(this.colorList));

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
}