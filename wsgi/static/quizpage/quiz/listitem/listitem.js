steal('jquery/controller', 'jquery/view/ejs').then(function($){

    $.Controller('Quizpage.Quiz.Listitem', {
    },{        
    	lat : null,
    	lon : null,
    	gmarker : null,
        quiz : null,

    	init : function(){
    		var onSuccess = this.options.onSuccess;
    		
    		this.lat = parseFloat(this.element.attr("data-lat"));
    		this.lon = parseFloat(this.element.attr("data-lon"));

    		var quiz_id = parseInt(this.element.attr("id").split("data-quiz-")[1]);

            for(var i = 0; i < window.jsdata.quizes.length; i++){
                if(window.jsdata.quizes[i].quiz.id === quiz_id){

                    this.quiz = window.jsdata.quizes[i];
                    this.loadMiniProgressChart(quiz_id, this.quiz.quiz_results);

                    break;
                }
            }

            if(onSuccess){
                onSuccess(this);
    		}
    	},
        loadMiniProgressChart : function(quiz_id, data){

            if(data){

                var margin = {top: 3, right: 2, bottom: 3, left: 2},
                    width = 128 - margin.left - margin.right,
                    height = 64 - margin.top - margin.bottom;

                var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

                var x = d3.scale.linear()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .interpolate("monotone")
                    .x(function(d) {
                        return x(d.i);
                    })
                    .y(function(d) {
                        return y(d.correct/d.total);
                    });

                var svg = d3.select("#data-quiz-" + quiz_id + " > a").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                data.forEach(function (d, i) {
                    d.date = parseDate(d.date);
                    d.correct = +d.correct;
                    d.total = +d.total;

                    if(d.total){
                        d.rate = d.correct/d.total;
                    }else{
                        d.rate = 0;
                    }

                    d.id = +d.id;
                    d.i = i;
                });

                x.domain(d3.extent(data, function(d) {
                    return d.i;
                }));
                y.domain(d3.extent(data, function(d) {
                    return d.correct/d.total;
                }));

                function xx(d) { return x(d.i); };
                function yy(d) { return y(d.correct/d.total); };

                if(data.length <= 0){

                    svg.append("g")
                        .append("text")
                          .attr("class", "no-results-mini-chart")
                          .attr("x", "64px")
                          .attr("dy", "38px")
                          .attr("text-anchor", "middle")
                          .text("No results");

                }else{

                     svg.append("g")
                      .attr("class", "y axis")
                      .call(yAxis);

                     svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis);

                     svg.append("path")
                          .datum(data)
                          .attr("class", "mini-chart-line")
                          .attr("d", line);

                     svg.selectAll("circle")
                         .data(data)
                         .enter().append("circle")
                         .attr("fill", "steelblue")
                         .attr("r", 2)
                            .attr("cx", xx)
                            .attr("cy", yy);
                }
            }
        }
    });    
        
});