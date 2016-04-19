function sort_words(words) {
	words.sort(function(x, y){
		return x.length < y.length;
	})
}
function get_initial_size(words) {
	return words.length + words[0].length ;
}
function get_col_size(words) {

	return cross_word[0].length;
}
function get_row_size(words) {
	return cross_word.length;
}
function display_crossword(cross_word) {
	var cross_word_state = new String();
	for(var i in cross_word){
		cross_word_state +=cross_word[i].join() + '\n'
	}
	// document.body.appendChild(cross_word_state)
	 console.log(cross_word_state)
}
function find_suitable_position(word){
	var positions = []
	var max_collisions = 0, collisions = 0, cx = -1, cy = -1, orientation = '.';
	if(word == words[0]){
		positions.push([parseInt(N/2), parseInt((N - word.length)/2), 'h', 0]);
		return positions
	}
	for(var i = 0; i + word.length< N; i++){
		for(var j = 0; j < M; j++){
			collisions = 0;
			var feasible = false;
			if(((j == 0 || cross_word[i][j - 1] == '.') && (j == M - 1 || cross_word[i][j + 1] == '.')) && ((j == 0 || cross_word[i + word.length][j - 1] == '.') && (j == M - 1 || cross_word[i + word.length][j + 1] == '.'))){
				feasible = true;
			}
			if(feasible){				
				feasible = false;
				if(i + word.length < N)
					if(((j == 0 || cross_word[i + word.length][j - 1] == '.') && (j == M - 1 || cross_word[i + word.length][j + 1] == '.')) ){
						feasible = true;
					}	
			}	
			for(var k = 0; feasible && k < word.length  && i + k < N; k++){
				if(cross_word[i + k][j] == word[k]){
					collisions += 1;
				}else if(cross_word[i + k][j] != '.'){
					feasible = false;
				}
			}
			if(feasible && (i + word.length >= N || cross_word[i + word.length][j] == '.') ){
				cx = i;
				cy = j;
				orientation = 'v';
				positions.push([cx, cy, orientation, collisions])
			}
		}
	}
	for(var i = 0; i < N; i++){
		for(var j = 0; j + word.length < M; j++){
			var feasible = false;
			if((((i == 0 || cross_word[i - 1][j] == '.') && (i == N - 1 || cross_word[i + 1][j] == '.'))) && (((i == 0 || cross_word[i - 1][j + word.length] == '.') && (i == N - 1 || cross_word[i + 1][j+ word.length] == '.'))) )
				feasible = true;			
			if(feasible){
				feasible = false;
				if(j + word.length < M)
					if(((i == 0 || cross_word[i - 1][j + word.length] == '.') && (i == N - 1 || cross_word[i + 1][j + word.length] == '.')))
						feasible = true;
			}
			collisions = 0;
			for(var k = 0; feasible && k < word.length && j + k < M; k++){
				if(cross_word[i][j + k] == word[k]){
					collisions += 1;
				}else if(cross_word[i][j + k] != '.'){
					feasible = false;
				}
			}
			if(feasible  && (j + word.length >= M || cross_word[i][j + word.length] == '.')){
				cx = i;
				cy = j;
				orientation = 'h';
				positions.push([cx, cy, orientation, collisions])
			}	
		}
	}
	// // // console.log("copy:", positions)
	console.log(positions.indexOf([9, 7, "v", 1]))
	return positions;

}
function place_word(x, y, orientation, word) {
	 console.log("add",x, y, orientation, word)
	if(orientation == 'v'){
		for(var i = 0; i < word.length; i++){
			cross_word[i + x][y] = word[i];
			cross_word_position_count[x + i][y]++;
		}
	}
	if(orientation == 'h'){
		// // // console.log(word)
		for(var i = 0; i < word.length; i++){
			// // // console.log("before",i, i+y, cross_word[x].length,word[i], '\t',cross_word[x].toString())
			cross_word[x][i + y] = word[i];
			cross_word_position_count[x][y + i]++;
			// // // console.log("end",i, i+y, cross_word[x].length,word[i], '\t',cross_word[x].toString())
			// // // console.log("After ", cross_word)
		}
	}
	console.log(cross_word[x][y] )
	cross_word[x][y] = word[0]+ '*';
}
function remove_word(x, y, orientation, word) {
	 // console.log("remove",x, y, orientation, word)
	// display_crossword(cross_word_position_count)
	if(orientation == 'h'){
		for(var i = 0; i < word.length; i++){
			if(cross_word_position_count[x][y + i] == 1)
				cross_word[x][y + i] = '.';
			cross_word_position_count[x][y + i]--;
		}
	}
	if(orientation == 'v'){
		for(var i = 0; i < word.length; i++){
			if(cross_word_position_count[x + i][y] == 1)
				cross_word[x + i][y] = '.';
			cross_word_position_count[x + i][y]--;
		}
	}
	// display_crossword(cross_word_position_count)
}
function choose_best(i, curr_collisions) {
	var costs = []
	var best_placement = []
	var best_placement_cost = -1;
	console.log(curr_collisions)
	if(i == words.length)
		return curr_collisions;
	var positions = find_suitable_position(words[i]);
	positions.sort(function(x, y) {
		if(Number(x[3]) < Number(y[3]))
			return 1;

		return -1;
	})
	var i = 0
	for (; i < positions.length && positions[i] > 0; i++){

	}
	console.log("previous length",positions.length)
	positions.splice(i+1)
	console.log("current length",positions.length)
	for (var position = 0; position < positions.length; position++){
		var cx = positions[position][0]
		var cy = positions[position][1]
		var orientation = positions[position][2]
		var collisions = positions[position][3]
		place_word(cx, cy, orientation, words[i])
		placement_cost = choose_best(i + 1, curr_collisions + Number(collisions)*Number(collisions));
		if(placement_cost > best_placement_cost){
			best_placement_cost = placement_cost;
			best_placement = [cx, cy, orientation]
		}
		remove_word(cx, cy, orientation, words[i])	
	}
	console.log(best_placement_cost)
	// place_word(best_placement[0], best_placement[1], best_placement[2], words[i])
	return best_placement_cost;
}

