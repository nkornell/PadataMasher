var column_data = []
var maximum_num_checkboxes = 9;

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
		for (i = 0; i < input_values.length; i++) {
			if (this.array_of_selected_items.indexOf(input_values[i]) > -1) {
				out.push('1')
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
		for (j = 0; j < column_data[tempColName].level_text.length; j++) {
			tempItemValue = column_data[tempColName].sorted_array[j][0];
			tempID = i+'*'+j;
			out = out + '<input type="checkbox" id="'+tempID+'"><label for="'+tempID+'">'+tempItemValue+'</label><br>'
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


function computeLevels(colNum) {
	// Return an array listing all observed levels of the requested colNum.
	
	var i = 0;
	var data_values = [];
	for (i = 0; i < inputCell.length; i++) {
		data_values.push(inputCell[i][colNum])
	}

	var columnName = data_values.shift(); // get rid of the first element, which is the column name
	column_data[columnName] = new column_data_object(columnName, data_values)
	column_data[columnName].compute_levels()
}


function buildOutputStringLenientScorer() {
	// first this creates 
	var i = 0;
	var out = "";
	var out_array = [];
	
	// for each column_data object, update it so it knows which checkboxes are selected. 
	for (i = 0; i < inputCell[0].length; i++) {
		tempColName = inputCell[0][i];
		column_data[tempColName].array_of_selected_items = []
		for (j = 0; j < column_data[tempColName].level_text.length; j++) {
			tempItemValue = column_data[tempColName].sorted_array[j][0];
			tempID = i+'*'+j;
			if (document.getElementById(tempID).checked) {
				column_data[tempColName].array_of_selected_items.push(tempItemValue)
			}
			if (j >= maximum_num_checkboxes-1) {break;} // this means it never gives you more than x options
		}

		// let the column_data array compute it's binary_array, which is the 0 or 1 scoring of each response
		// then add the resulting array to the variable out_array. Out array will end up being an array where each element is
		// a binary array for a column. 
		if (column_data[tempColName].array_of_selected_items.length > 0) { // if at least one thing is selected in the column, score it
			out_array.push(column_data[tempColName].binary_array())
		}
	}

	// take out_array and turn it into a tab-delimited string 
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
