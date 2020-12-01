// Grid size (r x c)
const r = 20, c = 40;

// generate html grid
var x = "";
for (let i = 0; i < r*c; i++){
	x += "<div class=\"cell\" id=\"cell-" + i + "\">_</div>";
}
document.querySelector(".board").innerHTML = x;