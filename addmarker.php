<?php

include("dbhelper.php");
$link = db_connect();
$guid = mysql_real_escape_string($_POST['guid']);
$lat = mysql_real_escape_string($_POST['lat']);
$long = mysql_real_escape_string($_POST['long']);
$query = "INSERT INTO markers VALUES(".$guid.",".$lat.",".$long.",1";
$result = runquery($link, $query);

?>