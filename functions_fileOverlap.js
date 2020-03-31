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
var article = [];
var articleParamNames = [];
var listOfCitees_combined = [];
var foOutput_numerical = "";
var stringBetweenArticles = "-&-";
var reggie = new RegExp(stringBetweenArticles,"g"); // this is a regular expression that can be used to do a replace all
var year_zero = 0;
// var first_year_of_all_files = 0;

function showFOstuff() {
	var x = document.getElementById("foBigBox");
	x.style.display = "block";
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

function add_file_to_FOdatabase() {
	// This works with a single file's data. 
	// It assumes that appropriate values are already assigned to inputCell.
	var numRows = inputCell.length;	
	var d = new Date();
	foFileProblems = "";
	var expectedInputArrayLength = 141;
	var tempID = "";
	var tempIDlist = [];
	var fileNameString = inputCell[0][0].substring(6);

	// console.log( "i got called");
	fileCounter++; 

	articleParamNames = inputCell[2]; // dfd for later, check this against expected value

	// Give a warning if the file formatting looks bad. 
	if (inputCell[0][0].substring(0, 6) != "For:  ") {
		foFileProblems = "<p>In <strong>"+fileNameString+":</strong> <i> Expected first row not found. Instead found </i>. <br>"+inputCell[0][0]+ ".\r\n";
	}
	
	for (i = 3; i < numRows; i++) { //  starting with 3 because that's the first citation
		notesForGoodReferences = '';
		if (Math.abs.apply(inputCell[i].length - expectedInputArrayLength) > 1) {
			notesForGoodReferences += "<p><strong>"+fileNameString+"</strong> <i>has " + inputCell[i].length + " columns. "+expectedInputArrayLength+" expected.\r\n";
		}
		
		var temp = new Article(d, inputCell[0][0].substring(6), notesForGoodReferences, inputCell[i]);
		tempID = temp.Title+". ("+temp["Publication Year"]+"). "+temp.Authors+" "+temp["Source Title"]+". DOI:"+temp.DOI;
		if (tempIDlist.indexOf(tempID) == -1) {
			// if it's not a repetition
			article.push(temp);
			article[article.length-1].uniqueID = tempID;
			tempIDlist.push(tempID);
		} else {
			// this seems to happen a lot and i'm not sure why... like it should happen once if there's one repeated line, but it shows up more than once in the output.
			excludedReferences += "<p>In <strong>"+fileNameString+":</strong> <i> Excluded this line because it appeared more than once: </i><br>" + tempID + "\r\n";
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
	

	// if any problems, etc., were found, show them in a box at the bottom. 
	if ((foFileProblems + notesForGoodReferences + excludedReferences).length > 0) {
		document.getElementById("notes_for_user").innerHTML += foFileProblems + notesForGoodReferences + excludedReferences;
		var x = document.getElementById("notes_for_user");
		x.style.display = "block";
	}
}


function compute_citation_overlap() {
	// This function is called by file_importExportContent.js
	
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
	
	var citee_year_count = []; // dfd make global(?) note: should I have made this part of a listOfCitees_combined object instead of its own thing, maybe. 
	
	// Figure out combinations of articles being used. 
	for (i = 0; i < article.length; i++) {
		if (i > 0 && article[i-1].uniqueID == article[i].uniqueID) { 
			// if the citations are the same, remove one of them
			article[i-1].citee_combined += " " + stringBetweenArticles + " " + article[i].citee;
			article.splice(i, 1);
			i--;
		}
	}

	// Figure out how often each one is cited per year.
	for (i = 0; i < article.length; i++) {
		// console.log( "year = " + article[i]["Publication Year"]);
		// Figure out the combinations of citee articles that are used. (e.g., a, b, ab).
		if (listOfCitees_combined.includes(article[i].citee_combined) == false) {
			listOfCitees_combined.push(article[i].citee_combined); // This only does the ones that are actually used. Should I do possible instead?
		}
		if (citee_year_count[article[i].citee_combined] == undefined) {
			citee_year_count[article[i].citee_combined] = [];
		}
		if (citee_year_count[article[i].citee_combined][article[i]["Publication Year"]] == undefined) {
			citee_year_count[article[i].citee_combined][article[i]["Publication Year"]] = 0;
		}
		citee_year_count[article[i].citee_combined][article[i]["Publication Year"]]++; // add 1 to how often each one is cited per year. 
	}

	// Create outputRow (i.e., the number of citation for each row/year). 
	var outputRow = [];
	for (i = 0; i < listOfCitees_combined.length; i++) {
		outputRow.push("");
		for (y = maxYearAll; y >= minYearAll; y--) {
			if (citee_year_count[listOfCitees_combined[i]][y] == undefined) {
				citee_year_count[listOfCitees_combined[i]][y] = 0;
			} else {
				citee_year_count[listOfCitees_combined[i]].firstYear = y; // note this gets modified in the loop that follows
			}
			outputRow[i] += citee_year_count[listOfCitees_combined[i]][y] + "\t";
		}
	}

	// The loop above figures out firstyear. However, it isn't perfect. 
	// For example, if we have A, B, and A&B, and their firstyears are 1977, 2008, and 1979, newest (B) should be 1979, because that's when it was first cited. 
	// The loop above says it's 2008 (the year it was first cited without A). To fix this problem, this loop goes through the whole list
	// and for each item (i), it checks whether any of the other items in the list (all j) include this item (i) in their string. 
	// If they do, it sets firstyear equal to the minimum of the years of the two items. 
	for (i = 0; i < listOfCitees_combined.length; i++) {
		for (j = 0; j < listOfCitees_combined.length; j++) {
			if (listOfCitees_combined[j].includes(listOfCitees_combined[i]) && j != i) {
				citee_year_count[listOfCitees_combined[i]].firstYear = Math.min(citee_year_count[listOfCitees_combined[i]].firstYear, citee_year_count[listOfCitees_combined[j]].firstYear);
			}
		}
	}
	
	
	// Figure out which citee was sorted first, second, etc. 
	var foof = [];
	totalInputArticles = 0;
	for (i = 0; i < listOfCitees_combined.length; i++) {
		if (listOfCitees_combined[i].includes("-&-") == false) {
			foof.push(citee_year_count[listOfCitees_combined[i]].firstYear);
		}
	}
	for (i = 0; i < listOfCitees_combined.length; i++) {
		if (listOfCitees_combined[i].includes("-&-")) {
			citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation = "combo of " + ((listOfCitees_combined[i].match(/-&-/g)||[]).length + 1);
		} else {
			// this happens only for "primary" articles (i.e., without -&-)
			// for each, if its first year is the biggest first year, mark it as newest, same for oldest and the rest are middle
			if (citee_year_count[listOfCitees_combined[i]].firstYear == Math.max.apply(null, foof)) {
				citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation = "newest";
				year_zero = citee_year_count[listOfCitees_combined[i]].firstYear; // set year zero, the year that the most recent one came out. 
			} else if (citee_year_count[listOfCitees_combined[i]].firstYear == Math.min.apply(null, foof)) {
				citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation = "oldest";
				uniqueId_of_oldest = listOfCitees_combined[i];
// 				first_year_of_all_files = = citee_year_count[listOfCitees_combined[i]].firstYear; 
			} else {
				citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation = "middle";
			}
			totalInputArticles++;
		}
	}
	// console.log( citee_year_count.firstYear.sort());
	// don't know why these dont' work
	// console.log( "thing");
	// console.log(citee_year_count.sort((a, b) => (a.firstYear > b.firstYear) ? 1 : -1));
	// console.log( citee_year_count.sort(function(a, b){return a.firstYear-b.firstYear}));
	// console.log( "over");
	// list.sort((a, b) => (a.color > b.color) ? 1 : -1)


	// console.log(  list.sort((a, b) => (a.color > b.color) ? 1 : -1))

	// Figure out total citations since year zero for every citee combination. 
	for (i = 0; i < listOfCitees_combined.length; i++) {
		citee_year_count[listOfCitees_combined[i]].sumAfterYearZero = 0; 
		for (y = year_zero; y <= maxYearAll; y++) {
			citee_year_count[listOfCitees_combined[i]].sumAfterYearZero += citee_year_count[listOfCitees_combined[i]][y];
		}

		citee_year_count[listOfCitees_combined[i]].sumAll = 0; 
		for (y = minYearAll; y <= maxYearAll; y++) {
			citee_year_count[listOfCitees_combined[i]].sumAll += citee_year_count[listOfCitees_combined[i]][y];
		}
// 		console.log(citee_year_count[listOfCitees_combined[i]].sumAll);
	}

	// Create header row for the output in a tab-delimited string.
	foOutput_numerical = "Article(s) Being Cited\tEarliest Citation\tOrder of publication\tNum articles in group\tOldest article\tOldest article's year\tNewest article's year\tTotal\tTotal since newest released\t";
	for (y = maxYearAll; y >= minYearAll; y--) {
		foOutput_numerical += y + "\t";
	}
	foOutput_numerical = foOutput_numerical.trim() + "\r\n";
				

	
	// Add the rest of the data to the output string
	for (i = 0; i < listOfCitees_combined.length; i++) {
		foOutput_numerical += listOfCitees_combined[i]+ "\t";
		foOutput_numerical += citee_year_count[listOfCitees_combined[i]].firstYear +"\t";
		foOutput_numerical += citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation +"\t";
		foOutput_numerical += totalInputArticles +"\t";
		foOutput_numerical += uniqueId_of_oldest +"\t";
		foOutput_numerical += minYearAll +"\t";
		foOutput_numerical += year_zero +"\t";
		foOutput_numerical += citee_year_count[listOfCitees_combined[i]].sumAll+"\t";
		foOutput_numerical += citee_year_count[listOfCitees_combined[i]].sumAfterYearZero +"\t";
		foOutput_numerical += outputRow[i].trim() + "\r\n";
	}
	foOutput_numerical = foOutput_numerical.trim();

	buildTableFO_numberOfOverlapsEtc(foOutput_numerical);
// 	buildTableFO_listAllCiters();

}

function buildTableFO_numberOfOverlapsEtc(inString) {
	var out = "";
	var tableName = "foTable_numberOfOverlapsEtc";

	var temp = inString.split(/\r\n|\r|\n/g); // convert input into an array (each element is a row)
	for (i = 0; i < temp.length; i++) {
		out += tabsToHtmlTableRow(temp[i]); // turn the row into html table format
	}
	out = out.replace('<td>', '<td style="min-width:300px">'); // this makes the first cell (& therefore column) wide, which is good for this particular table

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


// function buildTableFO_listAllCiters() {
// 	// This isn't called anymore. I think it might be for debugging. 
// 	var out = "";
// 	var tableName = "foTable_listAllCiters";
// 
// 	// Build Header
// 	out = "<tr>";
// 	var columnNames = ['Cited By', 'Year', 'Number Cited', 'Article Cited', 'Date Added', 'Notes'];
// 	for (i = 0; i < columnNames.length; i++) {
// 		out += "<th onclick='sortTable("+i+", "+'"'+tableName+'"'+")' title='Click to Sort'>"+columnNames[i]+"</th>";
// 	}
// 	out += "</tr>";
// 
// 	// Build all the other cells.
// 	var tempCombo = "";
// 	var tempNumCited = "";
// 	for (i = 0; i < article.length; i++) {
// 		tempNumCited = article[i].citee_combined.split(stringBetweenArticles).length;
// 		tempCombo = article[i].citee_combined;
// 		if (tempCombo.includes(stringBetweenArticles)) {
// 			tempCombo = tempCombo.replace(reggie,"<br><div style='color:red'>"+stringBetweenArticles+"</div>")
// 			// tempCombo = '<td style="text-align: center;" class=cfTableCell_Row_warning>'+tempCombo+'</td>';
// 			out += "<tr class=cfTableCell_Row_warning>";
// 		} else {
// 			// tempCombo= '<td style="text-align: center;">'+tempCombo+'</td>';
// 			out += "<tr>";
// 		}
// 
// 		// out = out + "<tr>";
// 		out = out + "<td>" + article[i].uniqueID + "</td>";
// 		out = out + "<td>" + article[i]["Publication Year"] + "</td>";
// 		out = out + "<td>" + tempNumCited + "</td>";
// 		out = out + "<td>" + tempCombo + "</td>";
// 		out = out + "<td>" + article[i].dateAdded + "</td>";
// 		out = out + "<td style='color:red'>" + article[i].notes + "</td>";
// 		out = out + "</tr>";
// 	}
// 	
// 	// Put everything in the HTML on the page.
// 	var thisTable = document.getElementById(tableName);
// 	thisTable.innerHTML = "<table>" + out + "</table>";
// 
// 	// If necessary, add an alert for excluded files. 
// 	if (excludedReferences.length > 0) {
// 		var x = document.getElementById("foProblemBox");
// 		x.style.display = "block";
// 		document.getElementById("foProblemText").innerHTML = excludedReferences;
// 	}
// }




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
