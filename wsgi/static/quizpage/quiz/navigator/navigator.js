steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
    ).then(function($){

        $.Controller('Quizpage.Quiz.Navigator',
            /** @Prototype */
            {
                instance : null,
                default : {
                    model: null
                },
                create_question : function(question){

                },
                add_question_edit : function(question){
                    Quizpage.Quiz.Navigator.instance.element.find("#tabs")
                        .append("<li id='tab-question" + question.qid + "' class='question-tab'>" +
                            "<a href='#tab-question-page" + question.qid + "' data-toggle='tab'>Question " + question.qid + "</a>" +
                            "</li>");
                    Quizpage.Quiz.Navigator.instance.element.find("#tabs-container")
                        .append("<div id='tab-question-page" + question.qid + "' class='tab-pane'>" +
                            "<div class='question-edit' name='question" + question.qid + "'></div>" +
                            "</div>");
                    var el = Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page" + question.qid)
                        .children(".question-edit :first");

                    el.questionpage_question_edit({type:"add", question:question});
                    Quizpage.Quiz.Navigator.instance.model.add_question(question);
                },
                load_question_item : function(el){
                    var qc = new Questionpage.Question.Item($(el));
                    Quizpage.Quiz.Navigator.instance.model.add_question(qc.model);
                },
                load_question_edit : function(el){
                    var qc = new Questionpage.Question.Edit($(el));
                    Quizpage.Quiz.Navigator.instance.model.add_question(qc.model);
                },
                remove_question_by_id : function(qid){
                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question"+qid).remove();
                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page"+qid).remove();

                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question-new").addClass("active");
                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page-new").addClass("active");

                    Quizpage.Quiz.Navigator.instance.model.remove_question(qid);
                }
            },{
                init : function(){
                    var quiz_name = this.element.attr("name");
                    var quizid = parseInt(quiz_name.split("quiz")[1]);
                    Quizpage.Quiz.Navigator.instance = this;
                    this.model = new Navigator({quizid : quizid});
                },
                ".question-next click" : function(){
                    var el = this.element.find("#tabs > .question-tab.active");
                    if(el.next().length>0){
                        el.removeClass("active");
                        el.next().addClass("active");

                        el = this.element.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");
                        el.next().addClass("active");
                    }
                },
                ".question-back click" : function(){
                    var el = this.element.find("#tabs > .question-tab.active");
                    if(el.prev().length>0){
                        el.removeClass("active");
                        el.prev().addClass("active");

                        el = this.element.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");
                        el.prev().addClass("active");
                    }
                }
            });
    });