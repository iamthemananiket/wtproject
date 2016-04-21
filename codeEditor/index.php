<?php
ob_start();
?>
<pre>
<?php
function parse($text) {
    // Damn pesky carriage returns...
    $text = str_replace("\r\n", "\n", $text);
    $text = str_replace("\r", "\n", $text);

    // JSON requires new line characters be escaped
    $text = str_replace("\n", "\\n", $text);
    return $text;
}
 // header("Content-Type: text/plain");
function get_project_data($project){
	// print_r($project);
	$project_contents = array();
	foreach ($project as $key => $value) {
		for ($i=0; $i < count($value); $i++) {
			$file = $project[$key][$i];
			$file_and_data = array(); 
			if(file_exists($file)){
				$fd = fopen($file, "r");
				$content = "";
				while($s=fread($fd, 100)){
					 // echo $s;
					$content = $content.$s;
				}
				$file_and_data[$file] = $content;
				$project[$key][$i] = $file_and_data;
			}
		}
	}
	// print_r($project);
	// echo json_encode($project_contents);
	echo (json_encode($project)) ;
}
?>
<?php
	if(isset($_GET["project"]))
	{
		$project = $_GET["project"];
		if(is_dir($project)){
			$path = $project;
			$project_files = array('js' =>  "", 'html' => "", 'css' =>  "");
			$path_list = array($path);
			while(count($path_list) && count($files = scandir($path_list[count($path_list) - 1])) > 2){
				// print_r($files);
				$parent_dir = $path_list[count($path_list) - 1];
				array_pop($path_list);
				foreach ($files as $key => $value) {
					if($value != '.' and $value != '..'){
						// echo($value."\n");
						if(ereg(".+\.js", $value))	{
							$project_files["js"] = $project_files["js"].$parent_dir.'/'.$value.'&';
						}
						if(ereg(".+\.css", $value))	{
							$project_files["css"] = $project_files["css"].$parent_dir.'/'.$value.'&';
						}
						if(ereg(".+\.html", $value))	{
							$project_files["html"] = $project_files["html"].$parent_dir.'/'.$value.'&';
						}
						if(is_dir($parent_dir.'/'.$value))
							array_push($path_list, $parent_dir.'/'.$value);												
					}
				}
				// echo "Path List";
				 // print_r($path_list);
			}
			$project_value = "";
			// print_r($project_files);
			foreach ($project_files as $key => $value) {
				// echo $key.":".$value;
				$value = substr($value, 0, strlen($value) - 1);
				$value_array = explode('&', $value);
				for ($i=0; $i < count($value_array); $i++) { 
					$project_value = $project_value.$key.'[]='.$value_array[$i].'&';
				}
					
			}
			$project_value = substr($project_value, 0, strlen($project_value) - 1);
			// echo $project_value.'\n';
			parse_str($project_value, $temp);
			// print_r($temp);
			if(setcookie('project', $project_value, 0, '/'))
				;// ;echo "cookie set";
			else
				echo "Not set";
			// echo $temp;
			get_project_data($temp);

		}else{
			echo "Invalid Path".$project;
		}
	}
	if(isset($_GET['code'])){
		parse_str($_COOKIE['project'], $temp);
		// print_r($temp);
		$content = json_decode(parse($_GET['code']), true);
		// var_dump($temp);
		// print_r($content);
		foreach ($content as $i => $j) {
			foreach ($j as $k => $l) {
				foreach ($l as $key => $value) {
					$dirs = explode('/', $key);
					$path = "";
					if(count($dirs) > 1){
						$path = implode('/', array_slice($dirs, 0, $length = count($dirs)- 1));
						echo $path;
						echo "<><><><<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>";

						if(!is_dir($path) && !file_exists($key))
							mkdir ($path , $mode = 0777 , $recursive = true );
					}
					$fd = fopen($key, "w");
					fwrite($fd, $value);
					fclose($fd);
					# code...
				}
				# code...
			}

		}

	}
	ob_flush();
?>
</pre>