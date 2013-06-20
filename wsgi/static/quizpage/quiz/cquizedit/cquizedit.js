steal('jquery/controller', 'quizpage/quiz/navigator').then(function($){
	Quizpage.Quiz.Navigator('Quizpage.Quiz.Cquizedit', {

            add_question_edit : function(question){
                Quizpage.Quiz.Navigator.instance.element.find("#tabs")
                    .append("<li id='tab-question" + question.qid + "' class='question-tab tab-question-item'>" +
                        "<a href='#tab-question-page" + question.qid + "' data-toggle='tab'>Question " + question.qid + "</a>" +
                        "</li>");
                Quizpage.Quiz.Navigator.instance.element.find("#tabs-container")
                    .append("<div id='tab-question-page" + question.qid + "' class='tab-pane' style='margin-right:20px'>" +
                        "<div class='question-edit' name='question" + question.qid + "'></div>" +
                        "</div>");
                var el = Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page" + question.qid)
                    .children(".question-edit :first");
                
                var mc = new Questionpage.Question.Edit($(el), {type:"add", question : question, onSuccess : function(qst){
                	Quizpage.Quiz.Navigator.instance.model.add_question(qst);
                }});
                Quizpage.Quiz.Navigator.instance.model.add_question(mc.model);
                return mc.model; // returns question with id
            },
            load_question_edit : function(el, success){
            	var nav = Quizpage.Quiz.Navigator.instance;
                var qc = new Questionpage.Question.Edit($(el), {onSuccess : function(qst){                	
                	nav.model.add_question(qst);
                	if(success){
                		success(qst);
                	}
                }});
            },
            remove_question : function(qst){
            	var el = Quizpage.Quiz.Navigator.instance.element.find("#tab-question"+qst.qid);
            	if(el.hasClass("active")){
            		if(!Quizpage.Quiz.Navigator.to_prev_tab()){
            			Quizpage.Quiz.Navigator.to_next_tab();
            		}
            	};                	
                el.remove();
                
                Quizpage.Quizmap.Cmapedit.remPoint(qst);
                
                Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page"+qst.qid).remove();

                Quizpage.Quiz.Navigator.instance.model.remove_question_by_id(qst.qid);
            }
        },{        	
        	init : function(){
        		this._super();
        		this.loadProgressChart(this.quizid, "#results-chart");        		

        		this.parse_quiz_edit(this.options.onSuccess);
        	},        	
            parse_quiz_edit : function(onSuccess){
            	var self = this;
            	var els = self.element.find(".question-edit");
            	$(els).each(function(i){
            		
            		$(this).questionpage_question_edit({type : "parse", onSuccess : function(question){
            			self.model.add_question(question);
            			if(onSuccess){
            				onSuccess(question);
            			}
            		}});
            		
            	});
            	
            },
            load_quiz_edit : function(onSuccess){
            	var n = 0;
            	var els = this.element.find(".question-edit"); 
                $(els).each(function(i){
                	Quizpage.Quiz.Cquizedit.load_question_edit(this , function(qst){
                		n++;
        				if(els.length === n){
        	        		if(onSuccess){
        	        			onSuccess();	
        	        		}
        				}
            		});
            	});
            },
            ".question-delete-btn click" : function(){
            	var qst = Quizpage.Quiz.Navigator.get_current_question();
            	qst.destroy(function(data){
            		Quizpage.Quiz.Cquizedit.remove_question(qst);   
            		
                    Messenger().post({
                		  message: 'Question deleted',
                		  showCloseButton: true
                		});
                });
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
        		    .orient("bottom");
        		
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
        	}
        });
});