// 	it would be cool if you could choose which citees you want to compare
// 		put the originals in one box 
// 		put the replications in another


var notesForGoodReferences = "";
var excludedReferences = "";
var fileCounter = 0;
var reference = [];
var articleParamNames = [];
var listOfCitees_combined = [];
var foOutput = "";
var stringBetweenArticles = "-&-";
var reggie = new RegExp(stringBetweenArticles,"g"); // this is a regular expression that can be used to do a replace all
var year_zero = 3000; // a number greater than the current year
var	total_citations_all = 0;




// new stuff about parsing and looking up a reference //
function json_practice() {
	var urls = [];
	urls.push( 'https://api.crossref.org/works?mailto=nkornell@gmail.com&rows=1&query.bibliographic=Kornell+Son.Terrace');
	urls.push( 'https://api.crossref.org/works?mailto=nkornell@gmail.com&rows=1&query.bibliographic=Kornell+Cantlon+Ferrigno');

//map each url to a getJSON call
// var urls = ["url","url","url"];
var proms = urls.map(url=>$.getJSON(url));

Promise.all(proms).then(function(data){
for (i = 0; i < data.length; i++) {
	console.log('next one');
//     var myObj = JSON.parse(data[i]);
	console.log(data[i]);
	console.log(data[i].message.items[0].title);
}
});





// 	$.when(
// 		$.getJSON(url[0]),
// 		$.getJSON(url[1])
// 	).done(function(rr[0],rr[1]) {
// 		console.log(rr[0][0].message.title);
// 		console.log(rr[1]);
// 	});
}
// end of new stuff about parsing and looking up a reference //




function showFOstuff() {
	var x = document.getElementById("foBigBox");
	x.style.display = "block";
	json_practice();
}

function Reference(din, cin, nin, inputArray) {
	this.dateAdded = din;
	this.notes = nin;
	this.citee = cin;
	this.citee_combined = this.citee;
	this.uniqueID = "";
	var i = 0;
	for (i = 0; i < inputArray.length; i++ ) {
		this[articleParamNames[i]] = inputArray[i]; // the result of doing this is, for example, reference.DOI = 10.1016/j.jesp.2015.09.017 (this example pretends reference isn't an array). i don't know why it's not reference[DOI] but I guess it's reference.DOI instead for some reason
// 		console.log( 'apn='+articleParamNames[i]+', inputArray='+ inputArray[i]);
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

	fileCounter++; 

	articleParamNames = inputCell[2]; // i'm not bothering to check this against expected value but it could be a good idea in case some files were to come out of WOS with a different format

	// Give a warning if the file formatting looks bad. 
	if (inputCell[0][0].substring(0, 6) != "For:  ") {
		foFileProblems = "<p>In <strong>"+fileNameString+":</strong> <i> Expected first row not found. Instead found </i>. <br>"+inputCell[0][0]+ ".\r\n";
	}
	
	for (i = 3; i < numRows; i++) { //  starting with 3 because that's the first citation
		notesForGoodReferences = '';
		if (Math.abs.apply(inputCell[i].length - expectedInputArrayLength) > 1) {
			notesForGoodReferences += "<p><strong>"+fileNameString+"</strong> <i>has " + inputCell[i].length + " columns. "+expectedInputArrayLength+" expected.\r\n";
		}
		
		var temp = new Reference(d, inputCell[0][0].substring(6), notesForGoodReferences, inputCell[i]);
		tempID = temp.Title+". ("+temp["Publication Year"]+"). "+temp.Authors+" "+temp["Source Title"]+". DOI:"+temp.DOI;
		if (tempIDlist.indexOf(tempID) > -1) {
			// if it's a repetition
			// this seems to happen a lot and i'm not sure why... like it should happen once if there's one repeated line, but it shows up more than once in the output.
			excludedReferences += "<p><strong>Repeated line</strong> in <i>"+fileNameString+"</i> excluded the line <i>" + tempID + "</i><br>\r\n";
		} else {
			// if it's not a repetition
			tempIDlist.push(tempID);
			if (temp["Publication Year"] > 2019) { // dfd this excludes all 2020 citaitons	
				excludedReferences += "<p><strong>Excluded because year = " + temp["Publication Year"] +"</strong>. In file <i>"+fileNameString+"</i>, excluded the line <i>" + tempID + "</i><br>\r\n";
			} else {
				reference.push(temp);
				reference[reference.length-1].uniqueID = tempID;
			}
		}
	}

	// if any problems, etc., were found, show them in a box at the bottom. 
	if ((foFileProblems + notesForGoodReferences + excludedReferences).length > 0) {
		document.getElementById("notes_for_user").innerHTML = foFileProblems + notesForGoodReferences + excludedReferences;
		var x = document.getElementById("notes_for_user");
		x.style.display = "block";
	}
}


function compute_citation_overlap() {
	// This function is called by file_importExportContent.js
	
	// it sorts the reference array based on year and uniqueID
	// I'm pretty sure it's not necessary, but it makes things look nice.
	reference.sort(function(a, b){
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
	var maxYearAll = Math.max.apply(Math,reference.map(function(o){return o["Publication Year"];}));
	var minYearAll = Math.min.apply(Math,reference.map(function(o){return o["Publication Year"];}));
	
	var citee_year_count = []; // should i make this global? should I have made this part of a listOfCitees_combined object instead of its own thing? maybe. 
	
	// if two references are the same, remove one of them 
	for (i = 0; i < reference.length; i++) {
		if (i > 0 && reference[i-1].uniqueID == reference[i].uniqueID) { 
			reference[i-1].citee_combined += " " + stringBetweenArticles + " " + reference[i].citee;
			reference.splice(i, 1);
			i--;
		}
	}

	// Figure out how often each one is cited per year.
	for (i = 0; i < reference.length; i++) {
		// console.log( "year = " + reference[i]["Publication Year"]);
		// Figure out the combinations of citee references that are used. (e.g., a, b, ab).
		if (listOfCitees_combined.includes(reference[i].citee_combined) == false) {
			listOfCitees_combined.push(reference[i].citee_combined); // This only does the ones that are actually used. Should I do possible instead?
		}
		if (citee_year_count[reference[i].citee_combined] == undefined) {
			citee_year_count[reference[i].citee_combined] = [];
		}
		if (citee_year_count[reference[i].citee_combined][reference[i]["Publication Year"]] == undefined) {
			citee_year_count[reference[i].citee_combined][reference[i]["Publication Year"]] = 0;
		}
		citee_year_count[reference[i].citee_combined][reference[i]["Publication Year"]]++; // add 1 to how often each one is cited per year. 
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
// 			console.log( outputRow[i]);
		}
	}

	// The loop above figures out firstyear. However, it isn't perfect. 
	// For example, if we have A, B, and A&B, and their firstyears are 1977, 2008, and 1979, newest (B) should 
	// be 1979, because that's when it was first cited. 
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
				year_zero = Math.min(year_zero, citee_year_count[listOfCitees_combined[i]].firstYear); // set year zero, the year that the first one other than the og came out. 
			} else if (citee_year_count[listOfCitees_combined[i]].firstYear == Math.min.apply(null, foof)) {
				citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation = "oldest";
				uniqueId_of_oldest = listOfCitees_combined[i];
			} else {
				citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation = "middle";
				year_zero = Math.min(year_zero, citee_year_count[listOfCitees_combined[i]].firstYear); // set year zero, the year that the first one other than the og came out. 
			}
		}
	}

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
		total_citations_all += citee_year_count[listOfCitees_combined[i]].sumAll;
	}


