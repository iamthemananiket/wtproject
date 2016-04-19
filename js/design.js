var N = get_size(words) 
for (var i = 0; i < N; i++) {
	tr = document.createElement('tr');
	for (var j = 0; j < N; j++) {
		td = document.createElement('td');
		td.id = i+","+j;
		tr.appendChild(td);
	}
	crossword_table.appendChild(tr);
}
crossword_table_info.innerText = N + "X" + N + " CROSSWORD PUZZLE"
for(var i = 0; i < N; i++){
	for(var j = 0; j < N; j++){
		if(cross_word[i][j] != '.'){
			console.log(cross_word[i][j])
			cell = document.getElementById(i+","+j)
			cell.style.background ="black"; 
			cell.style.font = "white";
			cell.innerText =  cross_word[i][j];
			cell.style.color = "wheat";
		}
	}
}
for(var i in order){
	cell = document.getElementById(i+","+j)
}