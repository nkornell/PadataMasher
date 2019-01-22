//program 1: add to the database
// If I get access to the api, I might not need to make a database. 
// just access the api every time. 
// then again, that wouldn't allow users to check against a known set...
// but I could have a database that's just known sets. 
// In this case, I'd want to build in the ability to run batches 
// (i.e., check out all of the pairs/sets of articles I care about all at once).
// that might be something I just keep for myself. 


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
// 	each page of html should only do one job. I should split these "apps" up
//	or maybe both, but there should be separate outputs. 
// 	and there needs to be a summary output as well. Or maybe only. 

var notesForGoodReferences = "";
var excludedReferences = "";
var fileCounter = 0;
var dbFileName = "Citation_Overlap_Database";
var article = [];
var articleParamNames = [];
var listOfCitees_combined = [];
var foOutput_numerical = "";
var stringBetweenArticles = "-&-";
var reggie = new RegExp(stringBetweenArticles,"g"); // this is a regular expression that can be used to do a replace all


function showFOstuff() {
	var x = document.getElementById("foBigBox");
	x.style.display = "block";
}

function import_FOdatabase() {
	console.log( "import_FOdatabase needs to be written");
	document.getElementById("foTable__heading").innerHTML = fileCounter + ' files imported.';
}

function Article(din, cin, nin, inputArray) {
	this.dateAdded = din;
	this.notes = nin;
	this.citee = cin;
	this.citee_combined = this.citee;
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


function compute_citation_overlap() {
	// right now i'm a assume that whatever's been imported is my stuff. 
	// later I'll have to pull articles in from the database
	
	// it sorts the article array based on year and uniqueID
	// I'm pretty sure it's not necessary, but it makes things look nice.
	article.sort(function(a, b){
		// sort by publication year from newest to oldest
		var ya = a['Publication Year'];
		var yb = b['Publication Year'];
		if (ya > yb) {return -1;}
		if (ya < yb) {return 1;}
		// if the publication years are the same, sort alphabetically a-z
		if (ya == yb) {
			var IDa = a.uniqueID.toLowerCase();
			var IDb = b.uniqueID.toLowerCase();
			if (IDa < IDb) {return -1;}
			if (IDa > IDb) {return 1;}	
		}
		// i guess this means they're identical. this happens for anything that shows up twice or more so I could use it to find duplicates but that would make the code messy and hard to read
		return 0;
	});
	
	// compute min and max year
	var maxYearAll = Math.max.apply(Math,article.map(function(o){return o["Publication Year"];}));
	var minYearAll = Math.min.apply(Math,article.map(function(o){return o["Publication Year"];}));
	
	
	// for each article, if it shows up more than once,
	// -- remove one of them
	// -- figure out it's citee_combined value
	// var i = 0; 
	for (i = 0; i < article.length; i++) {
		if (i > 0 && article[i-1].uniqueID == article[i].uniqueID) { // if the citations are the same
			article[i-1].citee_combined += " " + stringBetweenArticles + " " + article[i].citee;
			article.splice(i, 1);
			i--;
		}
		// This figures out combined article that are used. (e.g., a, b, ab).
		// This only does the ones that are actually used. Should I do possible instead?
		if (listOfCitees_combined.includes(article[i].citee_combined) == false) {
			listOfCitees_combined.push(article[i].citee_combined);
		}
	}

	// Figure out how many instances there are of each type of article in each year. 
	// filter based on year and type, then return the length of the resulting Array
	function selectedObjects(input) {
		return input.citee_combined+" "+input["Publication Year"] == this; // 'this' is the second parameter when this function is called
	}

	// Format results into a tab-delimited string.
	foOutput_numerical = "Article Combination\tEarliest Citation\t";		
	for (y = maxYearAll; y >= minYearAll; y--) {
		foOutput_numerical += y + "\t";
	}

	// actually count up the number of citations. 
	var thingToCheck = "";
	var tempNumCites = "";
	var tempRow = "";
	var tempMinYear = "";
	// var minYear = [];
	foOutput_numerical = foOutput_numerical.trim() + "\r\n";
	for (i = 0; i < listOfCitees_combined.length; i++) {
		foOutput_numerical += listOfCitees_combined[i] + "\t";
		tempRow = "";
		tempMinYear = "never";
		for (y = maxYearAll; y >= minYearAll; y--) {
			thingToCheck = listOfCitees_combined[i]+" "+y;
			tempNumCites = article.filter(selectedObjects,thingToCheck).length; // figure out number of citations
			tempRow += tempNumCites + "\t";
			if (tempNumCites > 0) {
				tempMinYear = y;
			}
		}
		if (listOfCitees_combined[i].includes("-&-") === false) {
		// 	minYear.push({year: tempMinYear, stringToReplace: "tf" + listOfCitees_combined[i]});
			foOutput_numerical += tempMinYear + "\t";
		// 	foOutput_numerical += "tf" + listOfCitees_combined[i] + "\t";
		} else {
			foOutput_numerical += "na\t";
		// 	foOutput_numerical += "na\tna\t";
		}

		foOutput_numerical += tempRow.trim() + "\r\n";
	}
	foOutput_numerical = foOutput_numerical.trim();

	

	// for (i = 0; i < minYear.length; i++) {
		// console.log( Math.min.apply(null, minYear));
	// 	if (minYear[i] == Math.min.apply(Math, minYear)) {
	// 		foOutput_numerical = foOutput_numerical.replace("tf" + listOfCitees_combined[i], "Earliest");
	// 	} else if (minYear[i] == Math.max.apply(Math, minYear)) {
	// 		foOutput_numerical = foOutput_numerical.replace("tf" + listOfCitees_combined[i], "Newest");
	// 	} else {
	// 		foOutput_numerical = foOutput_numerical.replace("tf" + listOfCitees_combined[i], "In between");
	// 	}
	// }
	
	// buildTableFO_listAllCiters();
	buildTableFO_numberOfOverlapsEtc(foOutput_numerical);
}

function buildTableFO_numberOfOverlapsEtc(inString) {
	var out = "";
	var tableName = "foTable_numberOfOverlapsEtc";

	var temp = inString.split(/\r\n|\r|\n/g); // convert input into an array (each element is a row)
	for (i = 0; i < temp.length; i++) {
		out += tabsToHtmlTableRow(temp[i]); // turn the row into html table format
	}

	// if you find the special string that separates articles, make it red.  
	out = out.replace(reggie, "<div style='color:red;'>"+stringBetweenArticles+"</div>");
	
	// put the resulting string in the table.
	var thisTable = document.getElementById(tableName);
	thisTable.innerHTML = "<table>" + out + "</table>";
}

function tabsToHtmlTableRow(inString) {
	// take a string delimited by tabs and turn it into html table material. 
	return "<tr><td>" + inString.replace(/\t/gi, "</td><td>") + "</td></tr>";
}

function buildOutputStringFO() {
	// this is real simple because foOutput_numerical is built to be output from square 1. 
	return foOutput_numerical;
}


function buildTableFO_listAllCiters() {
	var out = "";
	var tableName = "foTable_listAllCiters";

	// Build Header
	out = "<tr>";
	var columnNames = ['Cited By', 'Year', 'Number Cited', 'Article Cited', 'Date Added', 'Notes'];
	for (i = 0; i < columnNames.length; i++) {
		out += "<th onclick='sortTable("+i+", "+'"'+tableName+'"'+")' title='Click to Sort'>"+columnNames[i]+"</th>";
	}
	out += "</tr>";

	// Build all the other cells.
	var tempCombo = "";
	var tempNumCited = "";
	for (i = 0; i < article.length; i++) {
		tempNumCited = article[i].citee_combined.split(stringBetweenArticles).length;
		tempCombo = article[i].citee_combined;
		if (tempCombo.includes(stringBetweenArticles)) {
			tempCombo = tempCombo.replace(reggie,"<br><div style='color:red'>"+stringBetweenArticles+"</div>")
			// tempCombo = '<td style="text-align: center;" class=cfTableCell_Row_warning>'+tempCombo+'</td>';
			out += "<tr class=cfTableCell_Row_warning>";
		} else {
			// tempCombo= '<td style="text-align: center;">'+tempCombo+'</td>';
			out += "<tr>";
		}

		// out = out + "<tr>";
		out = out + "<td>" + article[i].uniqueID + "</td>";
		out = out + "<td>" + article[i]["Publication Year"] + "</td>";
		out = out + "<td>" + tempNumCited + "</td>";
		out = out + "<td>" + tempCombo + "</td>";
		out = out + "<td>" + article[i].dateAdded + "</td>";
		out = out + "<td style='color:red'>" + article[i].notes + "</td>";
		out = out + "</tr>";
	}
	
	// Put everything in the HTML on the page.
	var thisTable = document.getElementById(tableName);
	thisTable.innerHTML = "<table>" + out + "</table>";

	// If necessary, add an alert for excluded files. 
	if (excludedReferences.length > 0) {
		var x = document.getElementById("foProblemBox");
		x.style.display = "block";
		document.getElementById("foProblemText").innerHTML = excludedReferences;
	}
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

// returns duplicates. works, but not using right now and don't understand it. 
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
// call it with
//returnDuplicates(['mike', 'mike', 'may']);