//---------
// note: this is from back when I had each year in a column. I got rid of this and replaced it with the stuff below
// when I decided to put each year in its own row. So this stuff can be deleted.

// 	Create header row for the output in a tab-delimited string.
// 	foOutput = "Article(s) Being Cited\tEarliest Citation\tOrder of publication\tNum articles in group\tOldest article\tOldest article's year\tNewest article's year\tTotal\tTotal since newest released\t";
// 	for (y = maxYearAll; y >= minYearAll; y--) {
// 		foOutput += y + "\t";
// 	}
// 	foOutput = foOutput.trim() + "\r\n";
// 	
// 	Add the rest of the data to the output string
// 	for (i = 0; i < listOfCitees_combined.length; i++) {
// 		foOutput += listOfCitees_combined[i]+ "\t";
// 		foOutput += citee_year_count[listOfCitees_combined[i]].firstYear +"\t";
// 		foOutput += citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation +"\t";
// 		foOutput += totalCitees +"\t";
// 		foOutput += uniqueId_of_oldest +"\t";
// 		foOutput += minYearAll +"\t";
// 		foOutput += year_zero +"\t";
// 		foOutput += citee_year_count[listOfCitees_combined[i]].sumAll+"\t";
// 		foOutput += citee_year_count[listOfCitees_combined[i]].sumAfterYearZero +"\t";
// 		foOutput += outputRow[i].trim() + "\r\n";
// 	}
// 	foOutput = foOutput.trim();
//---------

//---------
	// Create header row for the output in a tab-delimited string.
	foOutput = "Article(s) Being Cited\tEarliest Citation\tOrder of publication\tNum files imported\tOldest article\tOldest article's year\tFirst replication year\tTotal years before\tTotal years after\tBefore or after\tYear\t\Year from zero\tCitations\tCitation %\r\n";
	
	// Add the rest of the data to the output string
	for (i = 0; i < listOfCitees_combined.length; i++) {
		for (y = maxYearAll; y >= minYearAll; y--) {
			foOutput += listOfCitees_combined[i]+ "\t";
			foOutput += citee_year_count[listOfCitees_combined[i]].firstYear +"\t";
			foOutput += citee_year_count[listOfCitees_combined[i]].orderOfFirstCitation +"\t";
			foOutput += fileCounter +"\t";
			foOutput += uniqueId_of_oldest +"\t";
			foOutput += minYearAll +"\t";
			foOutput += year_zero +"\t";
			foOutput += year_zero - minYearAll +"\t";
			foOutput += maxYearAll - year_zero + 1 +"\t";
			if (y - year_zero < 0) {
				foOutput += "Before\t";
			} else {
				foOutput += "After\t";			
			}
			foOutput += y + "\t";
			foOutput += y - year_zero + "\t";
			foOutput += citee_year_count[listOfCitees_combined[i]][y] + "\t";
			foOutput += 100*citee_year_count[listOfCitees_combined[i]][y]/total_citations_all;
			foOutput += "\r\n";
		}
	}
	foOutput = foOutput.trim();
//---------

	buildTableFO_numberOfOverlapsEtc(foOutput);

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
	// this is real simple because foOutput is built to be output from square 1. 
	return foOutput;
}