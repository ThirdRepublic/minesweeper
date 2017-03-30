<!DOCTYPE HTML>
<!-- Robe Zhang -->
<html>
	<head>
		<title>Robe's Minesweeper</title>
		<script src="static/sweeper.js"></script>
		<link rel="stylesheet" href="static/sweeper.css">
		<link rel="icon" href="static/icon.png"/>
	</head>
	<body>
		<h1>Minesweeper</h1>
		<div>
			<ul>
				<h2>Objective</h2>
				<li>
					Reveal all non-bomb tiles
				</li>
				</br>
				<h2>Rules</h2>
				<li>
					Left click to reveal tile <img src="static/blank.jpg">
				</li>
				<li>
					Right click to flag a bomb <img src="static/flag.jpg">
				</li>
				<li>
					Right click again to mark as unsure <img src="static/question.jpg">
				</li>
				<li>
					The number denotes the surounding bombs <img src="static/6.jpg">
				</li>
			</ul>
		</div>	
		<form action="static/minesweeper.php" method="POST">
			<input type="radio" name="level" value="0" <?php if (!isset($_POST["level"])||$_POST["level"]=="0")echo "checked"?> > Beginner</br>
			<input type="radio" name="level" value="1" <?php if (isset($_POST["level"])&&$_POST["level"]=="1")echo "checked"?> > Intermediate</br>
			<input type="radio" name="level" value="2" <?php if (isset($_POST["level"])&&$_POST["level"]=="2")echo "checked"?> > Expert</br>
			<input type="radio" name="level" value="3" onclick="createCustom()" <?php if (isset($_POST["level"])&&$_POST["level"]=="3")echo "checked"?> > Custom</br>
			<input id="reset" type="submit" value="Start Game">
		</form>
	</body>
	<script>
		tableEle = document.getElementById("table");
		butEle = document.getElementById("reset");
		output = document.getElementById("num");
	</script>
</html>