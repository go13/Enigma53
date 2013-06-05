function loadProgressChart(quizid, place){
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
};

//function loadQuestionMap(){

	var questionMap = null;	

	var markers = [];
	var polyLine = null;
	var polyLineArrows = [];

	var onMapClick = null;
	
	var onMarkerClick = null;
	
	var onMarkerMove = null;
	
	function offsetCenter(latlng) {
		
		var offsetx = - $(window).width() * 0.3;
		var offsety = 0;

		// latlng is the apparent centre-point
		// offsetx is the distance you want that point to move to the right, in pixels
		// offsety is the distance you want that point to move upwards, in pixels
		// offset can be negative
		// offsetx and offsety are both optional

		var scale = Math.pow(2, questionMap.getZoom());
		var nw = new google.maps.LatLng(
			questionMap.getBounds().getNorthEast().lat(),
			questionMap.getBounds().getSouthWest().lng()
		);

		var worldCoordinateCenter = questionMap.getProjection().fromLatLngToPoint(latlng);
		var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

		var worldCoordinateNewCenter = new google.maps.Point(
		    worldCoordinateCenter.x - pixelOffset.x,
		    worldCoordinateCenter.y + pixelOffset.y
		);

		var newCenter = questionMap.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

		questionMap.setCenter(newCenter);

	};
		
	function onMarkerRightClick(marker){
		offsetCenter(marker.position);
	};
		
	function remPoint(marker){
    	for(var i = 0; i < markers.length; i++){
    		if(markers[i] === marker){
    			polyLine.getPath().removeAt(i);
    			markers.splice(i, 1);
    			marker.setMap(null); 
    			break;
    		}
    	}			
	};

	function addPoint(latlng) {
	    var marker = new google.maps.Marker({
	      position: latlng,
	      map: questionMap,
	      draggable: true
	    });
	    
		polyLine.getPath().push(latlng);
	    
	    markers.push(marker);
	    marker.setTitle("#"+(polyLine.getPath().getLength()).toString());
	    
	    google.maps.event.addListener(marker, 'click', function() {
	    	if(onMarkerClick){
	    		onMarkerClick(marker);
	    	}			
	    });
	    
	    google.maps.event.addListener(marker, 'rightclick', function() {
	    	if(onMarkerRightClick){
	    		onMarkerRightClick(marker);
	    	}
	    });
	    
	    google.maps.event.addListener(marker, 'dragend', function() {
	    	for(var i = 0; i < markers.length; i++){
	    		if(markers[i] === marker){
	    			polyLine.getPath().setAt(i, marker.position);
	    			break;
	    		}
	    	}	    	
	    	if(onMarkerMove){
	    		onMarkerMove(marker);
	    	}
	    });

	    return marker;
	}
			
	//google.maps.event.addDomListener(window, 'load', function initialize(){
		  var mapOptions = {
		    zoom: 8,		    
		    center: new google.maps.LatLng(37.4419, -122.1419),
		    panControl: true, 
		    streetViewControl: false,
		    mapTypeControl: false,
		    overviewMapControl: true,
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  };
		  
		  questionMap = new google.maps.Map(document.getElementById('question-map'), mapOptions);
		  
		  var lineSymbol = {
				    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
				  };
		  
		  var polyOptions = {
				  icons: [{
				      icon: lineSymbol,
				      offset: '100%',
				      repeat:'100px'
				    }],
				    strokeColor: 'rgb(255, 255, 255)',
				    strokeOpacity: 1.0,
				    strokeWeight: 3
		  };		  
		  
		  polyLine = new google.maps.Polyline(polyOptions);
		  polyLine.setMap(questionMap);
		  
		  google.maps.event.addListener(questionMap, 'rightclick', function(event) {
			    if(onMapClick != null){
			    	onMapClick(event, questionMap);		    	
			    }
		  });
	//});		
//} 