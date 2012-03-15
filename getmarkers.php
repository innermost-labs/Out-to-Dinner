<?php

include("dbhelper.php");
$link = db_connect();
$guid = mysql_real_escape_string($_POST['guid']);
$query = "SELECT * from markers WHERE guid=".$guid." OR public=1";
$result = runquery($link, $query);
$jason = '{"markers":[';
while($row = mysql_fetch_assoc($result)){
	$jason .='{"lat":"'.$row["lat"].'", "long":"'.$row["long"].'"},'; 
}
echo ($jason.']}');
?>