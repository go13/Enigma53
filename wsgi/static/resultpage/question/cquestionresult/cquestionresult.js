steal('jquery/controller', 
		'resultpage/quiz/cquizresult',
		'pagedown/Markdown.js').then(function($){

	$.Controller('Resultpage.Question.Cquestionresult', {         
        },{
        	converter : null,
        	model : null,
        	
        	init : function(){
        		var self = this;
        		var id = parseInt(this.element.attr("data-questionid"));
        		this.converter = Markdown.getSanitizingConverter();
        		
            	this.converter.hooks.chain("postConversion", function (text){
            		if(self.renderCheckbox){
            			return self.renderCheckbox.call(self, text, self.id);
            		}else{
            			return text;
            		}                        
                });

            	var question_result = null;
        		var results = window.jsdata;
        		for(var i = 0; i < jsdata.question_results.length; i++) {
        			if(jsdata.question_results[i].questionid === id){
        				question_result = jsdata.question_results[i];
        				break;
        			}
        		}
            	
            	this.model = new Questionresult();
            	this.model.id = id;

            	this.model.lat = parseFloat(question_result.question.lat);
            	this.model.lon = parseFloat(question_result.question.lon);
            	this.model.qtext = question_result.question.qtext;
            	
            	this.model.answers = question_result.answer_results;
            	
            	this.model.gmarker = Resultpage.Map.Cresultmap.addPoint(this.model);
            	
            	//var self = Resultpage.Question.Cquestionresult;            	
            	            
        		var qtext = self.converter.makeHtml(this.model.qtext);
        		this.element.find("#question-text-" + id).html(qtext);
        	},
        	renderCheckbox : function(text, id) {
        		var self = this;
            	var i = 0;
            	return text.replace(/(\?\[[\+-]?\])/gm, function (whole, checkbox) {
            		var answer = self.model.answers[i];
            		var ch = "checked";
            		if(answer.value !== 'T'){
            			ch = "";
            		}
            		var s = "";
            		if(answer.correct === answer.value){
	            		s = "<input id='answer-" + self.model.id + "-" + answer.answerid +
							"' type='checkbox' class='answer-checkbox' onclick='return false' " + ch + " />" + 
							"\n";	
            		}else{
	            		s = "<input id='answer-" + self.model.id + "-" + answer.answerid +
							"' type='checkbox' class='answer-checkbox' onclick='return false'" + ch + " /> " +
							"<span class='label label-important'>Error</span>" +
	            			"\n";
            		}					
					i = i + 1;
					return s;
                });            	
            }   
        });
});