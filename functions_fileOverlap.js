//program 1: add to the database

// Program 2: crunch the numbers
// 	Figure out the list of citees that exist in the database. 
// 	Display a list of citees? Or have them type them in a box
// 	choose which citees you want to compare
// 		put the originals in one box 
// 		put the replications in another
// 	it goes through the database
// 		figures out spits out how many of each 
// 		type there are. 

// to do
// 	there shold only be one function per page, I should split these "apps" up
//	or maybe both, but there should be separate outputs. 
// 	and there needs to be a summary output as well. Or maybe only. 

var notesForGoodReferences = "";
var excludedReferences = "";
var fileCounter = 0;
var dbFileName = "Citation_Overlap_Database";
var article = [];
var articleParamNames = [];
var listOfCitees = [];
var articleType = [];

function showFOstuff() {
	var x = document.getElementById("foBigBox");
	x.style.display = "block";
}

function import_FOdatabase() {
	console.log( "import_FOdatabase needs to be written");
}

function Article(din, cin, nin, inputArray) {
	this.dateAdded = din;
	this.citee = cin;
	this.notes = nin;
	this.type = "";
	this.uniqueID = "";
	var i = 0;
	for (i = 0; i < inputArray.length; i++ ) {
		this[articleParamNames[i]] = inputArray[i];
	}
}

function add_file_to_FOdatabase(fileNameString) {
	// This works with a single file's data. 
	// It assumes that appropriate values are already assigned to inputCell.
	var numRows = inputCell.length;	
	var d = new Date();
	foFileProblems = "";
	var expectedInputArrayLength = 141;
	var tempID = "";
	var tempIDlist = [];

	fileCounter++; 

	articleParamNames = inputCell[2]; // dfd for later, check this against expected value

	// Give a warning if the file formatting looks bad. 
	if (inputCell[0][0].substring(0, 6) != "For:  ") {
		foFileProblems = "Did not find the expected first row. In "+fileNameString+" found "+inputCell[0][0]+ ".\r\n";
	}
	

	for (i = 3; i < numRows; i++) { //  starting with 3 because that's the first citation
		notesForGoodReferences = '';
		if (inputCell[i][16].trim().length == 0) {
			// notesForGoodReferences += "No DOI found.\r\n" // decided not to include this cause it's OK. 
		}
		if (inputCell[i].length != expectedInputArrayLength) {
			notesForGoodReferences += "Input has " + inputCell[i].length + " columns. "+expectedInputArrayLength+" expected.\r\n";
		}
		
		var temp = new Article(d, inputCell[0][0].substring(6), notesForGoodReferences, inputCell[i]);
		tempID = temp.Title+". ("+temp["Publication Year"]+"). "+temp.Authors+" "+temp["Source Title"]+". DOI:"+temp.DOI;
		if (tempIDlist.indexOf(tempID) == -1) {
			// if it's not a repetition
			article.push(temp);
			article[article.length-1].uniqueID = tempID;
			tempIDlist.push(tempID);
		} else {
			excludedReferences += "<p><strong>Excluded </strong>Appeared more than once in the same file<br>" + tempID + "\r\n";
		}
	}

	// next steps (not done yet)
	// check if the citee/citer pair is already in the database
	// 	if it is 
	// 		remove the older version
	//		add the new one to the database (the new one has newer citation counts)
	// 		display it on screen with an "updated" label
	// 	else
	// 		add it to the database
	// 		display it on screen with a "new" label
	// end if
}

function createListOfCitees() {
	console.log( "createListofCitees launched");
	for (i = 0; i < article.length; i++) {
		if (listOfCitees.includes(article[i].citee) === false) {
			listOfCitees.push(article[i].citee);
		}
	}
	console.log( listOfCitees);
}

