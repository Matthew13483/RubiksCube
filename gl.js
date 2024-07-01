"use strict";

function GL(canvas) {
	var gl = canvas.getContext("webgl");
	if (!gl) console.error('WebGL is not supported');

	let createShader = (gl, type, source) => {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) return shader;

		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	};

	var vertexShaderSource = `
		attribute vec2 a_position;

		uniform vec2 u_resolution;

		void main() {
			// convert the position from pixels to 0.0 to 1.0
			vec2 zeroToOne = a_position / u_resolution;

			// convert from 0->1 to 0->2
			vec2 zeroToTwo = zeroToOne * 2.0;

			// convert from 0->2 to -1->+1 (clip space)
			vec2 clipSpace = zeroToTwo - 1.0;

			//gl_Position = vec4(clipSpace, 0, 1);
			gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
		}
	`;
	var fragmentShaderSource = `
		precision mediump float;
		uniform vec4 u_color;

		void main() {
			gl_FragColor = u_color;
		}
	`;

	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	let createProgram = (gl, vertexShader, fragmentShader) => {
		var program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success) return program;

		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	};

	var program = createProgram(gl, vertexShader, fragmentShader);

	var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
	var positionBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Turn on the attribute
	gl.enableVertexAttribArray(positionAttributeLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2; // 2 components per iteration
	var type = gl.FLOAT; // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

	// set the resolution
	var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	
	gl.program = program;
	return gl;
}

function drawPoly(gl, vertices, color) {
	if (vertices.length <= 2) return;

	let mesh = [];
	for (let i = 2; i < vertices.length; i++) {
		mesh = [
			...mesh,
			vertices[0].x,
			vertices[0].y,
			vertices[i - 1].x,
			vertices[i - 1].y,
			vertices[i].x,
			vertices[i].y
		];
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);

	var colorUniformLocation = gl.getUniformLocation(gl.program, "u_color");
	gl.uniform4f(colorUniformLocation, ...color); //Math.random(), Math.random(), Math.random(), 1);

	// Draw the rectangle.
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = mesh.length / 2;
	gl.drawArrays(primitiveType, offset, count);
}
