// ---------- Set variables ---------- //
var inputCell = [];
var outputCell = [];
var allBetweenLevelValues = [];
var betweenColumnsSelected = [];
var allWithinLevelValues = [];
var withinColumnsSelected = [];
var dependentVariableColumnsSelected = [];
var howEachVariableIsUsed = [];
var toolTipContent = [];
var numLevels = [];
var setsOfValues = [];
var fileDelimiterArray = [];

window.addEventListener("keydown", checkKeyPressed, false); // make the window listen for a key press	

function checkKeyPressed(e) {
	if (e.keyCode == "79" && fileDelimiterArray.length == 0) { // if they pressed 'o' or 'O', and haven't already input data...
		document.getElementById("files").click(); // Simulate a button press 
	}
}	

function convertTabsToArrayMembers(inArray, inString) {
	var i = 0;
	var x = [];
	x = inString.split("\t");
	for (i = 0; i < x.length; i++) {
		inArray.push(x[i]);
	}
}

function hideFileSelectorStuff() {
	var x = document.getElementById("drop_zone");
	x.style.display = "none";
	x = document.getElementById("fileSelectorBox");
	x.style.display = "none";
	x = document.getElementById("processingBox");
	x.style.display = "none"; 
}

function inputShowHide() {
	var x = document.getElementById("inputTable");
	var y = document.getElementById("inputShowHide");

	if (y.value == "Hide") {
		x.style.display = "none";
		y.value = "Show";
	} else {
		x.style.display = "block";
		y.value = "Hide";
	}		
}

function outputShowHide() {
	var x = document.getElementById("outputTable");
	var y = document.getElementById("outputShowHide");
	
	if (y.value == "Hide") {
		x.style.display = "none";
		y.value = "Show";
	} else {
		x.style.display = "block";
		y.value = "Hide";
	}		
}

function showHide(elementName) {
	var x = document.getElementById(elementName);
	
	if (x.style.display == "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

