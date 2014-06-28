<?php
    include 'server-functions.php';
	if(isset($_POST['user_login'])) {
		$user_login=sanitizeString($_POST['user_login']);
	
	$query="SELECT * FROM users WHERE user_login = '$user_login'";
		if(mysql_num_rows(queryMysql($query))) {		
			$query="DELETE FROM users WHERE user_login = '$user_login'";
			$result = queryMysql($query) or die('mistake');
		}

		$query="DELETE FROM notes WHERE user_login = '$user_login'";
		$result = queryMysql($query) or die('mistake');		
	} 
?>