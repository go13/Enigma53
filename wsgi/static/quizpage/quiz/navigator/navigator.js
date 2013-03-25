steal( 'jquery/controller',
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'quizpage/models',
//    'quizpage/quiz/item',
    'questionpage/question/item',
    'questionpage/question/edit'
    ).then(function($){

        $.Controller('Quizpage.Quiz.Navigator',
            /** @Prototype */
            {
                init : function(){
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