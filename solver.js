//9/07/25 - 9/09/25
//Beginner's method for solving 3x3 Rubik's Cube

function cubeSolve(map) {
	// Base 6 moves only
	const baseMoves = {
		U: {
			cp: [1,2,3,0,4,5,6,7],
			co: [0,0,0,0,0,0,0,0],
			ep: [1,2,3,0,4,5,6,7,8,9,10,11],
			eo: [0,0,0,0,0,0,0,0,0,0,0,0]
		},
		D: {
			cp: [0,1,2,3,7,4,5,6],
			co: [0,0,0,0,0,0,0,0],
			ep: [0,1,2,3,4,5,6,7,11,8,9,10],
			eo: [0,0,0,0,0,0,0,0,0,0,0,0]
		},
		F: {
			cp: [3,1,2,7,0,5,6,4],
			co: [1,0,0,2,2,0,0,1],
			ep: [7,1,2,3,0,5,6,8,4,9,10,11],
			eo: [1,0,0,0,1,0,0,1,1,0,0,0]
		},
		B: {
			cp: [0,5,1,3,4,6,2,7],
			co: [0,2,1,0,0,1,2,0],
			ep: [0,1,5,3,4,10,2,7,8,9,6,11],
			eo: [0,0,1,0,0,1,1,0,0,0,1,0]
		},
		R: {
			cp: [4,0,2,3,5,1,6,7],
			co: [2,1,0,0,1,2,0,0],
			ep: [0,4,2,3,9,1,6,7,8,5,10,11],
			eo: [0,0,0,0,0,0,0,0,0,0,0,0]
		},
		L: {
			cp: [0,1,6,2,4,5,7,3],
			co: [0,0,2,1,0,0,1,2],
			ep: [0,1,2,6,4,5,11,3,8,9,10,7],
			eo: [0,0,0,0,0,0,0,0,0,0,0,0]
		}
	};
	
	// Helper: apply one move table
	function applyMoveTable(state, t) {
		let { cp, co, ep, eo } = state;
		let newCp = t.cp.map(i => cp[i]);
		let newCo = t.cp.map((i, idx) => (co[i] + t.co[idx]) % 3);
		let newEp = t.ep.map(i => ep[i]);
		let newEo = t.ep.map((i, idx) => (eo[i] + t.eo[idx]) % 2);
		return { cp: newCp, co: newCo, ep: newEp, eo: newEo };
	}
	
	// Generate derived moves (',2)
	const moveTables = {};
	for (let m in baseMoves) {
		moveTables[m] = baseMoves[m];
	
		// m2 = m applied twice
		let m2 = applyMoveTable(applyMoveTable(
			{ cp:[0,1,2,3,4,5,6,7], co:[0,0,0,0,0,0,0,0],
				ep:[0,1,2,3,4,5,6,7,8,9,10,11], eo:Array(12).fill(0) },
			baseMoves[m]
		), baseMoves[m]);
		moveTables[m+"2"] = m2;
	
		// m' = m applied 3 times
		let m3 = applyMoveTable(m2, baseMoves[m]);
		moveTables[m+"'"] = m3;
	}
	
	function applyMove(state, move) {
		let t = moveTables[move];
		if (!t) throw new Error("Unknown move: " + move);
		return applyMoveTable(state, t);
	}
	
	function doAlg(state, alg) {
		return alg.split(" ").reduce((s, m) => applyMove(s, m), state);
	}
	
	let solution = [];
	let state = cubeToCOEP(map);
	
	let cube_hold_i = 0;
	let cube_hold_preset = [
		["U", "L", "F", "R", "B", "D"],
		["D", "R", "F", "L", "B", "U"],
		["D", "B", "R", "F", "L", "U"],
		["D", "L", "B", "R", "F", "U"],
		["D", "F", "L", "B", "R", "U"]
	]
	function transformMove(move) {
		let i = ["U", "L", "F", "R", "B", "D"].indexOf(move[0]);
		return cube_hold_preset[cube_hold_i][i] + move.substring(1);
	}
	
	function applyAlg(state, solution, alg) {
		if (alg.length == 0) return state;
		for (const mv of alg.split(" ")) {
			let t_mv = transformMove(mv);
			state = applyMove(state, t_mv);
			solution.push(t_mv);
		}
		return state;
	}
	
	//WHITE CROSS
	for (let j = 0; j < 4; j++) {
		cube_hold_i = j + 1;
		let i = state.ep.indexOf(j);
		let alg = "";
		if (i != 0) {
			if (i > 7) {
				alg = ["F2", "U' F2", "U2 F2", "U F2"][(i - 8 - j + 4) % 4];
			}
			else if (i > 3) {
				alg = ["F'", "D' L' D", "D R D'", "F"][(i - 4 - j + 4) % 4];
			}
			else {
				alg = ["", "L' F'", "B' D' L' D", "R F"][(i - j + 4) % 4];
			}
		}
		state = applyAlg(state, solution, alg);
		if (state.eo[j] == 1) {
			state = applyAlg(state, solution, "F D' L D");
		}
	}
	//WHITE CORNERS
	for (let j = 0; j < 4; j++) {
		cube_hold_i = j + 1;
		let i = state.cp.indexOf(j);
		let alg = "";
		if (i != 0) {
			if (i > 3) {
				alg = ["", "U' ", "U2 ", "U "][(i - 4 - j + 4) % 4];
				alg += "L' U' L";
			}
			else {
				alg = ["", "B' F U' B F'", "B F U2 B' F'", "R L' U R' L"][(i - j + 4) % 4];
			}
		}
		state = applyAlg(state, solution, alg);
		if (state.co[j] == 1) {
			state = applyAlg(state, solution, "L' U' L U L' U' L");
		}
		else if (state.co[j] == 2) {
			state = applyAlg(state, solution, "L' U L U' L' U L");
		}
	}
	//SECOND LAYER
	let nn = 0;
	for (let j = 4; j < 8; j++) {
		if (nn++ > 36) {
			console.log("2nd Layer loop exceeded limit");
			break;
		}
		cube_hold_i = j + 1 - 4;
		let i = state.ep.indexOf(j);
		let alg = "";
		if (i != j || state.eo[i] == 1) {
			if (i > 7) {
				if ((state.eo[i] + j) % 2 == 1) {
					alg = ["U' ", "U2 ", "U ", ""][(i - 8 - j + 8) % 4];
					alg += "L' U L U F U' F'";
				}
				else {
					alg = ["U2 ", "U ", "", "U' "][(i - 8 - j + 8) % 4];
					alg += "F U' F' U' L' U L";
				}
			}
		}
		state = applyAlg(state, solution, alg);
		if (j == 7) {
			for (let n = 4; n < 8 && j == 7; n++) {
				if (state.ep[n] > 7) {
					j = 4 - 1;
					//console.log('redo');
					break;
				}
				else if (state.ep[n] != n || state.eo[n] != 0) {
					cube_hold_i = n + 1 - 4;
					state = applyAlg(state, solution, "F U' F' U' L' U L");
					j = 4 - 1;
					//console.log('stuck redo');
					break;
				}
			}
		}
	}
	//YELLOW ORIENTATION OF EDGES
	cube_hold_i = 1;
	let eo_n = 0;
	let eo_pattern = [];
	let eo_ci = 0;
	for (let j = 8; j < 12; j++) {
		let eo = state.eo[j];
		let eo_prev = eo_pattern[eo_pattern.length - 1];
		if (eo_prev == 0 && eo == 1) eo_ci = j - 8;
		eo_n += eo;
		eo_pattern.push(eo);
	}
	if (eo_n == 4) {
		state = applyAlg(state, solution, "F R U R' U' F' U2 F U R U' R' F'");
	}
	else if (eo_n == 2) {
		if (eo_pattern[0] == eo_pattern[2]) {
			let alg = (eo_pattern[0] == 1) ? "" : "U ";
			alg += "F R U R' U' F'";
			state = applyAlg(state, solution, alg);
		}
		else {
			let alg = ["U' ", "U2 ", "U ", ""][eo_ci];
			alg += "F U R U' R' F'";
			state = applyAlg(state, solution, alg);
		}
	}
	//YELLOW ORIENTATION OF CORNERS
	let co_patterns = {
		"0222" : "R U R' U R U2 R'",
		"1101" : "R U2 R' U' R U' R'",
		"1002" : "R2 D R' U2 R D' R' U2 R'",
		"0120" : "R U R D R' U' R D' R2",
		"0102" : "R2 D R' U R D' R' U' R'",
		"2121" : "R U R' U R U' R' U R U2 R'",
		"2112" : "R U2 R2 U' R2 U' R2 U2 R",
	};
	let co_pattern = state.co.slice(4);
	for (let s = 0; s < 4; s++) {
		let pat = co_pattern.slice(4 - s, 4).concat(co_pattern.slice(0, 4 - s)).join('');
		if (pat in co_patterns) {
			let alg = ["", "U ", "U2 ", "U' "][s];
			alg += co_patterns[pat];
			state = applyAlg(state, solution, alg);
			break;
		}
	}
	//YELLOW PERMUTATION OF CORNERS
	let cp_d = [];
	for (let j = 4; j < 8; j++) {
		cp_d.push((j - state.cp[j] + 4) % 4);
	}
	for (let s = 0; s < 4; s++) {
		let pat = cp_d.slice(4 - s, 4).concat(cp_d.slice(0, 4 - s)).join('');
		if (pat[0] == pat[2] && pat[0] != pat[1]) {
			let alg = "F R U' R' U' R U R' F' R U R' U' R' F R F'";
			state = applyAlg(state, solution, alg);
			break;
		}
		else if (pat[0] == pat[1] && pat[0] != pat[2]) {
			let alg = ["", "U ", "U2 ", "U' "][s];
			alg += "R U R' U' R' F R2 U' R' U' R U R' F'";
			state = applyAlg(state, solution, alg);
			break;
		}
	}
	let alg = ["", "U'", "U2", "U"][(4 - state.cp[4] + 4) % 4];
	state = applyAlg(state, solution, alg);
	//YELLOW PERMUTATION OF EDGES
	let ep_patterns = {
		"1102" : "R U' R U R U R U' R' U' R2",
		"3203" : "R2 U R U R' U' R' U' R' U R'",
		"2222" : "R2 U2 R' U2 R2 U2 R2 U2 R' U2 R2",
		"3131" : "R' U' R U' R U R U' R' U R U R2 U' R'"
	};
	let ep_d = [];
	for (let j = 8; j < 12; j++) {
		ep_d.push((j - state.ep[j] + 4) % 4);
	}
	for (let s = 0; s < 4; s++) {
		let pat = ep_d.slice(4 - s, 4).concat(ep_d.slice(0, 4 - s)).join('');
		if (pat in ep_patterns) {
			let alg = ["", "U ", "U2 ", "U' "][s];
			alg += ep_patterns[pat];
			state = applyAlg(state, solution, alg);
			break;
		}
	}
	alg = ["", "U'", "U2", "U"][(4 - state.cp[4] + 4) % 4];
	state = applyAlg(state, solution, alg);
	
	//console.log(state)
	return solution;
}

