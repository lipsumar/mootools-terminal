<?php

require_once('functions.php');

$_response = array('status'=>'ok');

$msg = $_POST['msg'];

$_ip = $_SERVER['REMOTE_ADDR'];


/*
$_response['status'] = $_ip;
die( json_encode($_response) );
//*/

//first of all, validate the msg
$msg_validation = validate_message($msg);
if($msg_validation['status']=='ok'){
	
	//handle msg
	switch($msg['cmd']){
		case 'connexion-request':
			
			$machineStatus = getMachineStatus($msg['_machineID']);
			
			if($machineStatus['registered']==false){
				//not registered, we can not grant connexion as we don't have a secret for it.
				$_response['connexion-granted'] = false;
				$_response['connexion-refused-reason'] = 'Machine with ID "'.$msg['_machineID'].'" is not registered yet. Please register the machine on the server first. Please advice your network administrator.';
			}else{
				if($machineStatus['connectedTo']===false){
					//not connected
					if(setNewMachineIp($msg['_machineID'],$_ip)){
						$_response['connexion-granted'] = true;
					}else{
						$_response['connexion-granted'] = false;
						$_response['connexion-refused-reason'] = 'Unable to update IP.';
					}
					
				}else if($machineStatus['connectedTo']===$_ip){
					//connected where it should
					$_response['connexion-granted'] = true;
				}else{
					//is already connected at another IP ! This is very likely a hacking attempt.
					$_response['connexion-granted'] = false;
					$_response['connexion-refused-reason'] = 'The machine "'.$msg['_machineID'].'" is already connected with IP '.$machineStatus['connectedTo'];
				}
			}			
			break;
		default:
			$_response['status'] = 'error';
			if($msg['cmd']=='') $_response['error'] = 'No cmd given.';
			else $_response['error'] = 'Unhandled cmd: '.$msg['cmd'];
	}
	
}else{
	
	//message is not valid
	$_response['status'] = 'error';
	$_response['error'] = 'Invalid message: '.$msg_validation['error'];
	
}



//after all validations, if status==ok, update lastSeen
if($_response['status']=='ok') updateLastSeen($msg['_machineID']);



die( json_encode($_response) );

?>