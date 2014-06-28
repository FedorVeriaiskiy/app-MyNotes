<?php
    include 'server-functions.php';
	if(isset($_POST['user_login']) && isset($_POST['note_title'])) {
		$user_login=sanitizeString($_POST['user_login']);
		$note_title=sanitizeString($_POST['note_title']);
		$note_content=sanitizeString($_POST['note_content']);

		$query="SELECT * FROM notes WHERE user_login = '$user_login' AND note_title = '$note_title'";	
		if(mysql_num_rows(queryMysql($query))) {			
			$query="UPDATE notes SET note_content = '$note_content' WHERE user_login = '$user_login' AND note_title = '$note_title'"; 		
		} else {	
			$query="INSERT INTO notes (user_login, note_title, note_content) VALUES ('$user_login', '$note_title', '$note_content')";
		}
		$result = queryMysql($query) or die('mistake');

	} 
?>