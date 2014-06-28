<?php
    include 'server-functions.php';
	if(isset($_POST['user_login'])) {
		$user_login=sanitizeString($_POST['user_login']);
	global $notes_list;
		$query="SELECT * FROM notes WHERE user_login = '$user_login'";
		$result = queryMysql($query) or die('mistake');	
		while($row = mysql_fetch_array($result, MYSQL_NUM)) {
			$notes_list .= $row[1] . "/" . $row[2] . "\n";   
		}
	echo $notes_list;
	}
?>