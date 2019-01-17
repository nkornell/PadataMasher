//program 1: add to the database
// give it a list of references. 
// for each
// identify it
	// 	give a message if you can't
	// 	next
	// check if it's in the database
	// 	if it is
	// 		update date added
	// 		add it to some list that's displayed on screen
	// 	else
	// 		add it to the database
	// 		display it on screen
	// end if


// Program 2: crunch the numbers
// 	Figure out the list of citees that exist in the database. 
// 	Display a list of citees? Or have them type them in a box
// 	choose which citees you want to compare
// 		put the originals in one box 
// 		put the replications in another
// 	it goes through the database
// 		figures out spits out how many of each 
// 		type there are. 

var foOutputArray = [];
var foProblems = [];
var fileCounter = 0;
var dbFileName = "Citation_Overlap_Database";


function showFOstuff() {
	var x = document.getElementById("foBigBox");
	x.style.display = "block";
}

function import_FOdatabase() {
	console.log( "import_FOdatabase");
}

function add_file_to_FOdatabase(fileNameString) {
	// This works with a single file's data. 
	// It assumes that appropriate values are already assigned to inputCell.
	console.log( "add_file_to_FOdatabase");
	var numRows = inputCell.length;	
	var d = new Date();
	foFileProblems = "";
	var expectedInputArrayLength = 141;

	fileCounter++; 

	// Give a warning if the file formatting looks bad. 
	if (inputCell[0][0].substring(0, 6) != "For:  ") {
		foFileProblems = "Did not find the expected first row. In "+fileNameString+" found "+inputCell[0][0]+ ".\r\n";
	}

	for (i = 4; i < numRows; i++) { //  starting with 4 because the first 3 rows aren't interesting
		// inputCell[i].length = 17; // this trims the years away
		foProblems = '';
		if (inputCell[i][16].trim().length == 0) {
			foProblems += "No DOI found.\r\n"
		}
		if (inputCell[i].length != expectedInputArrayLength) {
			foProblems += "Input has " + inputCell[i].length + " columns. "+expectedInputArrayLength+" expected.\r\n";
		}
		foOutputArray.push([ d, foFileProblems+foProblems, inputCell[0][0].substring(6).trim(), inputCell[i].join("\t") ]);
	}

	
	
	// label duplicate lines. one is removed and the other gets a warning note. 
	// dfd: note, this only works for the first file. 
	var firstAppearance = 0;
	var stringversion = [];
	for (i = 0; i < foOutputArray.length; i++) { // dfd because it goes through the whole thing, it's doing the first file every time a new file is added, etc. it should just do the current file. 
		stringversion.push(foOutputArray[i].join("\t"));
		firstAppearance = stringversion.indexOf(stringversion[stringversion.length-1]);
		if (firstAppearance != stringversion.length-1) {
			foOutputArray[firstAppearance][1] += "Had a duplicate that was removed."
			foOutputArray.splice(i,1);
			i--; // dfd the whole splice and -1 thing is lame. find a better loop system. 
		} else {
			// console.log(foOutputArray[i].outString);
		}
	}

		buildTableFO();
}


// this is how you get json from a server.
// If this code is on the server it works. but it doesn't work locally. 
// Just put it inside <script> tags.
	// var xmlhttp = new XMLHttpRequest();
	// var myURL = "EraseMe.txt";
	
	// xmlhttp.onreadystatechange = function() {
	//   if (this.readyState == 4 && this.status == 200) {
	// 	var myObj = JSON.parse(this.responseText);
	// //     document.getElementById("demo").innerHTML = myObj.name;
	// 	console.log( myObj.name);
	//   }
	// };
	
	// xmlhttp.open("GET", myURL, true);
	// xmlhttp.send();




// returns duplicates. works, but not using right now
// function returnDuplicates(input) {
// 	const inputArray = input;

// 	const count = inputArray => 
// 	inputArray.reduce((a, b) => 
// 		Object.assign(a, {[b]: (a[b] || 0) + 1}), {})

// 	const duplicates = dict => 
// 	Object.keys(dict).filter((a) => dict[a] > 1)

// 	// console.log(count(inputArray)) // { Mike: 1, Matt: 1, Nancy: 2, Adam: 1, Jenny: 1, Carl: 1 }
// 	console.log(duplicates(count(inputArray))) // [ 'Nancy' ]
// }



function buildTableFO() {
	var out = "";
	
	document.getElementById('foHeading').innerHTML = fileCounter + ' files imported.';

	// Build Header
	out = "<tr>";
	out += "<th onclick='sortTable(0, "+'"foTable"'+")' title='Click to Sort'>Date</th>";
	out += "<th onclick='sortTable(1, "+'"foTable"'+")' title='Click to Sort'>Notes</th>";
	out += "<th onclick='sortTable(2, "+'"foTable"'+")' title='Click to Sort'>Citee</th>";
	out += "<th onclick='sortTable(3, "+'"foTable"'+")' title='Click to Sort'>Cited by</th>";
	out += "</tr>";

	// Build all the other cells.
	for (i = 0; i < foOutputArray.length; i++) {
		out = out + "<tr>";
		out = out + "<td>" + foOutputArray[i][0] + "</td>";
		out = out + "<td style='color:red'>" + foOutputArray[i][1] + "</td>";
		out = out + "<td>" + foOutputArray[i][2] + "</td>";
		out = out + "<td>" + foOutputArray[i][3] + "</td>";
		out = out + "</tr>";
	}
	
	// Put everything in the HTML on the page.
	document.getElementById("foTable").innerHTML = "<table>" + out + "</table>";
	
	// If necessary, add an alert for excluded files. 
	if (excludedFile_name.length > 0) {
		var x = document.getElementById("foProblemBox");
		x.style.display = "block";
		document.getElementById("foProblemText").innerHTML = foProblems;
	}
	
	// // make a record of what went in to the onscreen table, to be modified and then recorded later in the file cleanup notes
	// fileNotesLogRaw = out + "\r\n";
	// if (document.getElementById("foExcludedFilesText").innerHTML.length > 0) {
	// 	fileNotesLogRaw += "Files that could not be analyzed: " + document.getElementById("foExcludedFilesText").innerHTML + "\r\n\r\n";
	// }
}



function buildOutputStringFO() {
	var outString = "";
	
	for (i = 0; i < foOutputArray.length; i++) {
		outString += foOutputArray[i].join("\t") + "\r\n"; // add it to outString. 
	}

	return outString;
}

