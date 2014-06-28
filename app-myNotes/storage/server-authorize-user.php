<?php
    include 'server-functions.php';
	if(isset($_POST['user_login']) && isset($_POST['user_pwd'])) {
		$user_login=sanitizeString($_POST['user_login']);
		$user_pwd=sanitizeString($_POST['user_pwd']);

	$server_callback = array(); 

	$query="SELECT * FROM users WHERE user_login = '$user_login'";
		if(mysql_num_rows(queryMysql($query))) {
			$query="SELECT * FROM users WHERE user_login = '$user_login' AND user_pwd = '$user_pwd'";
			if(mysql_num_rows(queryMysql($query))) {
			$server_callback['message'] = "Wellcome!";
			$server_callback['flag'] = true;
			} else {
				$server_callback['message'] = "Wrong login/password combinationWellcome!";
				$server_callback['flag'] = false;
			}
		} else {
			$query="INSERT INTO users(user_login, user_pwd) VALUES ('$user_login', '$user_pwd')";
			$result = queryMysql($query) or die('mistake');
			$server_callback['message'] = "";
			$server_callback['flag'] = true;
		}		
	echo $server_callback['message'] . '/' . $server_callback['flag'];
	} 
?>