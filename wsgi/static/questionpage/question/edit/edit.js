steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models')
    .then('./views/init.ejs',function($){

        $.Controller('Questionpage.Question.Edit',
            {

            },
            {
                model : null,

                init : function(){
                    this.model = new Questionedit();
                    var id = this.element.attr("name").split("question")[1];
                    var question = this.model;

                    this.element.html(this.view('init',Questionedit.findOne({id:id}, function(data){
                        question.qid = data.id;
                        question.nextquestionid = data.id;
                        question.quizid = data.quizid;
                        question.qtext = data.qtext;
                        question.answers = data.answers;

                        console.log( "received a question:" );
                        console.log( "id - " + data.id );
                        console.log( "quizid - " + data.quizid );
                        console.log( "qtext - " + data.qtext );
                        console.log( "nextquestionid - " + data.nextquestionid );
                    })));
                },
                ".add-checked click" : function(el){
                    var correct = this.model.correct;
                    if( correct == 0){
                        correct = 1;
                        el.children("i:first").
                            removeClass("icon-ban-circle").
                            addClass("icon-ok");
                    }else{
                        correct = 0;
                        el.children("i:first").
                            addClass("icon-ban-circle").
                            removeClass("icon-ok");
                    }
                    this.model.correct = correct;
                },
                ".qanswer-check click" : function(el){
                    //alert(el.attr("id"));
                    var id = el.closest(".qanswer").attr("id").split("answer")[1];
                    var answer = this.model.get_answer_by_id(id);
                    var correct = answer.correct;
                    if( correct == 0){
                        correct = 1;
                        el.children("i:first").
                            removeClass("icon-ban-circle").
                            addClass("icon-ok");
                    }else{
                        correct = 0;
                        el.children("i:first").
                            addClass("icon-ban-circle").
                            removeClass("icon-ok");
                    }
                    answer.correct = correct;
                },
                ".qanswer-delete click" : function(el){
                    var id = el.closest(".qanswer").attr("id").split("answer")[1];
                    this.model.remove_answer_by_id(id);
                    el.closest(".qanswer").remove();
                },
                ".qanswer-add click" : function(){
                    var answers = this.model.answers;
                    var maxid = 0;
                    for(var i=0; i<answers.length; i++){
                        if( maxid < answers[i].id ){
                            maxid = answers[i].id;
                        }
                    }
                    maxid++;

                    var answer = new Object();
                    answer.id = maxid;
                    answer.correct = this.model.correct;

                    var atext = this.model.atext;

                    if(!atext || /^\s*$/.test(atext)){
                        answer.atext = "Type your answer here...";
                    }else{
                        answer.atext = atext;
                    }

                    this.model.answers.push(answer);

                    this.element.find(".answers").prepend(this.view('answer', {answer: answer}));
                },
                ".add-input keyup" : function(el){
                    this.model.atext = el.attr("value") ;
                },
                ".qanswer-input keyup" : function(el){
                    var id = el.closest(".qanswer").attr("id").split("answer")[1];
                    this.model.get_answer_by_id(id).atext = el.attr("value") ;
                },
                ".question-submit click" : function(data){
                    var question = this.model; 
                    question.save( function(){
                        window.location.href = "/question/" + question.qid;
                    });
                },
                ".question-cancel click" : function(){
                    var question = this.model; 
                    window.location.href = "/question/" + question.qid;
                },
                ".qtext keyup" : function(el){
                    this.model.qtext = el.attr("value") ;
                }/*,
                ".question-tab click" : function(el){
                    alert("ok");
                }*/
            });
    });