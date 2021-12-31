// To do: 
// To check whether the within values it returns are actually correct, try three things:
// 	1) when there is a within variable with multiple levels (try 2 and 3); 
// 	2) when there is a within variable, but the values are all the same. !!!!
// 	3) when no within variable is selected.
// 
// Check whether reseting of (output-relevant) variables when they press compute is working
// 
// 
// --Remove redundant calculation--
// 1. when a function is selected, it is redundant to compute levels or recompute the other functions
// 2. when a setting is changed it is redundant to compute levels or sets of values
// 3. regardless of what's pressed, some things are computed multiple times. e.g., sum gets computed by sum, mean, stdDev. 
// 
// --Functionality--
// Add mode as a checkbox, since I already wrote the function.
// 
// --Editing and Saving--
// When they make a graph, have a function to save it as a picture. 
// Allow users to save their analysis? I'd create my own datafile format and they could download it. It'd have the data plus instructions on which variables were selected.
// Make the data editable. Allow them to save the edited data.
// Make it possible to include/exclude rows. 
// Maybe even have filtering to include/exclude.
// Basically, make it do what Statview did. 
// 
// -- interface --
// Highlight rows that are being used (maybe their text?) in a color corresponding to their use (e.g., dv)? 
// Have the little "info" icon show up only when you're hovering over that row. And make row hover highlight that row, like in dropbox. 
// Instead of showing list of variables where you select a type, show a  list of types and let them select variables. 
// -- (i.e., to save space format it like a pivot table instead of like statview). 



function showMCstuff() {
	var x = document.getElementById("mcBigBox");
	x.style.display = "flex";
}

function changeOfVariableSelections(varNum,useAs) {
	var i = 0;
	
// 	console.log( "changeOfVariableSelections varnum="+varNum+" useAs="+useAs);

	// If the radio button they pressed is already selected, make it change to Not Using. 		
// 		if (howEachVariableIsUsed[varNum] == useAs) {
// 			if (useAs != "") {
// 				// If it's not already on Not Using, simulate a click of Not Using and then return. 
// 				document.getElementById("Not Using " + varNum).click(); //.checked = true; //.style.backgroundColor = "#8df"; //
// 				return;
// 			}
// 		}
	
	howEachVariableIsUsed[varNum] = useAs;
	
	dependentVariableColumnsSelected = [];
	betweenColumnsSelected = [];
	withinColumnsSelected = [];
	
	for (i = 0; i < howEachVariableIsUsed.length; i++) {
		switch(howEachVariableIsUsed[i]) {
			case "Within":
				withinColumnsSelected.push(i);
				break;
			case "Between":
				betweenColumnsSelected.push(i);
				break;
			case "Dependent":
				dependentVariableColumnsSelected.push(i);
				break;
			default:
		}
	}		
	computeResults();
}


function computeResults() {
	var functionsCalled = 0;
	
	computeBetweenLevels(false);
	computeWithinLevels();
	computeSetsOfValues();

	if (document.getElementById("checkboxCount").checked == true) {
		computeFunctionOutput(Count);
		functionsCalled++;
	}
	if (document.getElementById("checkboxSum").checked == true) {
		computeFunctionOutput(Sum);
		functionsCalled++;
	}
	if (document.getElementById("checkboxMean").checked == true) {
		computeFunctionOutput(Mean);
		functionsCalled++;
	}
	if (document.getElementById("checkboxMedian").checked == true) {
		computeFunctionOutput(Median);
		functionsCalled++;
	}
	if (document.getElementById("checkboxStdDev").checked == true) {
		computeFunctionOutput(StdDev);
		functionsCalled++;
	}
	if (document.getElementById("checkboxPearson").checked == true) {
		computeFunctionOutput(Pearson);
		functionsCalled++;
	}
	if (document.getElementById("checkboxGamma").checked == true) {
		computeFunctionOutput(Gamma);
		functionsCalled++;
	}
	if (document.getElementById("checkboxPairwiseCount").checked == true) {
		computeFunctionOutput(PairwiseCount);
		functionsCalled++;
	}
	if (functionsCalled == 0) {
		computeFunctionOutput(computeNothing);
	}

	buildTablePTP("result");
	hideFileSelectorStuff();
	showMCstuff();
}	


