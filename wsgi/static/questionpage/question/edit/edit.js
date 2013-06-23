steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models',

    'pagedown/Markdown.js'
    
    ).then('./views/init.ejs', function($){

        $.Controller('Questionpage.Question.Edit',{
        
        },{
                model : null,

                init : function(){
               	
                    var type = this.options.type;
                    var onSuccess = this.options.onSuccess;
                    var questionControls = this.options.questionControls; 
                    
                    if(type === "add"){
                        
                    	this.model = this.options.question;
                        this.element.html(this.view('init', this.model));
                        
                        this.model.editor = this.loadPageDownEditor(this.model.qid, questionControls);
                        
                    }else if(type === "parse"){
                    	                    	
                    	var question = new Questionedit();                    	
                    	this.model = question;
                    	
                    	var question_name = this.element.attr("name");
                    	question.qid = parseInt(question_name.split("question")[1]);
                    	question.lat = parseFloat(this.element.attr("data-lat"));
                    	question.lon = parseFloat(this.element.attr("data-lon"));
                    	question.qtext = this.element.find(".qtext").html();
                    	
                		question.editor = this.loadPageDownEditor(question.qid, questionControls);
                    	
                        if(onSuccess){
                        	onSuccess(question);
                        }
                    	
                    }else{

                        var question_name = this.element.attr("name");
                        this.model = new Questionedit();
                        var question = this.model;

                        var id = parseInt(question_name.split("question")[1]);
                        
                        this.element.html(this.view('init', Questionedit.findOne({id:id}, function(data){
                            question.qid = data.id;
                            question.quizid = data.quizid;
                            question.qtext = data.qtext;
                            question.answers = data.answers;
                            question.lon = parseFloat(data.lon);
                            question.lat = parseFloat(data.lat);
                            
                            if(onSuccess){
                            	onSuccess(question);
                            }
                        })));
                    }
                },
                loadPageDownEditor : function(questionid, questionControls){
                	var self = this;                	
                    var options = {
                        helpButton: { 
                        	handler: function(){
                        		//self.editorToPreview(self);
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
                	
                	return text.replace(/\?([tTfF])\[(.*?)\]/gm, function (whole, correct, atext) {
                    	var natext = atext;
                    	if(!atext || 0 === atext.length){
                    		// #todo: can put only link or plain text
                    		var natext = "Wrong!"	
                    	}
                    	if(correct === "T" || correct === "t" ){
                    		self.onNewCheckbox.call(self, 'T', natext);
                    		
                			return "<input type='checkbox' " +
            				"onclick='return false' onkeydown='return false' checked='checked'>" + " " + 
            				"<span class='label label-important'>"+ natext +"</span>\n";	
                    	}else{
                    		self.onNewCheckbox.call(self, 'F', natext);
                    		
                			return "<input type='checkbox' " +
            				"onclick='return false' onkeydown='return false'>" + " " + 
            				"<span class='label label-important'>"+ natext +"</span>\n";	
                    	}                        	
                        
                    });                	
                },
                onNewCheckbox : function(correct, atext){
                	var model = this.model;
                	
                	var answer = new Object();
                	
            		answer.id = model.answers.length + 1;
            		answer.correct = correct;
            		answer.atext = atext;
            		
            		model.answers.push(answer);                	
                },
                set_question : function(question){
                    this.model.qid = question.qid;
                    this.model.quizid = question.quizid;
                    this.model.qtext = question.qtext;
                    this.model.answers = question.answers;
                },
                clean : function(){
                	this.model.clean();
                },                
                ".question-view-btn click" : function(el){
                    document.location.href = '/quiz/'+this.model.quizid+'/';
                },
                onQuestionEnter : function(){
                	
                },
                onQuestionLeave : function(){
                	
                }
            });
    });