function cubeToCOEP(map) {
	// solved cube reference colors
	const solved_map = [
		Array(9).fill(1), // U
		Array(9).fill(2), // L
		Array(9).fill(3), // F
		Array(9).fill(4), // R
		Array(9).fill(5), // B
		Array(9).fill(6)	// D
	];

	const cp_s = ['UFR','URB','UBL','ULF','DRF','DBR','DLB','DFL'];
	const ep_s = ['UF','UR','UB','UL','FR','BR','BL','FL','DF','DR','DB','DL'];

	// (face, index) positions for each cubie
	const corner_pos = {
		UFR: [[0,8],[2,2],[3,0]],
		URB: [[0,2],[3,2],[4,0]],
		UBL: [[0,0],[4,2],[1,0]],
		ULF: [[0,6],[1,2],[2,0]],
		DRF: [[5,2],[3,6],[2,8]],
		DBR: [[5,8],[4,6],[3,8]],
		DLB: [[5,6],[1,6],[4,8]],
		DFL: [[5,0],[2,6],[1,8]]
	};

	const edge_pos = {
		UF: [[0,7],[2,1]],
		UR: [[0,5],[3,1]],
		UB: [[0,1],[4,1]],
		UL: [[0,3],[1,1]],
		FR: [[2,5],[3,3]],
		BR: [[4,3],[3,5]],
		BL: [[4,5],[1,3]],
		FL: [[2,3],[1,5]],
		DF: [[5,1],[2,7]],
		DR: [[5,5],[3,7]],
		DB: [[5,7],[4,7]],
		DL: [[5,3],[1,7]]
	};

	function getStickers(m, positions) {
		return positions.map(([f,i]) => m[f][i]);
	}

	function sameSet(a, b) {
		return a.length === b.length && a.every(x => b.includes(x));
	}

	function cornerOrientation(cur, solved) {
		// U=1, D=6
		/*let uColors = [1,6];
		let idxCur = cur.findIndex(c => uColors.includes(c));
		let idxSol = solved.findIndex(c => uColors.includes(c));
		return (idxCur - idxSol + 3) % 3;*/
		if (cur[0] == solved[0]) return 0;
		if (cur[0] == solved[1]) return 1;
		if (cur[0] == solved[2]) return 2;
	}

	function edgeOrientation(cur, solved) {
		/*let uColors = [1,6];
		let bColors = [2,4];
		if (uColors.includes(solved[0])) {
			return uColors.includes(cur[0]) ? 0 : 1;
		}
		else {
			return bColors.includes(cur[0]) ? 0 : 1;
		}*/
		return cur[0] == solved[0] ? 0 : 1;
	}

	let cp = new Array(8);
	let co = new Array(8);
	let ep = new Array(12);
	let eo = new Array(12);

	// corners
	cp_s.forEach((slot, i) => {
		let cur = getStickers(map, corner_pos[slot]);
		for (let j = 0; j < cp_s.length; j++) {
			let solved = getStickers(solved_map, corner_pos[cp_s[j]]);
			if (sameSet(cur, solved)) {
				cp[i] = j;
				co[i] = cornerOrientation(cur, solved);
				break;
			}
		}
	});

	// edges
	ep_s.forEach((slot, i) => {
		let cur = getStickers(map, edge_pos[slot]);
		for (let j = 0; j < ep_s.length; j++) {
			let solved = getStickers(solved_map, edge_pos[ep_s[j]]);
			if (sameSet(cur, solved)) {
				ep[i] = j;
				eo[i] = edgeOrientation(cur, solved);
				break;
			}
		}
	});

	return { cp, co, ep, eo };
}