function buildVariableSelectorTable() {
	var i = 0;
	
	// Figure out between levels for each column, to compute toolTips
	for (i = 0; i < inputCell[0].length; i++) {
		betweenColumnsSelected = [];
		betweenColumnsSelected.push(i);
		computeBetweenLevels(true);
	}
	betweenColumnsSelected = [];

	// Build Header
	var out = "";
	out = out + "<div><table><form>";
	
	// Build row labels and popup menus.
	for (i = 0; i < inputCell[0].length; i++) {
		out = out + "<tr><td>" + inputCell[0][i] + " </td>";
		out = out + "<td><select id='"+i+"' name='"+i+"' onchange='changeOfVariableSelections(this.name,this.value)'>";
		out = out + "<option value='Not Using'>---</option>";
		out = out + "<option value='Dependent'>Dependent</option>";
		out = out + "<option value='Between'>Between</option>";
		out = out + "<option value='Within'>Within</option></select> ";
// 		out = out + "<div class='tooltip'>info<span class='tooltiptext'>"+ toolTipContent[i] + "</span></div>"; dfd: the tooltip thing is really cool, and it works, but I just decided it was too complicated and I wanted this product to be simple. 


		out = out + "</td></tr>";
	}
	out = out + "</form></table></div>";

	// Show the table
	document.getElementById("tableVariableSelector").innerHTML = out;
}


function computeBetweenLevels(remember) {
	// This function takes an array listing the columns that have been selected and returns an array listing all observed levels.
	// When multiple columns are selected it concatenates them with tabs in between. 
	var tempBnArray = [];
	var tempBn = "";
	var i = 0;
	
	// Go through all rows and identify each unique level combinations
	for (i = 0; i < inputCell.length; i++) {
		tempBn = concatenateLevelsFromThisRow(i,betweenColumnsSelected);
		
		if (tempBnArray.indexOf(tempBn) == -1) { // it's identified a novel unique between-level combination
			tempBnArray.push(tempBn);
		}
	}
	if (betweenColumnsSelected.length == 1 && remember == true) {
		// if it's during setup, set the tooltips
		var first = tempBnArray.shift(); // get rid of the first element, which is the column name
		
		numLevels[betweenColumnsSelected] = tempBnArray.length;

		var ttcString = "<u>Unique values (" + numLevels[betweenColumnsSelected] + ")</u><br>";
		for (i = 0; i < tempBnArray.length; i++) {
			ttcString += tempBnArray[i] + "<br>";
			// show a maximum of 8 rows in the tooltips
			if (i == 7 && tempBnArray.length > 9) {
				ttcString += "<i>(etc...)</i>";
				break;
			}
		}		
			
		toolTipContent[betweenColumnsSelected] = ttcString;
	} else {
		// if it's a real analysis, set allBetweenLevelValues.
		if (tempBnArray.length < 2) {
			if (tempBnArray.length != 1) {console.log("tempBnArray.length != 1 AND THAT IS BAD NEWSSSSSSSSS");}
			if (tempBnArray != "") {
				console.log("To do: make it alert the user that the bn variable has only one level");
			} else {
				allBetweenLevelValues = ["no\tbetween\tlevels"];
			}
		} else {
			allBetweenLevelValues = tempBnArray;
		}
	}
}


function computeWithinLevels() {
	// This function takes an array listing the columns that have been selected and returns an array listing all observed levels.
	// When multiple columns are selected it concatenates them with tabs in between. 
	var tempWnArray = [];
	var tempWn = "";
	var i = 0;
	
	// Go through all rows and identify each unique level combinations
	for (i = 0; i < inputCell.length; i++) {
		tempWn = concatenateLevelsFromThisRow(i,withinColumnsSelected);
		if (tempWnArray.indexOf(tempWn) == -1) { // it's identified a novel unique within-level combination
			tempWnArray.push(tempWn); // with no wn levels, this will = ""
		}
	}

	if (tempWnArray.length < 2) {
		// If the number of within levels is 1, or there aren't any, make allWithinLevels empty.
		if (tempWnArray.length != 1) {console.log("tempWnArray.length != 1 AND THAT IS BAD NNNNNNNNEWSSSSS");}

		if (tempWnArray.length == 1 && tempWnArray != "") {
			// Not sure if this even gets called appropriately, but when I've made it so it does, 
			// make it so it actually sends and alert instead of just telling the console thingy.
			console.log("To do: make it alert the user that the wn variable has only one level");
		} else {
			allWithinLevelValues = ["no\twithin\tlevels"];
		}
	} else {
		allWithinLevelValues = tempWnArray;
	}
}


