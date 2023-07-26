function sortTable(n,tableName,sortType,direction) {
	mostRecentPressedCheckBoxRow = 0; // this is so that after a sort it won't try to press everything spanned by two checkboxes (i.e., it's for something else). 

	var table, rows, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById(tableName);
  	var switching = true;
  	var reversed = false;
  	
//   	table.style.cursor = "progress"; // this would be cool but it doesn't refresh while the function runs, so you never see it
		
  // Set the sorting direction to ascending:
  dir = "asc"; 
  if (direction != null && direction == "desc") {
  	dir = "desc"
  }
  /* Make a loop that will continue until no switching has been done: */
  while (switching) {
	// Start by saying: no switching is done:
	switching = false;
	rows = table.getElementsByTagName("TR");
	/* Loop through all table rows (except the first, which contains table headers): */
	for (i = 1; i < (rows.length - 1); i++) {
	  // Start by saying there should be no switching:
	  shouldSwitch = false;
	  try {
	  /* Get the two elements you want to compare, one from current row and one from the next: */
	  x = rows[i].getElementsByTagName("TD")[n];
	  y = rows[i + 1].getElementsByTagName("TD")[n];
	  /* Convert them to values that fit their type */
	  if (sortType == 'letters') {
	  	// strings
// 		  x = x.innerHTML.toLowerCase(); //this used to use innerhtml but I changed it to innertext. I hope that's fine. 
// 		  y = y.innerHTML.toLowerCase();
		  x = x.innerText.toLowerCase();
		  y = y.innerText.toLowerCase();
	  } else if (sortType == 'numbers') {
	  	// numbers
		x = Number(x.innerText);
		y = Number(y.innerText);
	  } else if (sortType == 'checkboxes') {
	  	// checkboxes
		x = checkboxOfThisRow(i,tableName).checked; //note: this function only works with combinefiles right now
		y = checkboxOfThisRow(i+1,tableName).checked;
	  }
	  } catch (err) {
	  	console.log( err)
	  	console.log( x)
	  	console.log( rows[i])
	  	console.log( y)
	  }
	  
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
	  /* If no switching has been done, change the sort direction and run the while loop again. */
	  if (switchcount == 0 && reversed == false && dir == "asc") {
		dir = "desc";
		switching = true;
		reversed = true;
	  } else if (switchcount == 0 && reversed == false && dir == "desc") {
		dir = "asc";
		switching = true;
		reversed = true;
	  }
	}
  }
//   table.style.cursor = "auto";
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