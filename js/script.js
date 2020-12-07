// Grid size (r x c)
const r = 18, c = 40;
var mat = new Array(r*c).fill('_');

// generate html grid
var x = "";
for (let i = 0; i < r*c; i++){
	x += "<div class=\"cell\" id=\"" + i + "\"> </div>";
}
document.querySelector(".board").innerHTML = x;

// ------------------------- BUTTONS -------------------------
var currentSelected = 0;
var runClicked = false;

document.getElementById("start").addEventListener("click", updateSelected);
document.getElementById("end").addEventListener("click", updateSelected);
document.getElementById("wall").addEventListener("click", updateSelected);
document.getElementById("erase").addEventListener("click", updateSelected);
document.getElementById("run").addEventListener("click", runPathfinder);
document.getElementById("reset").addEventListener("click", resetBoard);
var selected = document.getElementById("selected");

function updateSelected(e){
	var id = e.target.id;
	switch(id){
		case "start":
			currentSelected = 1;
			selected.innerHTML = "Currently selected : Start";
			break;
		case "end":
			currentSelected = 2;
			selected.innerHTML = "Currently selected : End";
			break;
		case "wall":
			currentSelected = 3;
			selected.innerHTML = "Currently selected : Wall";
			break;
		case "erase":
			currentSelected = 4;
			selected.innerHTML = "Currently selected : Erase";
			break;
	}
}

// ------------------------- GRID -------------------------

var colors = ['white', 'green', 'red', '#2b2b2b', '#5591f2', 'yellow'];
// 0 = empty, 1 = start, 2 = end, 3 = wall, 4 = visited, 5 = path

var start = -1, end = -2;

var cell = document.getElementsByClassName("cell");
console.log(cell);

for (let i = 0; i < cell.length; i++){
	cell[i].addEventListener("mousedown", function(){
		if (!runClicked)
			switch(currentSelected){
				case 1:
					updateStart(i);
					break;
				case 2:
					updateEnd(i);
					break;
				case 3:
					modifyWall(i, true);
					break;
				case 4:
					modifyWall(i, false);
			}
	});
}

var board = document.querySelector(".board");
let down = false;
board.addEventListener('mousedown', function(e) {
	down = true;
	board.addEventListener('mouseup', function() {
		down = false;
	});

	board.addEventListener('mouseleave', function() {
		down = false;
	});

	board.addEventListener('mouseover', function(e) {
		if (down) {
			if (currentSelected == 3 || currentSelected == 4)
			modifyWall(e.target.id, currentSelected == 3);
		}
  	});
});


function updateStart(idx){
	if (idx !== end){
		if (start != -1){
			cell[start].style.background = colors[0];
			mat[start] = '_';
		}
		start = idx;
		cell[start].style.background = colors[1];
		mat[start] = 'O';
	}
}

function updateEnd(idx){
	if (idx !== start){
		if (end != -2){
			cell[end].style.background = colors[0];
			mat[end] = '_';
		}
		end = idx;
		cell[end].style.background = colors[2];
		mat[end] = 'X';
	}
}

function modifyWall(idx, act){
	if (idx != start && idx != end){
		cell[idx].style.background = (act ? colors[3] : colors[0]);
		mat[idx] = (act ? '#' : '_');
	}
}

// ------------------------- PATHFINDER -------------------------
const timer = ms => new Promise (res => setTimeout(res, ms));
var sedangBerjalan = false;
async function runPathfinder(){
	sedangBerjalan = true;
	if (start == -1 || end == -2 || runClicked)
		return;
	runClicked = true;
	var q = [];
	var dist = new Array(r*c).fill(-1);
	var prev = new Array(r*c).fill(-1);
	var path = [];

	q.push(start);
	dist[start] = 0;
	while(q.length > 0){
		var i = q[0];
		q.shift();

		var atas = i-c, kiri = i-1, bawah = i+c, kanan = i+1;

		// atas
		if (i >= c && dist[atas] == -1 && mat[atas] != '#'){
			q.push(atas);
			prev[atas] = i;
			dist[atas] = dist[i] + 1;
			if (atas == end) break;
			cell[atas].style.background = colors[4];
		}
		// kiri
		if (i % c != 0 && dist[kiri] == -1 && mat[kiri] != '#'){
			q.push(kiri);
			prev[kiri] = i;
			dist[kiri] = dist[i] + 1;
			if (kiri == end) break;
			cell[kiri].style.background = colors[4];
		}
		// bawah
		if ((i+c) < r*c && dist[bawah] == -1 && mat[bawah] != '#'){
			q.push(bawah);
			prev[bawah] = i;
			dist[bawah] = dist[i] + 1;
			if (bawah == end) break;
			cell[bawah].style.background = colors[4];
		}
		// kanan
		if ((i+1) % c != 0 && dist[kanan] == -1 && mat[kanan] != '#'){
			q.push(kanan);
			prev[kanan] = i;
			dist[kanan] = dist[i] + 1;
			if (kanan == end) break;
			cell[kanan].style.background = colors[4];
		}
		await timer(10);
	}
	var prevCur = prev[end];
	while(prevCur != -1 && prevCur != start){
		path.push(prevCur);
		prevCur = prev[prevCur];
	}
	for (i = path.length-1; i > -1; i = i-1) {
		cell[path[i]].style.background = colors['5'];
		await timer(10);
	}
	sedangBerjalan = false
}


// ------------------------- RESET BOARD -------------------------

function resetBoard(){
	if (!sedangBerjalan) {
		for (let i = 0; i < cell.length; i++){
			cell[i].style.background = colors[0];
			mat[i] = '_';
		}
		runClicked = false;
		start = -1, end = -2;
	}
}