// Returns the numerical position (i.e., index) of the selected values of a given row in tempAllLevelsArray (the latter can be WN or BN).
function indexOfThisLevel(tempAllLevelsArray, rowNum, colsSelected) {
	if (tempAllLevelsArray == "no\twithin\tlevels") {
		return 0;
	} else if (tempAllLevelsArray == "no\tbetween\tlevels") {
		return 1;
	} else {
		return tempAllLevelsArray.indexOf(concatenateLevelsFromThisRow(rowNum,colsSelected));
	}
}

function computeSetsOfValues() {
// 		console.log("Computing setsOfValues");

	var row = 0;
	var dv = 0;
	var bv = 0; // between value
	var wv = 0; // within value
	var i = 0;
	var k = 0;
	var val = 0;
	
	outputCell = [];
	setsOfValues = [];
	
	// Figure out the values and add them to outputCell. 
	for (i = 0; i < dependentVariableColumnsSelected.length; i++) { // For each DV
		dv = dependentVariableColumnsSelected[i];

		// Add each numerical value to setOfValues
		for (row = 1; row < inputCell.length; row++) { // start at 1 because 0 is the column names
			bv = indexOfThisLevel(allBetweenLevelValues, row, betweenColumnsSelected);
			wv = indexOfThisLevel(allWithinLevelValues, row, withinColumnsSelected); // will be 0 when there aren't 
			val = inputCell[row][dv];
			if (val == "") { val = "Empty"; } // This is just used so that Number(val) returns nan
			
			// If the setsOfValues you're interested in pushing into is undefined, then define it.
			if (setsOfValues[dv] === undefined) {setsOfValues[dv] = [];} 
			if (setsOfValues[dv][bv] === undefined) {setsOfValues[dv][bv] = [];}
			if (setsOfValues[dv][bv][wv] === undefined) {setsOfValues[dv][bv][wv] = [];}
// 				if (setsOfValues[dv][bv][wv] === undefined) {setsOfValues[dv][bv][wv] = [];}
			
			setsOfValues[dv][bv][wv].push(Number(val)); // convert type to number and add it to the list
		}
	} // end of loop for DV
// 		console.log(setsOfValues);
// 		console.log("setsOfValues sez: that was sets of values, just above there.");		
}

