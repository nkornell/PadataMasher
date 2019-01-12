<?php
if (!isset ($_SESSION)) session_start();
?>
<html>
<head>
<link rel="stylesheet" href="mystyle.css">
	
<script>
function showHint(str) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("downloadLinks").innerHTML = this.responseText;
		}
	};
	xmlhttp.open("GET", "downloadCombinedFiles.php?q=" + str, true);
	xmlhttp.send();
}
</script>

</head>

<body>

<?php
$_SESSION['columnNames'] = "howdy yall";
?>


<p><b>Start typing a name in the input field below:</b></p>
<form> 
<input type="button" value="Cat" onclick="showHint('cat')">
<input type="button" value="Doggy" onclick="showHint('dog')">
</form>

Try it Yourself »

<p>Suggestions: <span id="downloadLinks"></span></p>
</body>
</html>