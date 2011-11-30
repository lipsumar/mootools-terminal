<?php

/* DB Config */
$db_host = 'localhost';
$db_user = 'terminal';
$db_pass = 'SuArmRCAvf9Lts4x';
$db_name = 'terminal';
$db_prefix = '';
/* DB Config end */


$db = mysql_connect($db_host,$db_user,$db_pass);
mysql_select_db($db_name);


define('T_MACHINES',$db_prefix.'machines');
define('T_USERS',$db_prefix.'users');

function getRecord($table,$uid,$uidField='uid',$andWhere=''){
	$q = 'select * from '.$table.' where '.$uidField.'=\''.$uid.'\' '.$andWhere.' limit 1';
	$res = mysql_query($q);
	$r = mysql_fetch_assoc($res);
	return $r;
}

function getRecords($table,$where='1=1',$group='',$order='',$limit=0){
	$q = 'select * from '.$table.' where '.$where.' '.$group.' '.$order.($limit>0 ? 'limit '.$limit:'');
	//echo $q;
	$res = mysql_query($q);
	$re = array();
	while($r=mysql_fetch_assoc($res)){
		$re[] = $r;
	}
	return $re;
}



function getMachineStatus($machineID){
	$machine = getRecord(T_MACHINES,$machineID,'machineID');
	$return = array('registered'=>false,'connectedTo'=>false,'lastSeen'=>false,'_machine'=>$machine);
	
	if($machine){
		//machine is registered
		$return['registered'] = true;
		if($machine['lastSeen']+30 < time()){
			//disconnected
			$return['connectedTo'] = false;
		}else{
			//connected with an IP already
			$return['connectedTo'] = $machine['ip'];
			$return['lastSeen'] = $machine['lastSeen'];
		}
	}else{
		//never seen this machine before
		$return['registered'] = false;
	}
	
	return $return;
}

function setNewMachineIp($machineID,$ip){
	$q = 'update '.T_MACHINES.' set ip=\''.addslashes($ip).'\' where machineID=\''.$machineID.'\' limit 1';
	return (mysql_query($q) ? true : false);
}

function updateLastSeen($machineID,$now=0){
	$now = ($now==0 ? time() : $now);
	$q = 'update '.T_MACHINES.' set lastSeen='.$now.' where machineID=\''.$machineID.'\' limit 1';
	return (mysql_query($q) ? true : false);
}


function validate_message($msg){
	$r = array('status'=>'ok');
	
	//is it the first message this machine is sending ?
	$machineStatus = getMachineStatus($msg['_machineID']);
	if(!$machineStatus['registered'] && $msg['cmd']=='connexion-request') return $r;
	
	
	
	if(!$msg['_machineID']){
		$r['status'] = 'error';
		$r['error'] = 'No machineID given.';
		return $r;
	}
	
	if(!$msg['_username']){
		$r['status'] = 'error';
		$r['error'] = 'No username given.';
		return $r;
	}
	
	if(!$msg['_sign']){
		$r['status'] = 'error';
		$r['error'] = 'Message without signature.';
		return $r;
	}
	
	//validate signature
	$secret = $machineStatus['_machine']['secret'];
	$toHash = '';
	foreach($msg as $k=>$v){
		if($k!='_sign') $toHash.=$k.'='.$v.$secret.'&';
	}
	$hash = SHA1($toHash);
	
	if($hash !== $msg['_sign']){
		$r['status'] = 'error';
		$r['error'] = 'Invalid signature.';
		return $r;
	}
	
	
	return $r;
	
}


?>