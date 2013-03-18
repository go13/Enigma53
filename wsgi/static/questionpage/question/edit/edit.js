steal( 'jquery/controller',
    'jquery/view/ejs',
    //'jquery/dom/form_params',
    //'jquery/controller/route',
    'jquery/controller/view',
    'questionpage/models')
    .then('./views/init.ejs',function($){
        //$.fixture.on = false;

        $.Controller('Questionpage.Question.Edit',
            {
                model : new Question()
            },
            {
                init : function(){
                    var id = $("#question-edit").attr("name").split("question")[1];
                    var question = Questionpage.Question.Edit.model;

                    this.element.html(this.view('init',Question.findOne({id:id}, function(data){
                        question.qid = data.id;
                        question.nextquestionid = data.id;
                        question.quizid = data.quizid;
                        question.qtext = data.qtext;
                        question.answers = data.answers;
                    })));
                },
                "#add-checked click" : function(el){
                    var correct = Questionpage.Question.Edit.model.correct;
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
                    Questionpage.Question.Edit.model.correct = correct;
                },
                ".qanswer-check click" : function(el){
                    //alert(el.attr("id"));
                    var id = el.closest(".qanswer").attr("id").split("answer")[1];
                    var answer = Questionpage.Question.Edit.model.get_answer_by_id(id);
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
                    Questionpage.Question.Edit.model.remove_answer_by_id(id);
                    el.closest(".qanswer").remove();
                },
                "#qanswer-add click" : function(){
                    var answers = Questionpage.Question.Edit.model.answers;
                    var maxid = 0;
                    for(var i=0; i<answers.length; i++){
                        if( maxid < answers[i].id ){
                            maxid = answers[i].id;
                        }
                    }
                    maxid++;

                    var answer = new Object();
                    answer.id = maxid;
                    answer.correct = Questionpage.Question.Edit.model.correct;

                    var atext = Questionpage.Question.Edit.model.atext;

                    if(!atext || /^\s*$/.test(atext)){
                        answer.atext = "Type your answer here...";
                    }else{
                        answer.atext = atext;
                    }

                    Questionpage.Question.Edit.model.answers.push(answer);

                    this.element.find("#answers").prepend(this.view('answer', {answer: answer}));
                },
                "#add-input keyup" : function(el){
                    Questionpage.Question.Edit.model.atext = el.attr("value") ;
                },
                ".qanswer-input keyup" : function(el){
                    var id = el.closest(".qanswer").attr("id").split("answer")[1];
                    Questionpage.Question.Edit.model.get_answer_by_id(id).atext = el.attr("value") ;
                },
                "#question-submit click" : function(data){
                    Questionpage.Question.Edit.model.save(function(data){
                        //alert(data);
                    });
                },
                "#question-cancel click" : function(){
                    //this.element.find(".answers").html(this.view('answer.ejs'));
                    alert("cancel");
                },
                "#qtext keyup" : function(el){
                    Questionpage.Question.Edit.model.qtext = el.attr("value") ;
                }
            });
    });