function compute_citation_overlap() {
	// right now i'm a assume that whatever's been imported is my stuff. 
	// later I'll have to pull articles in from the database
	
	createListOfCitees(); // dfd this might be better elsewhere just for smart orginizatio
	console.log( "compute_citation overlap launched");

	// dfd this is super fake, but for now I'm just assuming the firs one is the original
	// it also shouldn't work because articleType should be an object but it's a string
	articleType[listOfCitees[0]] = "Original";
	articleType[listOfCitees[1]] = "Replication";
	articleType[listOfCitees[2]] = "Replication2";

	// don't really understand this, but I got it from https://www.w3schools.com/js/js_array_sort.asp
	// it sorts the article array based on uniqueID
	article.sort(function(a, b){
		var x = a.uniqueID.toLowerCase();
		var y = b.uniqueID.toLowerCase();
		if (x < y) {return -1;}
		if (x > y) {return 1;}
		return 0;
	});
	
	// for each article, assign a type (original, replication, or both)
	var i = 0;
	for (i = 0; i < article.length; i++) {
		article[i].type += articleType[article[i].citee];
		if (i > 0 && article[i-1].uniqueID == article[i].uniqueID) {
			article[i-1].type += " & " + articleType[article[i].citee];
			article.splice(i, 1);
			i--;
		}		
	}


	// Figure out how many there are of teach type. 
	var combinedArticleTypes = [];
	var countOfEachType = [];
	for (i = 0; i < article.length; i++) {
		if (countOfEachType[article[i].type] === undefined) {
			countOfEachType[article[i].type] = 0;
			combinedArticleTypes.push(article[i].type);
		}
		countOfEachType[article[i].type]++;
	}
	
	for (i = 0; i < combinedArticleTypes.length; i++) {
		console.log(combinedArticleTypes[i]+" count = "+countOfEachType[combinedArticleTypes[i]]);
	}
	
	buildTableFO();
}

function buildTableFO() {
	var out = "";
	
	document.getElementById('foHeading').innerHTML = fileCounter + ' files imported.';

	// Build Header
	out = "<tr>";
	out += "<th onclick='sortTable(0, "+'"foTable"'+")' title='Click to Sort'>Date</th>";
	out += "<th onclick='sortTable(1, "+'"foTable"'+")' title='Click to Sort'>Notes</th>";
	out += "<th onclick='sortTable(2, "+'"foTable"'+")' title='Click to Sort'>Citee</th>";
	out += "<th onclick='sortTable(3, "+'"foTable"'+")' title='Click to Sort'>Type</th>";
	out += "<th onclick='sortTable(4, "+'"foTable"'+")' title='Click to Sort'>Year</th>";
	out += "<th onclick='sortTable(5, "+'"foTable"'+")' title='Click to Sort'>Cited by</th>";
	out += "</tr>";

	// Build all the other cells.
	for (i = 0; i < article.length; i++) {
		tempType = article[i].type;
		if (tempType.includes("&")) {
			tempType = tempType.replace("&","<br>&<br>")
			tempType = '<td style="text-align: center;" class=cfTableCell_Row_warning>'+tempType+'</td>';
		} else {
			tempType= '<td style="text-align: center;">'+tempType+'</td>';
		}
		out = out + "<tr>";
		out = out + "<td>" + article[i].dateAdded + "</td>";
		out = out + "<td style='color:red'>" + article[i].notes + "</td>";
		out = out + "<td>" + article[i].citee + "</td>";
		out = out + tempType;
		out = out + "<td>" + article[i]["Publication Year"] + "</td>";
		out = out + "<td>" + article[i].uniqueID + "</td>";
		out = out + "</tr>";
	}
	
	// Put everything in the HTML on the page.
	document.getElementById("foTable").innerHTML = "<table>" + out + "</table>";
	// If necessary, add an alert for excluded files. 
	if (excludedReferences.length > 0) {
		var x = document.getElementById("foProblemBox");
		x.style.display = "block";
		document.getElementById("foProblemText").innerHTML = excludedReferences;
	}
}

function buildOutputStringFO() {
	var outString = "";
	
	for (i = 0; i < foOutputArray.length; i++) {
		outString += foOutputArray[i].join("\t") + "\r\n"; // add it to outString. 
	}

	return outString;
}


// ------------------------------------------------------
// here's a random code snippet
    // var json = JSON.parse(data),
	// blob = new Blob([abc], {type: "octet/stream"}),
	
// ------------------------------------------------------
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


// ------------------------------------------------------
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

