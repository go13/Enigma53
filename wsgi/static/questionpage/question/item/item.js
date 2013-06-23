steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models',
    
    'pagedown/Markdown.js'
    
    ).then('./views/init.ejs', function($){
        $.Controller('Questionpage.Question.Item',
            {
               
            },{
            	converter : null,            	
                model : null,

                init : function(){
                	var self = this;
                	
                	self.converter = self.loadPageDownConverter(self.renderCheckbox);
                	
                	var onSuccess = self.options.onSuccess;
                    var questionControls = self.options.questionControls;

                    var id = parseInt(self.element.attr("name").split("question")[1]);
                    
                    self.element.html(self.view('init', Question.findOne({id : id}, function(question){
                    	self.model = question;
                        question.qtext = self.converter.makeHtml(question.qtext);
                        question.lon = parseFloat(question.lon);
                        question.lat = parseFloat(question.lat);

                        for(var i = 0; i < question.answers.length; i++){
                            question.answers[i].value = 'F';
                            console.log( "answer:" + i + " - "+ question.answers[i].value );
                        }
                        if(onSuccess != null){
                        	onSuccess(question);
                        }

                    })));
                },    
                loadPageDownConverter : function(postConversionHandler){
                	var converter = Markdown.getSanitizingConverter();
                	
                	converter.hooks.chain("postConversion", function (text){
                		if(postConversionHandler){
                			return postConversionHandler(text);	
                		}else{
                			return text;
                		}                        
                    });
                	
                    return converter;                	
                },
            	renderCheckbox : function(text, onCheckbox) {
                	return text.replace(/\?([tTfF])\[(.*?)\]/gm, function (whole, correct, atext) {
                		if(onCheckbox){
                			onCheckbox('T', natext);
                		}
            			return "<input type='checkbox' class='answer-checkbox'/>\n";	
                    });                	
                },
                ".question-submit-btn click" : function(el){
                    this.model.submit_question();
                    Quizpage.Quiz.Navigator.to_next_tab();
                },
                ".answer-checkbox click" : function(el){
                    /*var id = parseInt(el.attr("id").split("answer")[1]);
                    var answer = this.model.get_answer_by_id(id);
                    if(el.prop('checked')){
                        answer.value = 'T';
                    }else{
                        answer.value = 'F';
                    }*/
                	alert('implement');
                }
            });
    });