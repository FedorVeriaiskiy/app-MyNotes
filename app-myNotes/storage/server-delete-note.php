<?php
    include 'server-functions.php';
	if(isset($_POST['user_login']) && isset($_POST['note_title'])) {
		$user_login=sanitizeString($_POST['user_login']);
		$note_title=sanitizeString($_POST['note_title']);
			
		$query="DELETE FROM notes WHERE user_login = '$user_login' AND note_title = '$note_title'";
		$result = queryMysql($query) or die('mistake');
	} 
?>