function computeFunctionOutput(theFunction) {
	var i = 0;
	var j = 0;
	var dv = 0;
	var dv2 = 0;
	var bvTemp = 0;
	var wvTemp = 0;
	var computingDVsInPairs = false;
	var functionNickname = theFunction.name;
	var loopsToDo = dependentVariableColumnsSelected.length;
	var bvLoops = 0;
	var withinString = "";
	var dependentString = "";
	var localColumnNames = [];
	
	if (functionNickname == "computeNothing") {
		functionNickname = "";
	} else if (functionNickname == "Pearson") {
		functionNickname = "Pearson Correlation";
	} else if (functionNickname == "Gamma") {
		functionNickname = "Gamma Correlation";
	} else if (functionNickname == "PairwiseCount") {
		functionNickname = "Count (pairwise)";
	}
	
	if ((functionNickname == "Pearson Correlation" || functionNickname == "Gamma Correlation" || functionNickname == "Count (pairwise)") && dependentVariableColumnsSelected.length > 1) {
		computingDVsInPairs = true;
		loopsToDo = loopsToDo - 1;
	}

// 		console.log("Computing " + functionNickname + " for " + inputCell[0][dv]);
	
	if (loopsToDo == 0) {
		dependentString = "???"; // there is no DV yet
		localColumnNames = "";
	}

	if (allBetweenLevelValues == "no\tbetween\tlevels") {
		bvLoops = 2;
	} else {
		bvLoops = allBetweenLevelValues.length;
	}

	
	// For each setOfValues, compute the appropriate function and add the result to outputCell.
	for (bvTemp = 0; bvTemp < bvLoops; bvTemp++) {
		// If this row of outputCell is undefined, initialize and add the between values to the start of it. 
		if (outputCell[bvTemp] === undefined) { 
			outputCell[bvTemp] = []; 
			if (allBetweenLevelValues == "no\tbetween\tlevels") {
				outputCell[bvTemp].push("");
			} else {
				convertTabsToArrayMembers(outputCell[bvTemp], allBetweenLevelValues[bvTemp]);
			}

		}
		
		// Compute the value and add it to outputCell.
		for (i = 0; i < loopsToDo; i++) { // For each DV
			dv = dependentVariableColumnsSelected[i];
			j = i + 1;
			while (j < loopsToDo + 1) {
				dv2 = dependentVariableColumnsSelected[j]; // this will be undefined if not doing multiple loops but since it doesn't get used, who cares. 

				// Figure out dependentString for column names
				if (bvTemp == 0) {
					if (computingDVsInPairs == true) {
						dependentString = inputCell[0][dv] + " X " + inputCell[0][dv2];
					} else {
						dependentString = inputCell[0][dv];
					}						
				}
				
				for (wvTemp = 0; wvTemp < allWithinLevelValues.length; wvTemp++) {
					if (wvTemp==0 && allWithinLevelValues.length > 1) { 
						// wvTemp==0 is the column header row. If we're looking at that, don't record the mean (i.e., do nothing).
						// The exception is when there's one within level value; then this if statement returns false and the mean does get recorded (below).
					}
					else if (bvTemp == 0) {
						// If it's the first row, figure out the column names for within values, and then add a string to localColumnNames.
						if (allWithinLevelValues == "no\twithin\tlevels") {
							withinString = "";
						} else {
							if (document.getElementById("checkboxVerboseColumnNames").checked == true) {
							
								var verboseLabelArray = allWithinLevelValues[0].split("\t");
								var verboseLevelArray = allWithinLevelValues[wvTemp].split("\t");
								// console.log(verboseLabelArray);
								var verboseTempString = "";

								for (verboseTemp = 0; verboseTemp < verboseLabelArray.length; verboseTemp++) {
									if (verboseTempString != "") { 
										verboseTempString += "<br>";
									}
									verboseTempString += "[" + verboseLabelArray[verboseTemp] + "=" + verboseLevelArray[verboseTemp] + "]";
								}
								withinString = "<br>" + verboseTempString;
							} else {
								withinString = "<br>[" + allWithinLevelValues[wvTemp].replace(/\t/gi, "]<br>[") + "]";
							}
						}
						localColumnNames.push(functionNickname + "<br>" + dependentString + withinString);
					}
					else if (setsOfValues[dv][bvTemp] === undefined || setsOfValues[dv][bvTemp][wvTemp] === undefined) {
						// If there's nothing there, don't compute anything.
						outputCell[bvTemp].push("NoData"); 
					} 
					else if (computingDVsInPairs == true && (setsOfValues[dv2][bvTemp] === undefined || setsOfValues[dv2][bvTemp][wvTemp] === undefined)) {
						// If it's a pair of dvs, and there's nothing there in the next one, don't compute anything.
						outputCell[bvTemp].push("NoData"); 					
					}
					else {
						// Call theFunction (a parameter passed to here) on setOfValues, and record the outcome. 
						if (computingDVsInPairs == true) {
							outputCell[bvTemp].push(theFunction(setsOfValues[dv][bvTemp][wvTemp], setsOfValues[dv2][bvTemp][wvTemp]));
						} else {
							outputCell[bvTemp].push(theFunction(setsOfValues[dv][bvTemp][wvTemp]));
						}
					}
				}
				j++;
				if (computingDVsInPairs == false) { j = loopsToDo + 1000;} // if not doing it in pairs, exit the while after the first trip through
			}
		}
	}
	for (i = 0; i < localColumnNames.length; i++) {
		outputCell[0].push(localColumnNames[i]);
	}		
}



