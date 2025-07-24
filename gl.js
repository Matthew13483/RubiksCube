function GL(canvas) {
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
		let success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success) return program;

		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	};

	let program = createProgram(gl, vertexShader, fragmentShader);
	gl.useProgram(program);

	gl.program = program;

	return gl;
}

function GLresize(gl) {
	if (!gl) return;
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	gl.uniform2f(gl.getUniformLocation(gl.program, "u_resolution"), gl.drawingBufferWidth, gl.drawingBufferHeight);
}