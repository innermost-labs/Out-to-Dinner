<?php

function db_connect(){
	$link = mysql_connect('localhost','nate', 'password1');
	if (!$link) {
	    die('Could not connect: ' . mysql_error());
	}
	return $link;
}
function runquery($link, $query){
	$link = mysql_select_db("Test", $link);
	$result = mysql_query($query) or die(mysql_error());
	return $result;

}

?>