var words = ['facebook', 'quora', 'wikipedia', 'google', 'bing', 'stackoverflow', 'flipkart', 'snapdeal', 'amazon', 'paytm', 'cricbuzz', 'glassdoor', 'maheshwari'];
var clues = [];
sort_words(words);
var N = get_initial_size(words), M = get_initial_size(words);
var cross_word = new Array(N);
var cross_word_position_count = new Array(N);
for(var n = 0; n < N; n++){
	cross_word[n] = new Array(N);
	cross_word_position_count[n] = new Array(N);	
}
for(var i = 0; i < N; i++){
	for(var j = 0; j < M; j++){
		cross_word[i][j] = '.';
		cross_word_position_count[i][j] = 0;
	}
}
function generate_crossword(N, M) {
	var order = []
	console.log(words)
	cost = choose_best(0, 0)
	if(cost < 0)
		generate_crossword(2*N, 2*M)
	display_crossword(cross_word);
	for(var i = 0; i < words.length; i++){
		var position = find_suitable_position(words[i]);
		var cx = position[0];
		var cy = position[1];
		var orientation = position[2];
		// // // console.log(position, words[i])
		if(cx >= 0 && cy >= 0){
			place_word(cx, cy, orientation, words[i]);
		}
		// // // console.log(words[i])
		display_crossword(cross_word);
	}
	remove_list = []
	for(var i in cross_word){
		var removable = true;
		for(var j in cross_word[i]){
			
			if(cross_word[i][j] != '.'){
				removable = false;
				break;
			}
			
		}
		if(removable)
			remove_list.push(cross_word[i])
	}
	for(i in remove_list){
		cross_word.splice(cross_word.indexOf(remove_list[i]), 1)
	}
	display_crossword(cross_word)
	remove_list = []
	for(var i in cross_word[0]){
		var removable = true;
		for(var j in cross_word){
			
			if(cross_word[j][i] != '.'){
				removable = false;
				break;
			}
			
		}
		if(removable)
			remove_list.push(i)
	}
	k = 0;
	while(k < remove_list.length){
		for(i in cross_word){
			cross_word[i].splice(remove_list[k], 1)
		}
		for(var i = k + 1; i < remove_list.length; i++)
			remove_list[i]--;
		k++;
	}
	display_crossword(cross_word);

}
generate_crossword(N, M)
