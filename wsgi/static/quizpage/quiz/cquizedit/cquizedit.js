steal('jquery/controller').then(function($){
	$.Controller('Quizpage.Quiz.Cquizedit',
        {
			quiz_update : function(title, success){
				var qid = Quizpage.Quiz.Navigator.instance.model.quizid;
				var obj = {
					title : title
				};
	        	$.ajax({
		            type: "POST",
		            url: "/quiz/jupdate/"+qid+"/",
		            dataType: "json",
		            contentType: "application/json; charset=utf-8",
		            data: JSON.stringify(obj),
		            success :  success,
		            error: function (error){
		                alert("There was an error posting the data to the server: " + error.responseText);
		            }
		        });
			}
        },{        	
        	init : function(){
        		this.loadProgressChart(8, "#results-chart");
        	},        	
        	loadProgressChart : function(quizid, place){
        		var margin = {top: 40, right: 10, bottom: 20, left: 45},
        		    width = 700 - margin.left - margin.right,
        		    height = 280 - margin.top - margin.bottom;
        		
        		var formatPercent = d3.format(".0%");
        		
        		var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;
        		
        		var formatDate = d3.time.format("%d-%b-%d");
        		
        		var x = d3.scale.ordinal()
        		    .rangeRoundBands([0, width], .1);
        		
        		var y = d3.scale.linear()
        		    .range([height, 0]);
        		
        		var xAxis = d3.svg.axis()
        		    .scale(x)
        		    .orient("bottom");//
        		    //.tickFormat(formatDate)
        		
        		var yAxis = d3.svg.axis()
        		    .scale(y)
        		    .orient("left")
        		    .tickFormat(formatPercent);
        		
        		var svg = d3.select(place).append("svg")
        		    .attr("width", width + margin.left + margin.right)
        		    .attr("height", height + margin.top + margin.bottom)
        		  .append("g")
        		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        		    
        		function mousedown(d) {
        			window.location.href = "/quiz/results/"+d.id;
        		};
        		
        		d3.tsv("/quiz/" +quizid+ "/results/", function(error, data) {
        		
        		  data.forEach(function(d, i) {
        			d.date = parseDate(d.date);
        		    d.correct = +d.correct;
        		    d.rate = +d.rate;
        		    d.total = +d.total;
        		    d.id = +d.id;    
        		    d.i = i;
        		  });
        		
        		  x.domain(data.map(function(d) { return "#" + d.id; }));
        		  y.domain([0, d3.max(data, function(d) { return d.rate; })]);
        		
        		   svg.append("g")
        		      .attr("class", "x axis")
        		      .attr("transform", "translate(0," + height + ")")      
        		      .call(xAxis);
        		 
        		  svg.append("g")
        		      .attr("class", "y axis")
        		      .call(yAxis)
        		    .append("text")
        		      .attr("transform", "rotate(-90)")
        		      .attr("y", 6)
        		      .attr("dy", ".71em")      
        		      .style("text-anchor", "end")
        		      .text("Correct");
        		  
        		  var bar = svg.selectAll(".bar")
        			.data(data)
        			.enter()	
        			.append("g")	
        			.attr("class", "bar")
        		    .attr("transform", function(d) { return "translate(" + x(d.id) + ",0)"; });
        		   
        			bar.append("rect")
        			.attr("class", "bar-rect")
        			.attr("width", x.rangeBand())
        			.attr("y", function(d) { return y(d.rate); })
        			.attr("height", function(d) { return height - y(d.rate); })
        			.on("mousedown", mousedown);
        		 
        			bar.filter(function(d) { return (2*d.rate > 
        										(d3.max(data, function(d) { return d.rate; }) - 
        										 d3.min(data, function(d) { return d.rate; }))) })
        			.append("text")
        			.attr("class", "bar-text")
        			.attr("dy", ".3em")
        			.attr("dx", ".7em")	
        		    .attr("transform", function(d) { return "translate(" + x.rangeBand()/2 + ","+ height +")rotate(-90)"; })
        		    .attr("text-anchor", "start")
        		    .text(function(d) { return  formatDate(d.date) + " ("+d.correct+"/"+d.total+")"; })
        		    .on("mousedown", mousedown);
        		  
        		
        			bar.filter(function(d) { return (2*d.rate <= 
        										(d3.max(data, function(d) { return d.rate; }) - 
        										 d3.min(data, function(d) { return d.rate; }))) })
        			.append("text")
        			.attr("class", "bar-text")
        			.attr("dy", ".3em")
        			.attr("dx", ".7em")	
        		    .attr("transform", function(d) { return "translate(" + x.rangeBand()/2 + ","+ y(d.rate)+")rotate(-90)"; })
        		    .attr("text-anchor", "start")
        		    .text(function(d) { return formatDate(d.date) + " ("+d.correct+"/"+d.total+")" })
        		    .on("mousedown", mousedown);
        		});
        	},
	        "#settings-save-btn click" : function(){
	        	var val = $('#quiz-title-input').attr("value"); 
	        	Quizpage.Quiz.Cquizedit.quiz_update(val, function(data){
	        		if(data.status === "OK"){
	        			$('#quiz-title-legend').text("Quiz - " + val);	
	        		}else{
	        			// ERROR
	        		}	        		
	        	});	        	
	        }
        });        
});