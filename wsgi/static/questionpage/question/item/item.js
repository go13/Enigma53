steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models',
    
    'pagedown/Markdown.js').then('./views/init.ejs', function($){
    	
        $.Controller('Questionpage.Question.Item', {
                geocoder : null
            },{
            	converter : null,            	
                model : null,

                init : function(){
                	var self = this;
                	var id = parseInt(self.element.attr("name").split("question")[1]);
                    Questionpage.Question.Item.geocoder = new google.maps.Geocoder();

                	var onSuccess = self.options.onSuccess;
                    var questionControls = self.options.questionControls;
                    
                    self.element.html(self.view('init', Question.findOne({id : id}, function(question){
                    	self.model = question;                        
                        question.lon = parseFloat(question.lon);
                        question.lat = parseFloat(question.lat);

                        question.answers.sort(function(a, b) { return a.id - b.id });

                        for(var i = 0; i < question.answers.length; i++){
                        	console.log( "answer:" + i + " id= " + question.answers[i].id);
                            question.answers[i].value = 'F';                            
                        }
                        
                    	self.converter = self.loadPageDownConverter(id, self.renderCheckbox, function(correct, i){
                    		return self.model.answers[i];
                    	});
                    	
                    	question.qtext = self.converter.makeHtml(question.qtext);
                    	
                        if(onSuccess != null){
                        	onSuccess(question);
                        }

                    })));
                },    
                loadPageDownConverter : function(questionid, renderCheckbox, onCheckbox){
                	var converter = Markdown.getSanitizingConverter();
                	
                	converter.hooks.chain("postConversion", function (text){
                		if(renderCheckbox){
                			return renderCheckbox(questionid, text, onCheckbox);	
                		}else{
                			return text;
                		}                        
                    });
                	
                    return converter;                	
                },
                renderCheckbox : function(questionid, text, onCheckbox) {
            		var i = 0;
                	return text.replace(/\?\[([\+-]?)\]/gm, function (whole, correct) {
                		var answer;
                		if(correct === '+'){
                		    answer = onCheckbox('T', i);                			
                		}else{
               			 	answer = onCheckbox('F', i);                			
                		}
						i = i+1;
						return "<input id='answer-" + questionid + "-" + answer.id + "' type='checkbox' class='answer-checkbox'/>\n";
                    });                	
                },
                ".question-submit-btn click" : function(el){
                    var quizid = this.model.quizid;
                    this.model.submit_question(function(){
                        var r = Quizpage.Quiz.Navigator.instance.to_next_unanswered_question();
                        if (!r && (confirm("Do you want to finish the quiz?") == true)){
                            window.location = "/quiz/" + quizid + "/finish/";
                        }
                    });
                },
                ".answer-checkbox click" : function(el){
                	var self = this;
                	var id_string = el.attr("id");
                	id_string.replace(/answer-(\d*)-(\d*)/gm, function(whole, questionid, answerid){
                		questionid = parseInt(questionid);
                		answerid = parseInt(answerid);
                		
                        if(el.prop('checked')){
                        	self.model.get_answer_by_id(answerid).value = 'T';
                        }else{
                        	self.model.get_answer_by_id(answerid).value = 'F';
                        }
                	});
                }
            });
    });