steal('jquery/controller', 'pagedown/Markdown.js').then(function($){

	$.Controller('Resultpage.Question.Cquestionresult', {
            instance : null,

            add_question_result : function(model){
                var question_result = $("<div data-questionid='" + model.id + "' class='question-result'></div>");
        		var self = new Resultpage.Question.Cquestionresult(question_result);
                self.converter = Markdown.getSanitizingConverter();
                self.model = model;

            	self.converter.hooks.chain("postConversion", function (text){
            		if(self.renderCheckbox){
            			var res = self.renderCheckbox.call(self, text, model.id);
                        res = self.renderExplanation.call(self, res);
                        return res;
            		}else{
            			return text;
            		}
                });

        		model.rendered_qtext = self.converter.makeHtml(model.qtext);

                self.element.html(self.view('//resultpage/question/cquestionresult/views/init.ejs', self.model));

                return self;
            },
            add_question_result_from_jsdata : function(el){
        		var self = new Resultpage.Question.Cquestionresult(el);
                self.converter = Markdown.getSanitizingConverter();
        		var id = parseInt(self.element.attr("data-questionid"));

            	self.converter.hooks.chain("postConversion", function (text){
            		if(self.renderCheckbox){
            			var res = self.renderCheckbox.call(self, text, self.id);
                        res = self.renderExplanation.call(self, res);
                        return res;
            		}else{
            			return text;
            		}
                });

            	var question_result = null;
        		for(var i = 0; i < jsdata.question_results.length; i++) {
        			if(jsdata.question_results[i].questionid === id){
        				question_result = jsdata.question_results[i];
        				break;
        			}
        		}

            	self.model = new Questionresult();
            	self.model.id = id;
            	self.model.answered = true;

            	self.model.lat = parseFloat(question_result.question.lat);
            	self.model.lon = parseFloat(question_result.question.lon);
            	self.model.qtext = question_result.question.qtext;

            	self.model.answers = question_result.answer_results;

            	self.model.gmarker = Resultpage.Map.Cresultmap.addPoint(self.model);

        		var qtext = self.converter.makeHtml(self.model.qtext);
        		self.element.find("#question-text-" + id).html(qtext);

                return self;
            }
        },{
        	converter : null,
        	model : null,
        	init : function(){
                Resultpage.Question.Cquestionresult.instance = this;
        	},
            renderExplanation : function(text){
                return text.replace(/\%\[((.|\n)*?)\]\%/gm, function (whole, content) {
                    return "<div class='alert alert-info'>" + content + "</div>";
                });
            },
            onScroll : function(){
            },
        	renderCheckbox : function(text, id) {
        		var self = this;
        		var i = 0;            	
            	return text.replace(/(\?\[[\+-]?\])/gm, function (whole, checkbox) {
            		var s = "";
            		if(i < self.model.answers.length){
	            		var answer = self.model.answers[i];
	            		var ch = "checked";
	            		if(answer.value !== 'T'){
	            			ch = "";
	            		}
	            		if(self.model.answered){
                            if(answer.correct !== answer.value){
                                s = "<input id='answer-" + self.model.id + "-" + answer.answerid +
                                    "' type='checkbox' class='answer-checkbox' onclick='return false' " + ch + " /> " +
                                    "<span class='label label-important'>Error</span>" +
                                    "\n";
                            }else{
                                s = "<input id='answer-" + self.model.id + "-" + answer.answerid +
                                    "' type='checkbox' class='answer-checkbox' onclick='return false' " + ch + " /> " +
                                    "<span class='label label-success'> Ok </span>" +
                                    "\n";
                            }
                        }else{
                                s = "<input id='answer-" + self.model.id + "-" + answer.answerid +
                                    "' type='checkbox' class='answer-checkbox' onclick='return false' " + ch + " /> " +
                                    "<span class='label label-important'>N/A</span>" +
                                    "\n";
                        }
            		}
					i = i + 1;
					return s;
                });
            }   
        });
});