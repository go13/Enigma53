steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models',
    
    'pagedown/Markdown.js').then('./views/init.ejs', function($){
    	
        $.Controller('Questionpage.Question.Item', {
                geocoder : new google.maps.Geocoder()
            },{
            	converter : null,            	
                model : null,

                init : function(){
                	var self = this;
                	var id = parseInt(self.element.attr("name").split("question")[1]);

                	var onSuccess = self.options.onSuccess;
                    var questionControls = self.options.questionControls;

                    this.model = new Question();

                    for(var i = 0; i < window.jsdata.questions.length; i++){
                        var question = window.jsdata.questions[i];
                        if(question.id === id){
                            self.set_question(question);

                            this.converter = self.loadPageDownConverter(id, self.renderCheckbox, function(correct, i){
                                return self.model.answers[i];
                            });

                            this.model.rendered_qtext = self.converter.makeHtml(question.qtext);

                            self.element.html(self.view('//questionpage/question/item/views/init.ejs', self.model));

                            break;
                        }
                    }

                    if(onSuccess != null){
                        onSuccess(this.model);
                    }
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
                set_question : function(question){
                    this.model.id = question.id;
                    this.model.quizid = question.quizid;
                    this.model.qtext = question.qtext;
                    this.model.answers = question.answers;

                    this.model.lon = parseFloat(question.lon);
                    this.model.lat = parseFloat(question.lat);

                    this.model.answers.sort(function(a, b) { return a.id - b.id });

                    for(var i = 0; i < this.model.answers.length; i++){
                        this.model.answers[i].value = 'F';
                    }
                },
                ".question-submit-btn click" : function(el){
                    var quizid = this.model.quizid;
                    this.model.answered = true;
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