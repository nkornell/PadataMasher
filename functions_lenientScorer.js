var column_data = []
var maximum_num_checkboxes = 9;

// dfd it doesn't work when two columns have the same name. 
// change it so it's indexed by the column number, not the name

function column_data_object(input_name, input_values) { 
	// this is an object that represents a column of data
	this.column_name = input_name;
	
	this.level_text = []
	this.level_num_observations = []
	this.sorted_array = []
	this.array_of_selected_items = []

	this.compute_levels = function(input_search_status) {
		// figure out what different values are in the column, and how many times each one apears
		var i = 0;
		var tempLevel = '';
		
		for (i = 0; i < input_values.length; i++) {
			tempLevel = input_values[i];

			if (this.level_text.indexOf(tempLevel) == -1) { // it's identified a novel unique between-level combination
				this.level_text.push(tempLevel);
				this.level_num_observations[tempLevel] = 1;
			} else {
				this.level_num_observations[tempLevel]++
			}
		}
		
		for (i = 0; i < this.level_text.length; i++) {
			this.sorted_array.push([this.level_text[i], this.level_num_observations[this.level_text[i]]])
		}
		
		this.sorted_array.sort(function(a, b) {
		    return b[1] - a[1]; // because it's b then a, it sorts descending
		});
	}
	
	this.binary_array = function() {
		// This returns an array with a value of 1 or 0 for each item in the column. 
		// It's a 1 if the item is in the list of checked items and 0 if it's not. 
		var out = [];
		out.push('score_'+this.column_name)
// 		console.log( this.column_name+" "+input_values.length)
		for (i = 0; i < input_values.length; i++) {
			if (this.array_of_selected_items.indexOf(input_values[i]) > -1) {
				out.push('1')
			} else if (input_values[i].length == 0) {
				out.push('na')
			} else {
				out.push('0')
			}
		}
		return out
	}
}

function showLSstuff() {
	var x = document.getElementById("lsBigBox");
	x.style.display = "flex";
}

function computeLevels(colNum) {
	// Return an array listing all observed levels of the requested colNum.
	
	var i = 0;
	var data_values = [];
	for (i = 0; i < inputCell.length; i++) {
// 		console.log( inputCell.length)
		if (inputCell[i][colNum]  !== undefined && inputCell[i][colNum] !== null) {
			data_values.push(inputCell[i][colNum])
		} else
			data_values.push('')
	}

	var columnName = data_values.shift(); // get rid of the first element, which is the column name
	column_data[colNum] = new column_data_object(columnName, data_values)
	column_data[colNum].compute_levels()
}

function buildVariableSelectorTable_lenientScorer() {
	var i = 0;
	
	for (i = 0; i < inputCell[0].length; i++) { 
		computeLevels(i);
	}

	// Build Header
	var tempColName = '';
	var tempItemValue = '';
	var out = "";
	out = out + "<div><table><tr><form>";
	// Build column names and checkboxes.
	for (i = 0; i < inputCell[0].length; i++) {
		tempColName = inputCell[0][i];
		out = out + "<td style='vertical-align: top; min-width: 8em'><b>" + tempColName + "</b><br>";
		for (j = 0; j < column_data[i].level_text.length; j++) {
			tempItemValue = column_data[i].sorted_array[j][0];
			if (tempItemValue !== undefined && tempItemValue !== null) {
				if (tempItemValue.length > 0) {
					tempID = i+'*'+j;
					out = out + '<input type="checkbox" name="'+i+'" id="'+tempID+'" onchange="boxClicked(this.id)" ><label for="'+tempID+'">'+tempItemValue+'</label><br>'
				}
			} else {
				console.log( 'null: tempid = '+tempID+' tempcolnam='+tempColName+' tempItemValue='+tempItemValue)
			}
			if (j >= maximum_num_checkboxes-1) {break;} // this means it never gives you more than x options
		}
		out = out + "</td>";
	}
	out = out + "</form></tr></table></div>";

	// Show the table
	document.getElementById("tableVariableSelector").innerHTML = out;
	
	hideFileSelectorStuff();
	showLSstuff();
}

function boxClicked(element_id) {
	// when a checkbox is clicked, update the column_data object so it knows what's selected.
	var ij = element_id.split('*')
	var tempColumnNum = ij[0]
	var tempItemValue = column_data[tempColumnNum].sorted_array[ij[1]][0]

	if (document.getElementById(element_id).checked) {
 		// if the element was just checked
		column_data[tempColumnNum].array_of_selected_items.push(tempItemValue)
	} else {
		// if the element has just been unchecked
		const index = column_data[tempColumnNum].array_of_selected_items;
		column_data[tempColumnNum].array_of_selected_items.splice(index, 1);
	}
}

function buildOutputStringLenientScorer() {
	// have the column_data objects compute their scores (the objects already know what boxes are checked)
	// and then turn that into an output string.
	var i = 0;
	var out = "";
	var out_array = [];
	
	for (i = 0; i < inputCell[0].length; i++) {
		// have each column_data object compute it's binary_array, which is the 0 or 1 scoring of each response
		// then add the resulting array to the variable out_array. 
		if (column_data[i].array_of_selected_items.length > 0) { // if at least one thing is selected in the column, score it
			out_array.push(column_data[i].binary_array())
		}
	}

	// take out_array and turn it into a tab-delimited string 
	// Out array is an array where each element is a binary array for a column. 
	if (out_array.length < 1) {
		return "No Output Data Available";
	} else {
		for (i = 0; i < out_array[0].length; i++) {
			for (j = 0; j < out_array.length; j++) {
				out += out_array[j][i]+'\t'
			}
			out += '\r\n'
		}
		return out;
	}
}
