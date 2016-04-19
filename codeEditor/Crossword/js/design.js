var N = get_row_size(words) 
var M = get_col_size(words) 
for(var i in cross_word) {
	tr = document.createElement('tr');
	for(var j in cross_word[i]) {
		td = document.createElement('td');
		td.id = i+","+j;
		tr.appendChild(td);
	}
	crossword_table.appendChild(tr);
}
crossword_table_info.innerText = N + "X" + M + " CROSSWORD PUZZLE"
word_num = 1
for(var i in cross_word){
	for(var j in cross_word[i]){
		if(cross_word[i][j] != '.'){
			// console.log(cross_word[i][j])
			cell = document.getElementById(i+","+j)
			cell.style.background ="wheat"; 
			var p = document.createElement('p');
			p.className = "character"
			p.align = "center"
			s = document.createElement('sup');
			if(cross_word[i][j].indexOf('*') >= 0){
				// console.log(cross_word[i][j].slice(0, 1), cross_word[i][j])
				s.innerText = word_num;
				s.className = "superscript"
				p.innerText = cross_word[i][j].slice(0, 1);
				word_num += 1
			}
			else
				p.innerText = cross_word[i][j];
			cell.appendChild(s)
			cell.appendChild(p)
			cell.style.color = "block";
		}
	}
}
// for(var i in order){
// 	cell = document.getElementById(i+","+j)
// }