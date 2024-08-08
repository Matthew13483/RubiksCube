const objs = {
	colors: [
		[252, 252, 252],
		[220, 96, 0],
		[0, 133, 0],
		[176, 0, 0],
		[10, 10, 176],
		[252, 252, 0],
		[16, 16, 16]
	]
};

async function fetchOBJ(filePath) {
	try {
		const response = await fetch(filePath);
		if (!response.ok) throw new Error(response.status);
		return await response.text();
	} catch (error) {
		console.error(error);
	}
}
function parseOBJ(text) {
	const lines = text.split('\n');
	const vertices = [];
	const groups = {};
	let currentGroup = 'default';
	lines.forEach(line => {
		const parts = line.trim().split(/\s+/);
		const type = parts[0];
		switch (type) {
			case 'v':
				vertices.push(parts.slice(1).map(Number));
				break;
			case 'g':
				currentGroup = parts[1];
				if (!groups[currentGroup]) groups[currentGroup] = [];
				break;
			case 'f':
				const face = parts.slice(1).map(p => parseInt(p.split('/')[0], 10) - 1);
				groups[currentGroup].push(face);
				break;
		}
	});

	return { vertices, groups };
}

[['/obj_files/cube_core.obj', 'core'], ['/obj_files/cube_center.obj', 'center'], ['/obj_files/cube_edge.obj', 'edge'], ['/obj_files/cube_corner.obj', 'corner']].forEach(link => {
	fetchOBJ(link[0]).then(obj_txt => {
		objs[link[1]] = parseOBJ(obj_txt);
	});
});