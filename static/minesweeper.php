<!DOCTYPE HTML>
<!-- Robe Zhang -->
<?php
	if(!isset($_SESSION))
		session_start();
?>
<html>
	<head>
		<title>Robe's Minesweeper</title>
		<script src="sweeper.js"></script>
		<link rel="stylesheet" href="sweeper.css">
		<link rel="icon" href="icon.png"/>
	</head>
	<body onload="loadGame(<?php echo $_POST['level']?>);">
		<table id="table"></table>
		<button id="reset" onclick="loadGame(<?php echo $_POST["level"]?>);">
			Load Game 
		</button>
		<form action="../index.php" method="POST">
			<input type="radio" name="level" onclick="butEle.setAttribute('onclick','loadGame(0)');loadGame(0);" value="0" <?php if ($_POST["level"] == "0") echo "checked"?> > Beginner</br>
			<input type="radio" name="level" onclick="butEle.setAttribute('onclick','loadGame(1)');loadGame(1);" value="1" <?php if ($_POST["level"] == "1") echo "checked"?> > Intermediate</br>
			<input type="radio" name="level" onclick="butEle.setAttribute('onclick','loadGame(2)');loadGame(2);" value="2" <?php if ($_POST["level"] == "2") echo "checked"?> > Expert </br>
			<input type="radio" name="level" onclick="createCustom();loadGame(3);" value="3" <?php if ($_POST["level"] == "3") echo "checked"?> > Custom </br>
			<input class="buttonReturn" type="submit" value="Return to Main Menu">
		</form>
		<p id="num"></p>
	</body>
	<script>
		tableEle = document.getElementById("table");
		butEle = document.getElementById("reset");
		output = document.getElementById("num");
		<?php if ($_POST["level"] == "3")
			echo 'MODES[3] = new Mode('.$_SESSION["customRow"].','.$_SESSION["customCol"].','.$_SESSION["customBombCount"].')';			
		?>
	</script>
</html>

