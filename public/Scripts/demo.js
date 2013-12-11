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

	/* 
		Try calling this function!

		analyzeData(json); //to run analysis on the whole set

		or

		analyzeData(json.slice(20,50)); //to run analysis on a subset!

	*/

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

		/* 
			Try calling this function!

			scaleData(json); //to create scales for the whole set

			or

			scaleData(json.slice(20,50)); //to create scales for a subset of data!

		*/

}

function joinData(data){

	/* 
		Data joins are the bread and butter of d3js. Given an array of data, we can quickly bind
		this data to elements in the DOM, creating and removing elements on the fly using a set
		of rules. Set the rules once, then change your data forever and see the magic!

	*/

	//FIRST, WE CREATE A 'SELECTION'
	/*
		The key here is that the elements we're selecting won't yet exist in the DOM, and will
		be created and destroyed as we pass or remove their data references.

		For this example, let's create a little div for each blood glucose object in the data array.
	*/

	var bgls = d3.select(".visualization").selectAll("div.bgl").data(data);

	/*
		Here, we are using d3 to select the ".visualization" container div, then creating a d3 
	  	selection using selectAll, then binding our data to that selection. 

	  	Keep in mind there are currently no divs with class 'bgl'!

	*/

	//SECOND, WE CREATE RULES FOR WHAT HAPPENS WHEN WE GET NEW DATA, UPDATE EXISTING DATA, AND REMOVE DATA
	/*
		d3js provides tons of utilities for adding, removing and updating DOM content based on an
		ever-changing data set. Let's add some rules for when we add new data!
	*/

	
	/*
		First, let's create a rule that handles a div in general- this will get applied when
		a div already exists and is updated, and will get applied every time a div is acted
		upon. The order of the update, enter(), and exit() will have an additive kind of effect,
		similar to the way CSS cascades.
	*/

	bgls
		//since we already created it, let's just modify the data-value attribute
		.attr("data-value", function(d){
				return d.bgl;
			})
		//and the inner html
		.html(function(d){
				return d.bgl;
			})

	/*
		Second, let's handle new divs by adding them and styling them

	*/

	bgls
		.enter()
			//first, append a new div
			.append("div")
			//add the class 'bgl'
			.attr("class", "bgl")
			//add a data attribute with the bgl value of the object
			.attr("data-value", function(d){
				//return any property of 'd', which is the current array object
				return d.bgl;
			})					
			//and last, let's add the blood sugar value with units as the inner html of the div
			.html(function(d){
				return d.bgl;
			})

	/*
		Now, let's create a rule that handles a div when it's removed
	*/

	//on exit, remove the div from the DOM!
	bgls
		.exit()
		.remove("div");

	/*
		Try running this function with any subset of the json data! 

		Like:
		joinData(json.slice(0,10));
		joinData(json.slice(143,250));

	*/

}

function joinDataWithKey(data){

	/* 
		In the previous example, we joined an array of data to a DOM selection, woo!

		But wait, you might ask, how do we identify our data in the DOM? What if we had an 
		array of timestamped objects, where the VALUES of these objects change, but the 
		timestamp persists? Or what if the order of the object changes in the array?

		Interesting question!

		Mike Bostok has an awesome explanation of joins and selections here:
		http://bost.ocks.org/mike/selection/

		It's a long read, but is awesome for understanding this essential feature of d3js.

		The short of it is that when you bind data to a selection, the default way of handling
		what data belongs to which item in the selection is by array order. While this may work in 
		a variety of cases, there are many examples where you want to keep track of data binding
		using a key- like timestamp, name, color, whatever.

		We'll cover that here, building off of the previous example!

	*/

	var bgls = d3.select(".visualization").selectAll("div.bgl").data(data, function(d){
		return d.Timestamp;
	});

	/*
		NOTE: the callback function passed into .data() returns the property we are going to 
		use to keep track of what's new, added, etc. In this case it's the 'bgl' property.

		Next, we'll apply a simple color change when something is added, updated, or removed.

	*/	

	/*
		First, let's create a rule that handles a div when it's updated, our rule in general
		for how data gets applied to a div.
	*/

	bgls
		//since we already created it, let's just modify the data-value attribute
		.attr("data-value", function(d){
				return d.bgl;
			})
		//and the inner html
		.html(function(d){
				return d.bgl;
			})
		//let's make it blue when we've updated it
		.style("background-color", "#336699")


	/*

		Second, let's create the rule that handles when a div is first added, 
		this is a kind of additive code- the order of the update and enter() will
		change the way these rules are applied to the div!

		By putting the enter() second, we are guaranteeing that the background color
		will be green.
	*/

	bgls
		.enter()
			//first, append a new div
			.append("div")
			//add the class 'bgl'
			.attr("class", "bgl")
			//add a data attribute with the bgl value of the object
			.attr("data-value", function(d){
				//return any property of 'd', which is the current array object
				return d.bgl;
			})					
			//and last, let's add the blood sugar value with units as the inner html of the div
			.html(function(d){
				return d.bgl;
			})
			//let's make it green when we've first added it
			.style("background-color", "#008811")
	
	/*
		Now, let's create a rule that handles a div when it's removed
	*/

	//on exit, remove the div from the DOM!
	bgls
		.exit()
			//and red when it's been 'removed'
			.style("background-color", "#ca9000")

	/* 

		Passing an array of 10, but shifting the slice() start and end, we can
		see how d3js handles these states.

		Try these 3 commands in the console, in sequence!

		joinDataWithKey(json.slice(0,10));
		joinDataWithKey(json.slice(4,14));
		joinDataWithKey(json.slice(8,18));

	*/

}

