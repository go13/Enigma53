steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models')
    .then('./views/init.ejs', function($){

        $.Controller('Questionpage.Question.Edit',
            {
            },{
                model : null,

                init : function(){
               	
                    var type = this.options.type;
                    var onSuccess = this.options.onSuccess;
                    
                    if(type === "add"){
                        
                    	this.model = this.options.question;
                        this.element.html(this.view('init', this.model));
                        
                    }else if(type === "parse"){
                    	                    	
                    	var question = new Questionedit();                    	
                    	
                    	var question_name = this.element.attr("name");
                    	question.qid = parseInt(question_name.split("question")[1]);
                    	question.lat = parseFloat(this.element.attr("data-lat"));
                    	question.lon = parseFloat(this.element.attr("data-lon"));
                    	question.qtext = this.element.find(".qtext").html();
                    	
                    	this.element.find(".qanswer").each(function(i){
                    		var answer = new Object();
                    		answer.id = parseInt($(this).attr("id").split("answer")[1]);
                    		answer.correct = $(this).attr("data-correct");
                    		answer.atext = $(this).find(".qanswer-input").html();
                    		
                    		question.answers.push(answer);
                    	});
                    	
                    	this.model = question;
                    	
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
                            question.nextquestionid = data.id;
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
                set_question : function(question){
                    this.model.qid = question.qid;
                    this.model.nextquestionid = question.nextquestionid;
                    this.model.quizid = question.quizid;
                    this.model.qtext = question.qtext;
                    this.model.answers = question.answers;
                },
                clean : function(){
                	this.element.find(".qanswer").each(function(){
                		this.remove();
                	});
                	this.model.clean();
                	this.element.find(".qtext").attr("value", this.model.qtext);
                },
                ".add-checked click" : function(el){
                    var correct = this.model.correct;
                    if( correct === 'F'){
                        correct = 'T';
                        el.children("i:first").
                            removeClass("icon-ban-circle").
                            addClass("icon-ok");
                    }else{
                        correct = 'F';
                        el.children("i:first").
                            addClass("icon-ban-circle").
                            removeClass("icon-ok");
                    }
                    this.model.correct = correct;
                },
                ".qanswer-check click" : function(el){
                    var id = parseInt(el.closest(".qanswer").attr("id").split("answer")[1]);
                    var answer = this.model.get_answer_by_id(id);
                    var correct = answer.correct;
                    if( correct === 'F'){
                        correct = 'T';
                        el.children("i:first").
                            removeClass("icon-ban-circle").
                            addClass("icon-ok");
                    }else{
                        correct = 'F';
                        el.children("i:first").
                            addClass("icon-ban-circle").
                            removeClass("icon-ok");
                    }
                    answer.correct = correct;
                },
                ".qanswer-delete click" : function(el){
                    var id = parseInt(el.closest(".qanswer").attr("id").split("answer")[1]);
                    this.model.remove_answer_by_id(id);
                    el.closest(".qanswer").remove();
                },
                ".qanswer-add click" : function(el){
                    var answers = this.model.answers;
                    if(answers.length < 7){
                        var maxid = 0;
                        for(var i = 0; i < answers.length; i++){
                            if( maxid < answers[i].id ){
                                maxid = answers[i].id;
                            }
                        }
                        maxid++;

                        var answer = {};
                        answer.id = maxid;
                        answer.correct = 'T';


                        answer.atext = "";

                        this.model.answers.push(answer);

                        this.element.find(".answers").append(this.view('answer', {answer: answer}));
                        this.element.find(".add-input").attr("value", "");
                    }else{
                    	Messenger().post({
  	              		  message: "The number of answers is restricted to 7 to keep your performance high",
  	              		  type : 'error',
  	              		  showCloseButton: true
  	              		});
                    }
                },
                ".qanswer-input keyup" : function(el){
                    var id = parseInt(el.closest(".qanswer").attr("id").split("answer")[1]);
                    this.model.get_answer_by_id(id).atext = el.attr("value") ;
                },
                ".question-save click" : function(data){
                    var question = this.model;
                    question.save( function(){
                        Messenger().post({
                    		  message: 'Successfully saved',
                    		  showCloseButton: true
                    		});                   
                    });
                },
                ".question-view-btn click" : function(el){
                    document.location.href = '/quiz/'+this.model.quizid+'/';
                },
                ".qtext keyup" : function(el){
                    this.model.qtext = el.attr("value") ;
                },
                onQuestionEnter : function(){
                	
                },
                onQuestionLeave : function(){
                	
                }
            });
    });