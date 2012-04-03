<?php
require_once '../../inc/MCAPI.class.php'; //api class
require_once '../../inc/config.inc.php'; //apikey saved as $api_key

$api = new MCAPI($api_key);
$merge_vars = array('FNAME'=>$_POST['first_name'],'LNAME'=>$_POST['last_name'], 'MERGE3'=>$_POST['url'], 'MERGE4'=>$_POST['zip_code'] );
$email_addr = $_POST['email'];

$isally = $_POST['lgbt_ally'];
 
if(strcmp($isally, 'ally')==0){
	$listId = $hostListId;
}
elseif (strcmp($isally, 'lgbt') == 0) {
	$listId = $lgbtListId;
}
else{
	$listId = $userListId;
}


$result =  $api->listSubscribe($listId,$email_addr, $merge_vars);


echo(" | " + $result + " |");
?>
