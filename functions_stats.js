function computeNothing() { // get rid of this function? 
	return "";
}

function Count(input) {
	var numbers = removeNonNumbersFromArray(input);
	return numbers.length;
}

function Sum(input) {
	var total = 0;
	var numbers = removeNonNumbersFromArray(input);
	for (var i = 0; i < numbers.length; i++) {
		total += numbers[i];
	}
	
	return total;
}

function Mean(input) {
	var numbers = removeNonNumbersFromArray(input);
	var total = 0;
	var i = 0;
	for (i = 0; i < numbers.length; i++) {
		total += numbers[i];
	}
	return total / numbers.length;
}

function Median(input) {
	var numbers = removeNonNumbersFromArray(input);
	var median = 0;
	var numsLen = numbers.length;
	numbers.sort(function(a, b){return a - b}); // does a numerical sort
	
	if ((numsLen % 2) === 0) { // is even
		// average of two middle numbers
		median = (numbers[numsLen/2-1] + numbers[numsLen/2])/2;
	} else { // is odd
		// middle number only
		median = numbers[(numsLen-1)/2];
	}
	return median;  
}

function Mode(input) {
	// This returns an object with 3 values. Let's assume the mode in your data is 11 and it occurred 21 times.
	// Mode.value would equal 11
	// Mode.frequency would equal 21
	// Mode.uniqueLevels would be the number of different values this array has. 
	// Note: Unlike other stat functions, this doesn't ignore non-numbers. 
	
	var freq = [];
	var highestFreq = 0;
	var returnValue = {value:0, frequency:0, uniqueLevels:0}

	// if there's no data, return.
	if (input == null) {
		returnValue.uniqueLevels = 0;
		returnValue.value = null;
		returnValue.frequency = 0;
		return returnValue;
	}

	for (i = 0; i < input.length; i++) {
		if (freq[input[i]] === undefined) {
			freq[input[i]] = 0;
			returnValue.uniqueLevels++;
		}

		freq[input[i]]++;
		if (freq[input[i]] > highestFreq) {
			highestFreq = freq[input[i]];
			returnValue.value = input[i];
			returnValue.frequency = highestFreq;
		}
	}
	
	return returnValue;
}

function PairwiseCount(a, b) {
	if (a === undefined || b === undefined) {
		return "NaN";
	}
	var x = a.slice(0);
	var y = b.slice(0);

	removeNonNumbersFromTwoArraysPairwise(x,y);
	
	var shortestArrayLength = 0;
 
	if(x.length == y.length) {
		shortestArrayLength = x.length;
	} else if(x.length > y.length) {
		shortestArrayLength = y.length;
		console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
	} else {
		shortestArrayLength = x.length;
		console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
	}

	return shortestArrayLength;
}

function Gamma(a, b) {
	var i = 0;
	var ii = 0;
	var nc = 0; // concordance
	var nd = 0; // discordance
	var nt = 0; // tie
	
	if (a === undefined || b === undefined) {
		return "NaN";
	}
	var x = a.slice(0);
	var y = b.slice(0);

	removeNonNumbersFromTwoArraysPairwise(x,y);
	
	var shortestArrayLength = 0;
 
	if(x.length == y.length) {
		shortestArrayLength = x.length;
	} else if(x.length > y.length) {
		shortestArrayLength = y.length;
		console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
	} else {
		shortestArrayLength = x.length;
		console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
	}
	
	for (i = 0; i < shortestArrayLength; i++) {
		for (ii = i + 1; ii < shortestArrayLength; ii++) {
			if ((x[i] != x[ii]) && (y[i] != y[ii])) {
				if (x[i] > x[ii] == y[i] > y[ii]) {
					nc++;
				} else {
					nd++;
				}
			} else {
				nt++;
			}
		}
	}
	return (nc - nd)/(nc + nd);
//    	return (nc - nd)/(nc + nd + nt); // this is if you don't toss out the ties. but I do.  
}	


function Pearson(a, b) {
	// I didn't write the Pearson thing, it's from https://memory.psych.mun.ca/tech/js/correlation.shtml
	// I did make a couple of modifications (just at the top, having to do with importing the data). 
	if (a === undefined || b === undefined) {
		return "NaN";
	}
	var x = a.slice(0);
	var y = b.slice(0);

	removeNonNumbersFromTwoArraysPairwise(x,y);
	
	var shortestArrayLength = 0;
 
	if(x.length == y.length) {
		shortestArrayLength = x.length;
	} else if(x.length > y.length) {
		shortestArrayLength = y.length;
		console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
	} else {
		shortestArrayLength = x.length;
		console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
	}

	var xy = [];
	var x2 = [];
	var y2 = [];

	for(var i=0; i<shortestArrayLength; i++) {
		xy.push(x[i] * y[i]);
		x2.push(x[i] * x[i]);
		y2.push(y[i] * y[i]);
	}

	var sum_x = 0;
	var sum_y = 0;
	var sum_xy = 0;
	var sum_x2 = 0;
	var sum_y2 = 0;

	for(var i=0; i< shortestArrayLength; i++) {
		sum_x += x[i];
		sum_y += y[i];
		sum_xy += xy[i];
		sum_x2 += x2[i];
		sum_y2 += y2[i];
	}

	var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
	var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
	var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
	var step4 = Math.sqrt(step2 * step3);
	var answer = step1 / step4;

	return answer;
}
	
function StdDev(input) {
	var arr = removeNonNumbersFromArray(input);
	var sum = 0;
	var n = arr.length;
	if (n < 2) {return "NaN";}
	
	arr.map(function(data) {
		sum+=data;
	});

	var mean = sum / n;

	var variance = 0.0;
	var v1 = 0.0;
	var v2 = 0.0;

	for (var i = 0; i<n; i++) {
		v1 = v1 + (arr[i] - mean) * (arr[i] - mean);
		v2 = v2 + (arr[i] - mean);
	}

	v2 = v2 * v2 / n;
	variance = (v1 - v2) / (n-1);
	if (variance < 0) { variance = 0; }
	
	return Math.sqrt(variance);
}

function removeNonNumbersFromArray(input) {
	// This function doesn't change the input array. It returns an array that is the same, except with non-numbers removed. 
	var numbers = input.slice(0); // just using input would make it by reference, so that changing numbers later on would also change input. input.slice(0) returns the value of input, instead of a reference to input). 
	var i = 0;
	var temp = "";
	
	for (i = numbers.length-1; i >= 0; i--) {
		if (isNaN(numbers[i]) == true) { 
			numbers.splice(i, 1);
		}
	}	
	return numbers;
}

function removeNonNumbersFromTwoArraysPairwise(x, y) {
	// This function changes the input arrays themselves. It removes entries in pairs if either or both of the entries is non-numeric. 
	var i = 0;

	if(x.length == y.length) {
		shortestArrayLength = x.length;
	} else if(x.length > y.length) {
		shortestArrayLength = y.length;
		console.error('Pairwise says: x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
	} else {
		shortestArrayLength = x.length;
		console.error('Pairwise says: y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
	}

	for (i = shortestArrayLength-1; i >= 0; i--) {
		if (isNaN(x[i]) == true || isNaN(y[i]) == true)  { 
// 				console.log("removeNonNumbersFromTwoArraysPairwise removed: " + x[i] + " & " + y[i]);
			x.splice(i, 1);
			y.splice(i, 1);
		}
	}	
}
