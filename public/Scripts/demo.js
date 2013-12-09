var json;

$(document).ready(function(){
	//first let's load a ton of data
		$.ajax({
		  type: "GET",
		  url: "http://mybodythemachine.com/bgl",
		  data: {
		  	"key":"whatever"
		  },
		  dataType: "text",
		  success: function(data, status, exthing){
		  	json = JSON.parse(data);

		  	//let's log it out to get a sense for the structure
		  	console.log("This is a sample of the type of data:");
		  	console.log(json[0]);

		  	//let's analyze some basics using d3 functions
		  	// analyzeData(json);
		  	// scaleData(json);

		  },
		  error: function(jqXHR, textStatus, errorThrown){
		  		console.debug(status);
		  }
		});		
});

function analyzeData(data, noConsole){

	/*

	In this area, we will focus on some mega analysis of a few data fields. All of these methods
	are available in d3 core, as ways to work with Arrays. Arrays can contain explicit text/numeric
	data, javascript objects, or arrays. A callback function is provided with these methods to allow
	singling out specific properties, values, or computing new values based on the data in your
	array.

	*/

	if(!noConsole) console.log("\n**** HERE IS SOME ANALYSIS OF THE DATA SET ****\n");

	//LET'S FIND THE DATE RANGE FOR THIS DATA SET

		var dateRange = d3.extent(data, function(d){
			//this function returns the key to use for calculation- can return any object property or computed value
			//in this case, we'll take the UTC timestamp and make it a JS Date- d3 can calculate based on time!
			return new Date(d.Timestamp);
		});

		if(!noConsole) console.log("Oldest: "+dateRange[0]);
		if(!noConsole) console.log("Newest: "+dateRange[1]);

	//LET'S FIND THE MIN/MAX BLOOD SUGAR VALUES FOR THIS DATA SET

		var dataRange = d3.extent(data, function(d){
			return d.bgl;
		});	

		if(!noConsole) console.log("Minimum bgl: "+dataRange[0]);
		if(!noConsole) console.log("Maximum bgl: "+dataRange[1]);

	//LET'S COMPUTE THE MEDIAN QUARTILE

		var median = d3.median(data, function(d){
			return d.bgl;
		})

		if(!noConsole) console.log("Median: "+median);

	//LET'S COMPUTE THE MEAN

		var mean = d3.mean(data, function(d){
			return d.bgl;
		})

		if(!noConsole) console.log("Mean: "+mean);

	console.log("\n")

	return {
		dateExtent: dateRange,
		dataExtent: dataRange
	}

}

function scaleData(data){

	/*
	
	d3js scales are a super useful part of the library. A scale accepts an input domain and
	scales it to an output range. For instance, say we want to map blood sugar values to screen
	coordinates. We can set the input domain to encompass all results (using d3.extent to find
	our extremes), and set the output range to somewhere within the range of the screen in either
	pixels or percent. 

	The following example will map time onto the x-axis, and glucose values onto the y-axis.

	*/

	console.log("\n**** SCALING DATA TO SCREEN DIMENSIONS ****\n");

	//FIRST, LET'S FIND OUR INPUT DOMAINS

		//this uses the above function to return the date and bgl extents
		var domains = analyzeData(data, true);

	//SECOND, LET'S SET OUR OUTPUT RANGES

		//first range is from x = 0 to x = window width, second range inverts this idea to give a bottom-up orientation
		//for this example, we'll use pixel coordinates, but if the goal is to use CSS, percents could work just as well!
		var ranges = {
			dateRange: [0, window.innerWidth], 
			dataRange: [ window.innerHeight, 0 ]
		}

	//NOW, LET'S CREATE OUR SCALES

		//in this example, we'll use linear scales, but d3 has some other options (we'll show this later on)
		var xScale = d3.scale.linear()
				    	.domain(domains.dateExtent)
				    	.rangeRound(ranges.dateRange);

		var yScale = d3.scale.linear()
				    	.domain(domains.dataExtent)
				    	.rangeRound(ranges.dataRange);


		console.log("Testing scale for random value: ");
		var randomValue = data[Math.floor(Math.random()*data.length)]
		console.log("Time: " + new Date(randomValue.Timestamp) + " scales to " + xScale(randomValue.Timestamp));
		console.log("BGL: " + randomValue.bgl + " scales to " + yScale(randomValue.bgl));



}