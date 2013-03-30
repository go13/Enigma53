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
                   // this.element.remove();
                        //.find(".question-edit")
                        //.questionpage_question_edit();
                }

                /*".question-tab click" : function(el){
                    var tab = this.element.find(".tab-content > .active").find(".question-item, .question-edit").each(function() {
                        $(this).empty();
                    });
                    var tab_id = el.children("a").attr("href").split("#")[1];
                    var q_id = tab_id.split("tab-question")[1];
                    tab = this.element.find("#"+tab_id);
                    //tab.html("<div class='question-item' name='question"+q_id+"'></div>");

                    tab.find(".question-item").questionpage_question_item();
                    tab.find(".question-edit").questionpage_question_edit();
                }*/
            });
    });