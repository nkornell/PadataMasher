function sortTable(n,tableName,sortType) {
	mostRecentPressedCheckBoxRow = 0; // this is so that after a sort it won't try to press everything spanned by two checkboxes (i.e., it's for something else). 

	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById(tableName);
  	switching = true;
		
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until no switching has been done: */
  while (switching) {
	// Start by saying: no switching is done:
	switching = false;
	rows = table.getElementsByTagName("TR");
	/* Loop through all table rows (except the first, which contains table headers): */
	for (i = 1; i < (rows.length - 1); i++) {
	  	console.log( 'letters')
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
		x = checkboxOfThisRow(i,tableName).checked; //note: this function only works with combinefiles right now
		y = checkboxOfThisRow(i+1,tableName).checked;
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

function checkboxOfThisRow(rowIndex,tableName) {
	// Pass this the current row number of a checkbox in its table.
	// It returns the checkbox element that was pressed.
	var table = document.getElementById(tableName);
	var rows = table.getElementsByTagName("TR");
	var whichTD = rows[rowIndex].getElementsByTagName("TD")[0]; // this is zero because the checkboxes are in the first column
	return whichTD.getElementsByTagName('input')[0];
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