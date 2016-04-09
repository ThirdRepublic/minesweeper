<!-- Robe Zhang -->

<?php
	if(!isset($_SESSION))
		session_start();	
	$_SESSION["customRow"] = $_POST["customRow"];
	$_SESSION["customCol"] = $_POST["customCol"];
	$_SESSION["customBombCount"] = $_POST["customBombCount"];
?>
