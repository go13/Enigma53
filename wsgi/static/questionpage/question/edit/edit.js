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
                    
                    if(type === "new"){
                        this.model = new Questionedit();
                        this.model.isNew = true;
                        this.model.quizid = this.options.quizid;                        
                        //this.set_question(this.options.question);
                        this.element.html(this.view('init', this.model));
                    }else if(type === "add"){
                        this.model = this.options.question;//new Questionedit();
                        //this.model.set_question(this.options.question);
                        this.element.html(this.view('init', this.model));
                    }else{
                        var question_name = this.element.attr("name");
                        this.model = new Questionedit();
                        var question = this.model;

                        this.model.isNew = false;
                        var id = parseInt(question_name.split("question")[1]);
                        
                        this.element.html(this.view('init', Questionedit.findOne({id:id}, function(data){
                            question.qid = data.id;
                            question.nextquestionid = data.id;
                            question.quizid = data.quizid;
                            question.qtext = data.qtext;
                            question.answers = data.answers;
                            question.lon = parseFloat(data.lon);
                            question.lat = parseFloat(data.lat);
                            
                            if(onSuccess != null){
                            	onSuccess(question);
                            }

                            console.log( "received a question:" );
                            console.log( "id - " + data.id );
                            console.log( "quizid - " + data.quizid );
                            console.log( "qtext - " + data.qtext );
                            console.log( "nextquestionid - " + data.nextquestionid );
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
                    var maxid = 0;
                    for(var i=0; i < answers.length; i++){
                        if( maxid < answers[i].id ){
                            maxid = answers[i].id;
                        }
                    }
                    maxid++;

                    var answer = {};
                    answer.id = maxid;
                    answer.correct = this.model.correct;

                    var atext = this.model.atext;

                    if(!atext || /^\s*$/.test(atext)){
                        answer.atext = "";
                    }else{
                        answer.atext = atext;
                    }

                    this.model.answers.push(answer);

                    this.element.find(".answers").append(this.view('answer', {answer: answer}));
                    this.element.find(".add-input").attr("value", "");
                    this.model.atext = "";
                    
                    if(this.model.correct === "F"){
                    	this.element.find(".add-checked").find(".icon-ban-circle").removeClass("icon-ban-circle").addClass("icon-ok");
                    	this.model.correct = "T";
                    }
                },
                ".add-input keyup" : function(el){
                    this.model.atext = el.attr("value") ;
                },
                ".qanswer-input keyup" : function(el){
                    var id = parseInt(el.closest(".qanswer").attr("id").split("answer")[1]);
                    this.model.get_answer_by_id(id).atext = el.attr("value") ;
                },
                ".question-save click" : function(data){
                    var question = this.model;
                    question.save( function(){
                        Pagemessage.Message.Item.show_message("Success", "Saved");
                    });
                },
                ".question-create-old click" : function(data){                	
                    var question = this.model;  //jQuery.extend(true, {}, this.model);;

       			    var pos = window.currentLocation;
       			    
       			    if(pos != null){
	                	
	                	question.lat = pos.jb.toString();
	                	question.lon = pos.kb.toString();
	                	
	                	question.marker = window.currentMapMarker;
	                	
	                    question.create( function(data){
	                        var newQuestion = question.to_object();
	                        newQuestion.qid = data.qid;
	
	                        Quizpage.Quiz.Navigator.add_question_edit(newQuestion);
	                        Pagemessage.Message.Item.show_message("Success", "Created");
	                    });
	                    
	                    window.currentLocation = null;
       			    }else{
       			    	alert("Please select a location for this question on the map");
       			    }
                },
                ".question-delete-btn-old click" : function(){
                    var question = this.model;
                    question.destroy(function(data){
                        Quizpage.Quiz.Navigator.remove_question_by_id(question.qid);
                        Pagemessage.Message.Item.show_message("Success", "Deleted");
                    })
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