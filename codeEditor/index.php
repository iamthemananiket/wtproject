<?php
ob_start();
?>
<pre>
<?php
 // header("Content-Type: text/plain");
function get_project_data($project){
	$project_contents = array();
	foreach ($project as $key => $value) {
		$data = $key.':'.'';
		$files = explode(',', $value);
		$file_and_data = array();
		for ($i=0; $i < count($files); $i++) { 
			if(file_exists($files[$i])){
				$fd = fopen($files[$i], "r");
				$content = "";
				while($s=fread($fd, 100)){
					 // echo $s;
					$content = $content.$s;
				}
				$file_and_data[$files[$i]] = $content;
			}
		}
		$project_contents[$key] = $file_and_data;
	}
	// echo json_encode($project_contents);
	echo (json_encode($project_contents)) ;
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
						if(ereg(".+\.js", $value))	{
							$project_files["js"] = $project_files["js"].$parent_dir.'/'.$value.',';
						}
						if(ereg(".+\.css", $value))	{
							$project_files["css"] = $project_files["css"].$parent_dir.'/'.$value.',';
						}
						if(ereg(".+\.html", $value))	{
							$project_files["html"] = $project_files["html"].$parent_dir.'/'.$value.',';
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
				$value = substr($value, 0, strlen($value) - 1);
				$project_value = $project_value.$key.'='.$value.'&';
			}
			$project_value = substr($project_value, 0, strlen($project_value) - 1);
			// echo $project_value;
			parse_str($project_value, $temp);
			// print_r($temp);
			if(setcookie($project, $project_value, time()+1000000, '/'))
				;// ;echo "cookie set";
			else
				echo "Not set";
			get_project_data($temp);

		}else{
			echo "Invalid Path".$project;
		}
	}
	if(isset($_COOKIE['project']) &&isset($_GET['code'])){
		echo $_COOKIE['project'];
		echo exec('whoami');
		$fd = fopen('temp.html', "w");
		echo fwrite($fd, $_GET["code"]);
		fclose($fd);
	}
	ob_flush();
?>
</pre>