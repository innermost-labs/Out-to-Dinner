<?php
include("dbhelper.php");
$link = db_connect();
$guid = mysql_real_escape_string($_POST['guid']);
$query = "SELECT * FROM users WHERE guid =".$guid."";
$result = runquery($link, $query);
$row = mysql_fetch_assoc($result);
$jason = '{ "lat":"'.$row['lat'].'","long":"'.$row['long'].'"}';
echo $jason;

?>