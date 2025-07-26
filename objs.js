const objs = {
	colors: [
		[150, 150, 150],
		[252, 252, 252],
		[228, 104, 0],
		[0, 137, 0],
		[176, 0, 0],
		[10, 10, 176],
		[252, 252, 0]
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

let obj_links = [
	['./obj_files/cube_core.obj', 'core'],
	['./obj_files/cube_center.obj', 'center'],
	['./obj_files/cube_edge.obj', 'edge'],
	['./obj_files/cube_corner.obj', 'corner']
];

function loadOBJ(links) {
	links.forEach(link => {
		fetchOBJ(link[0]).then(obj_txt => {
			if (obj_txt) {
				objs[link[1]] = parseOBJ(obj_txt);
				if (typeof Rubik === 'object' && obj_links.every(l => objs[l[1]])) Rubik.draw_setup();
			}
		});
	});
}

loadOBJ(obj_links);