function concatenateLevelsFromThisRow(rowNum,colsSelected) {
	// Tell this function the row you're looking at and which columns are selected. 
	// It tells you what the (concatenated) levels are for that row. 
	var temp = "";
	var i = 0;

	for (i = 0; i < colsSelected.length; i++) {
		temp = temp + inputCell[rowNum][colsSelected[i]]+"\t"; // This tab is used internally by the program, but it also gets output (currently)
	}
	return temp.trim();
}

function buildOutputStringPTP() {
	var outString = "";
	if (outputCell[0] === undefined) {
		outString += "No Output Data Available";
	} else {
		outputCell.forEach(function(rowArray){
		   let row = rowArray.join(fileDelimiterArray[0]);
			if (outString == "") { // if it's the column names, get rid of every <br>
				row = row.replace(/<br>/g," ");
			}
		   outString += row + "\r\n";
		}); 
		outString = outString.replace(/no\twithin\tlevels/g,"");
	}
	return outString;
}

function buildTablePTP(typ) {
	var out = "";
	if (typ == "input") {
		var tempCell = inputCell;
		var alertElementName = "inputAlerts";
		var tableID = "inputTable";

	} else {
		var tempCell = outputCell;
		var alertElementName = "resultAlerts";
		var tableID = "outputTable";
	}
	
	if (tempCell[0] === undefined) { // I don't think this ever happens, but just in case
		out = "nothing here";
		console.log("nothing here");
	} else if (tempCell[0].join() == "") { // no columns have been selected
		// Hide results preview
		var x = document.getElementById("mcBigBox2");
		if (x.style.display != "none") {
			x.style.display = "none";
		}
		out = "<div style='height: 200px; display: flex; align-items: center; justify-content: center; text-align:center; font-size: 150%; font-weight: bold; color: #aaa '>select variables and analyses</div>"; // note, this works, but it's not being used because i made this thing disappear instead
	} else {
		// Show results preview
		var x = document.getElementById("mcBigBox2");
		if (x.style.display != "inline") {
			x.style.display = "inline";
		}

		// Build Header
		out = "<tr>";
		for (i = 0; i < tempCell[0].length; i++) {
			out += "<th onclick='sortTable("+i+", "+'"'+tableID+'",'+'"letters"'+")' title='Click to Sort'><div id='" + typ + "," + tempCell[0][i] + "'>" + tempCell[0][i] + "</div></th>";
		}
		// note, above, it sorts everything as letters. Ideally it would check whether the column is letters or numbers and sort accordingly. 

		out = out + "</tr>";
		out = out.replace(/no\twithin\tlevels/g,"");

		// Figure out how many rows to show.
		var maxRowsToShow = 200;
		var rowsToShow = Math.min(maxRowsToShow, tempCell.length);
					
		if (tempCell.length > maxRowsToShow) {
			var alertToShow = "Showing first " + maxRowsToShow + " rows (of " + tempCell.length + ").";
			document.getElementById(alertElementName).innerHTML = alertToShow;
			var x = document.getElementById(alertElementName);
			x.style.display = "inline-block";
		} else {
			var x = document.getElementById(alertElementName);
			x.style.display = "none";
		}
		


		// Build Data
		for (i = 1; i < rowsToShow; i++) {
			out = out + "<tr>";
			for (k = 0; k < tempCell[i].length; k++) {
				if (tempCell[i][k] === undefined) {
					out = out + "<td></td>";
					console.log("This happened!!!!!!!!!!! Programer person, you need to take a peek.");
					tempCell[i][k] = ""; // not sure this happens but if it does I need to fix it by setting the variable to "" (but note this is the temp version, not the real variable)
				} else {				
					out = out + "<td>" + tempCell[i][k] + "</td>";
				}
			}
			out = out + "</tr>";
		}
	}
	
	// Show the table
	document.getElementById(tableID).innerHTML = "<table>" + out + "</table>";
}