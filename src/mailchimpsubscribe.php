<?php

require_once '../inc/MCAPI.class.php'; //api class
require_once '../inc/config.inc.php'; //apikey saved as $api_key

$api = new MCAPI($api_key);
//$api->useSecure(true);
//$merge_vars = array('FNAME'=>$_POST['fname'], 'LNAME'=>$_POST['lname'], 'MERGE3'=>$_POST['UURL']);
$merge_vars = array('MERGE3'=>$_POST['MERGE3']);
$email_addr = $_POST['email'];

$result =  $api->listSubscribe($listId,$email_addr, $merge_vars);
/**
echo(" | " + $result + " |");
if($api->errorCode){

	echo "\n\tCode=".$api->errorCode;
	echo "\n\tMsg=".$api->errorMessage."\n";
}
**/
return $result;


?>



