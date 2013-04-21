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

                    Quizpage.Quiz.Navigator.instance.model.remove_question_by_id(qid);
                },
                to_next_tab : function(){
                    var navigator = Quizpage.Quiz.Navigator.instance;
                    var el = navigator.element.find("#tabs > .question-tab.active");
                    if(el.next().length > 0){
                        el.removeClass("active");
                        el.next().addClass("active");

                        el = navigator.element.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");
                        el.next().addClass("active");

                        el = el.next();

                        var qid = parseInt(el.attr("id").split("tab-question-page")[1]);
                        navigator.model.set_current_question_by_id(qid);
                    }
                },
                to_prev_tab : function(){
                    var navigator = Quizpage.Quiz.Navigator.instance;
                    var el = navigator.element.find("#tabs > .question-tab.active");
                    if(el.prev().length>0){
                        el.removeClass("active");
                        el.prev().addClass("active");

                        el = navigator.element.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");
                        el.prev().addClass("active");

                        el = el.prev();

                        var qid = parseInt(el.attr("id").split("tab-question-page")[1]);
                        navigator.model.set_current_question_by_id(qid);
                    }
                },
                to_tab_by_id : function(qid){
                    var navel = Quizpage.Quiz.Navigator.instance.element;
                    var el = navel.find("#tabs > .question-tab.active");
                    if(el){
                        var tab_id_string = el.attr("id").split("tab-question")[1];
                        if(tab_id_string != qid){
                            el.removeClass("active");

                            el = navel.find("#tabs > #tab-question"+qid);
                            el.addClass("active");

                            el = navel.find("#tabs-container > .tab-pane.active");
                            el.removeClass("active");

                            el = navel.find("#tabs-container > #tab-question-page"+qid);
                            el.addClass("active");
                            var qid_num = parseInt(qid);
                            Quizpage.Quiz.Navigator.instance.model.set_current_question_by_id(qid_num);
                        }
                    }
                }
            },{
                init : function(){
                    var quiz_name = this.element.attr("name");
                    var quizid = parseInt(quiz_name.split("quiz")[1]);
                    Quizpage.Quiz.Navigator.instance = this;
                    this.model = new Navigator({quizid : quizid});
                },
                ".question-next click" : function(){
                    Quizpage.Quiz.Navigator.to_next_tab();
                },
                ".question-back click" : function(){
                    Quizpage.Quiz.Navigator.to_prev_tab();
                }/*,
                ".quiz-finish-btn click" : function(){
                    var quizid = Quizpage.Quiz.Navigator.instance.model.quizid;
                    $.ajax({
                        type: "POST",
                        url: "/quiz/jfinishsession/"+quizid+"/",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify("finish-session"),
                        success :  function(){
                            document.location.href = '/quiz/'+quizid+'/home/';
                        },
                        error: function (error){
                            alert("There was an error posting the data to the server: " + error.responseText);
                        }
                    });
                }*/
            });
    });