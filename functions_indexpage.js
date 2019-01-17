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

function sortTable(n,tableName) {
	mostRecentPressedCheckBoxRow = 0; // this is so that after a sort it won't try to press everything spanned by two checkboxes (i.e., it's for something else). 

  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(tableName);
  switching = true;
	
	if (tableName == "foTable") {
		sortType = "letters";
	} else {
		// This is hard-coded (i.e., it assumes column 1 is checkboxes, etc.)
		var sortType = "";
		if (n == 0) {
			sortType = 'checkboxes';
		} else if (n == 2 || n == 3) {
			sortType = "numbers";
		} else {
			sortType = "letters";
		}
	}
	
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until no switching has been done: */
  while (switching) {
	// Start by saying: no switching is done:
	switching = false;
	rows = table.getElementsByTagName("TR");
	/* Loop through all table rows (except the first, which contains table headers): */
	for (i = 1; i < (rows.length - 1); i++) {
	  // Start by saying there should be no switching:
	  shouldSwitch = false;
	  /* Get the two elements you want to compare, one from current row and one from the next: */
	  x = rows[i].getElementsByTagName("TD")[n];
	  y = rows[i + 1].getElementsByTagName("TD")[n];
	  /* Convert them to values that fit their type */
	  if (sortType == 'letters') {
	  	// strings
		  x = x.innerHTML.toLowerCase();
		  y = y.innerHTML.toLowerCase();
	  } else if (sortType == 'numbers') {
	  	// numbers
		x = Number(x.innerHTML);
		y = Number(y.innerHTML);
	  } else if (sortType == 'checkboxes') {
	  	// checkboxes
		x = checkboxOfThisRow(i).checked;
		y = checkboxOfThisRow(i+1).checked;
	  }
	  
//		// This figures out whether they're both numbers. Nate added it but I don't need it anymore. Note that this isn't perfect; number will convert the following to numbers: true, false, " ", "", and probably others. 
// 	  if (isNaN(x) == false && isNaN(y) == false && x.trim() != "" && y.trim != "") {
// 		sortType == 'numbers';
//  	  }

	  /* Check if the two rows should switch place, based on the direction, asc or desc: */
	  if (dir == "asc") {
		if (x > y) {
		  // If so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  } else if (dir == "desc") {
		if (x < y) {
		  // If so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  }
	}
	if (shouldSwitch) {
	  /* If a switch has been marked, make the switch
	  and mark that a switch has been done: */
	  rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
	  switching = true;
	  // Each time a switch is done, increase this count by 1:
	  switchcount ++; 
	} else {
	  /* If no switching has been done AND the direction is "asc",
	  set the direction to "desc" and run the while loop again. */
	  if (switchcount == 0 && dir == "asc") {
		dir = "desc";
		switching = true;
	  }
	}
  }
// document.body.style.cursor = 'auto';
}



// 	 /* When the user clicks on the dropdown button, 
// 	toggle between hiding and showing the dropdown content */
// 	function showDropdown() {
// 		document.getElementById("myDropdown").classList.toggle("show");
// 	}
// 
// 	// Close the dropdown if the user clicks outside of it
// 	window.onclick = function(event) {
// 		if (!event.target.matches('.dropbtn')) {
// 
// 			var dropdowns = document.getElementsByClassName("dropdown-content");
// 			var i;
// 			for (i = 0; i < dropdowns.length; i++) {
// 				var openDropdown = dropdowns[i];
// 				if (openDropdown.classList.contains('show')) {
// 					openDropdown.classList.remove('show');
// 				}
// 			}
// 		}
// 	}