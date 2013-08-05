steal('jquery/controller',
    'quizpage/quiz/navigator').then(function($){
	Quizpage.Quiz.Navigator('Quizpage.Quiz.Cquizedit', {

            add_question_edit : function(question){
            	var nav = Quizpage.Quiz.Navigator.instance;

                nav.element.find("#if-no-questions").html("");

                nav.element.find("#tabs")
                    .append("<li id='tab-question" + question.id + "' class='question-tab tab-question-item'>" +
                        "<a href='#tab-question-page" + question.id + "' data-toggle='tab'>Question " + question.id + "</a>" +
                        "</li>");
                nav.element.find("#tabs-container")
                    .append("<div id='tab-question-page" + question.id + "' class='tab-pane' style='margin-right:20px'>" +
                        "<div class='question-edit' name='question" + question.id + "'></div>" +
                        "</div>");
                var el = nav.element.find("#tab-question-page" + question.id)
                    .children(".question-edit :first");
                
                var mc = new Questionpage.Question.Edit($(el), {
                	type : "add", 
                	question : question, 
                	onSuccess : function(qst){
                		nav.model.add_question(qst);
                	},
                	questionControls : {
        				delQuestionHandler : nav.delQuestionHandler,
        				saveQuestionHandler : nav.saveQuestionHandler
        			}
                });
                nav.model.add_question(mc.model);
                return mc.model; // returns question with id
            },
            load_question_edit : function(el, success){
            	var nav = Quizpage.Quiz.Navigator.instance;
                var qc = new Questionpage.Question.Edit($(el), {
                	onSuccess : function(qst){                	
	                	nav.model.add_question(qst);
	                	if(success){
	                		success(qst);
	                	}
                	},
        			questionControls : {
        				delQuestionHandler : nav.delQuestionHandler,
        				saveQuestionHandler : nav.saveQuestionHandler
        			} 
                });
            },
            remove_question : function(qst){
            	var el = Quizpage.Quiz.Navigator.instance.element.find("#tab-question"+qst.id);
            	if(el.hasClass("active")){
            		if(!Quizpage.Quiz.Navigator.to_prev_tab()){
            			Quizpage.Quiz.Navigator.to_next_tab();
            		}
            	};                	
                el.remove();
                
                Quizpage.Quizmap.Cmapedit.remPoint(qst);
                
                Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page"+qst.id).remove();

                Quizpage.Quiz.Navigator.instance.model.remove_question_by_id(qst.id);

                if(Quizpage.Quiz.Navigator.instance.model.questions.length == 0){
                    Quizpage.Quiz.Navigator.instance.element.find("#if-no-questions")
                        .html('<div class="chart-title" style="margin-top: 99px;margin-left: 69px;">No questions found</div>'+
                    '<div class="edit-caption-mini" style="margin-top: 10px; margin-left: 159px;">Right click on the map to add a new question</div>');
                }
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
            		
            		$(this).questionpage_question_edit({
            			type : "parse", 
            			onSuccess : function(question){
	            			self.model.add_question(question);
	            			if(onSuccess){
	            				onSuccess(question);
	            			}
            			},
            			questionControls : {
            				delQuestionHandler : self.delQuestionHandler,
            				saveQuestionHandler : self.saveQuestionHandler
            			}           			
            		});
            		
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
        	onNewQuestion : function(){
        		alert('new');
        	},        	
        	saveQuestionHandler : function(question){
                question.save( function(){
                    Messenger().post({
                		  message: 'Successfully saved',
                		  showCloseButton: true
                		});                   
                });
        	},
        	delQuestionHandler : function(question){
            	question.destroy(function(data){
            		Quizpage.Quiz.Cquizedit.remove_question(question);   
            		
                    Messenger().post({
                		  message: 'Question deleted',
                		  showCloseButton: true
                		});
                });
            },
        	loadProgressChart : function(quizid, place){

                var data = window.jsdata.quiz_results;

                if(data){ // &&  data.length > 0

                    var margin = {top: 40, right: 10, bottom: 50, left: 45},
                        width = 640 - margin.left - margin.right,
                        height = 280 - margin.top - margin.bottom;

                    var formatPercent = d3.format(".0%");

                    var formatXItem = function(i){
                        return "" + data[i].correct + "/" + data[i].total;
                    };

                    var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

                    var formatDate = d3.time.format("%d-%b-%Y");

                    var x = d3.scale.ordinal()
                        .rangeRoundBands([0, width], 0.1);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(formatXItem);

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
                        window.location.href = "/quiz/results/" + d.id;
                    }

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

                    x.domain(
                        data.map(function(d) {
                            return d.i;
                        })
                    );

                    y.domain([0, 1]);

                    if(data.length <= 0){

                        svg.append("g")
                            .append("text")
                              .attr("class", "chart-title")
                              .attr("x", "0.4em")
                              .attr("dy", "1.9em")
                              .text("No results found yet");

                        svg.append("g")
                            .append("text")
                              .attr("class", "chart-title")
                              .attr("x", "0.4em")
                              .attr("dy", "1.9em")
                              .text("");

                    }else{

                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                        .append("text")
                          .attr("x", "-3.2em")
                          .attr("dy", "-1.2em")
                          .text("Correct answers (%)");


                         svg.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0," + height + ")")
                          .call(xAxis)
                        .append("text")
                          .attr("x", "1.0em")
                          .attr("dy", "3.2em")
                          .text("Your results (Correct questions/Total questions)");

                        var bar = svg.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("g")
                        .attr("class", "bar")
                        .attr("transform", function(d) {
                                return "translate(" + x(d.i) + ",0)";
                            });

                        bar.append("rect")
                        .attr("class", "bar-rect")
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) {
                                return y(d.rate);
                            })
                        .attr("height", function(d) {
                                return height - y(d.rate);
                            })
                        .on("mousedown", mousedown);


                        bar.filter(function(d) {
                            return (2*d.rate > (d3.max(data, function(d) {
                                return d.rate;
                            }) - d3.min(data, function(d) {
                                return d.rate;
                            })))
                        })
                        .append("text")
                        .attr("class", "bar-text")
                        .attr("dy", ".3em")
                        .attr("dx", ".7em")
                        .attr("transform", function(d) {
                                return "translate(" + x.rangeBand()/2 + ","+ height +")rotate(-90)";
                            })
                        .attr("text-anchor", "start")
                        .text(function(d) {
                                return formatDate(d.date);
                            })
                        .on("mousedown", mousedown);


                        bar.filter(function(d) {
                            return (2*d.rate <= (d3.max(data, function(d) {
                                return d.rate;
                            }) - d3.min(data, function(d) {
                                return d.rate;
                            })))
                        })
                        .append("text")
                        .attr("class", "bar-text")
                        .attr("dy", ".3em")
                        .attr("dx", ".7em")
                        .attr("transform", function(d) {
                                return "translate(" + x.rangeBand()/2 + ","+ y(d.rate)+")rotate(-90)";
                            })
                        .attr("text-anchor", "start")
                        .text(function(d) {
                                return formatDate(d.date)
                            })
                        .on("mousedown", mousedown);
                    }
                }
        	}
        });
});