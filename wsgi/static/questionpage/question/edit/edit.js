steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models',

    'pagedown/Markdown.js'
    
    ).then('./views/init.ejs', function($){

        $.Controller('Questionpage.Question.Edit',{
                geocoder : new google.maps.Geocoder()
        },{
                model : null,
                editor : null,

                init : function(){
                	var self = this;
                    var type = this.options.type;
                    var onSuccess = this.options.onSuccess;
                    var questionControls = this.options.questionControls;
                    
                    if(type === "add"){
                        
                    	this.model = this.options.question;
                        this.element.html(this.view('init', this.model));
                        
                        this.editor = this.loadPageDownEditor(this.model.id, questionControls);
                        
                    }else if(type === "parse"){

                    	var question = new Questionedit();
                    	this.model = question;

                    	var question_name = this.element.attr("name");
                    	question.id = parseInt(question_name.split("question")[1]);
                    	question.lat = parseFloat(this.element.attr("data-lat"));
                    	question.lon = parseFloat(this.element.attr("data-lon"));
                    	question.qtext = this.element.find(".qtext").html();

                		this.editor = this.loadPageDownEditor(question.id, questionControls);

                        if(onSuccess){
                        	onSuccess(question);
                        }
                    }else{

                        var question_name = this.element.attr("name");

                        var id = parseInt(question_name.split("question")[1]);
                        
                        Questionedit.findOne({id : id}, function(question){
                        	self.model = question; 
                            question.lon = parseFloat(data.lon);
                            question.lat = parseFloat(data.lat);

                            if(onSuccess){
                            	onSuccess(question);
                            }
                        });
                        
                        this.element.html(this.view('init', this.model));
                    }
                },
                loadPageDownEditor : function(questionid, questionControls){
                	var self = this;                	
                    var options = {
                        helpButton: { 
                        	handler: function(){
                        		//todo
                        	},
                        	delQuestionHandler: function(){
                        		questionControls.delQuestionHandler(self.model);
                        	},
            				saveQuestionHandler: function(){           					
            					questionControls.saveQuestionHandler(self.model);
            				}
                        }
                    };
                	var converter = Markdown.getSanitizingConverter();
                	
                	converter.hooks.chain("postConversion", function (text) {
                		var res = self.renderCheckbox.call(self, text);
                		res = self.renderExplanation.call(self, res);
                		self.model.qtext = text;
                        return res;
                    });
                    
                	var editor = new Markdown.Editor(converter, "-" + (questionid).toString(), options);
                	editor.run();
                	
                	return editor;
                },
                renderCheckbox : function(text){
                	var self = this;
                	this.model.answers = [];
                	
                	return text.replace(/\?\[([\+-]?)\]/gm, function (whole, correct) {
                    	if(correct === "+"){
                    		self.onNewCheckbox.call(self, 'T');
                    		
                			return "<input type='checkbox' onclick='return false' onkeydown='return false' checked='checked'/>\n";	
                    	}else{
                    		self.onNewCheckbox.call(self, 'F');
                    		
                			return "<input type='checkbox' onclick='return false' onkeydown='return false'/>\n";	
                    	}                        	
                        
                    });                	
                },
                renderExplanation : function(text){
                	var self = this;

                	return text.replace(/\%\[((.|\n)*?)\]\%/gm, function (whole, content) {
                        return "<div class='alert alert-info'>" + content + "</div>";
                    });
                },
                onNewCheckbox : function(correct){
                	var model = this.model;
                	
                	var answer = {};
                	
            		answer.id = model.answers.length + 1;
            		answer.correct = correct;
            		answer.atext = "atext";// TODO ??
            		
            		model.answers.push(answer);                	
                },
                set_question : function(question){
                    this.model.id = question.id;
                    this.model.quizid = question.quizid;
                    this.model.qtext = question.qtext;
                    this.model.answers = question.answers;
                },
                clean : function(){
                	this.model.clean();
                },                
                ".question-view-btn click" : function(el){
                    document.location.href = '/quiz/' + this.model.quizid + '/';
                },
                onQuestionEnter : function(){
                	
                },
                onQuestionLeave : function(){
                	
                }
            });
    });