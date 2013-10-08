steal('jquery/controller',
    'quizpage/quiz/navigator',
    'pagedown/Markdown.js',
    'resultpage/question/cquestionresult').then(function($){
	Quizpage.Quiz.Navigator('Quizpage.Quiz.Cpublicquiz', {

            instance: null,
            converter: null,

            load_jsdata_item : function(el, success){
                var qc = new Questionpage.Question.Publicitem($(el), {onSuccess : function(qst){
                    var nav = Quizpage.Quiz.Navigator.instance;
                    nav.model.add_question(qst);
                    Quizpage.Quizmap.Cmap.addPoint(qst);
                    if(success){
                         success(qst);
                    }
                }});
            }
        },{
            to_next_unanswered_question : function(){
                var navigator = Quizpage.Quiz.Navigator.instance;

                var el = navigator.element.find("#tabs > .question-tab.active");
                if(el !== null){

                    var id = parseInt(el.attr("id").split("tab-question")[1]);

                    var unanswered = null;

                    var hasUnansweredAfterMe = false;
                    var afterMe = false;

                    var model = navigator.model;

                    for(var i=0; i < model.questions.length; i++){
                        if(afterMe){
                            if(!model.questions[i].answered){
                                unanswered = model.questions[i];
                                hasUnansweredAfterMe = true;
                                break;
                            }
                        }else{
                            if(model.questions[i].id === id){
                                afterMe = true;
                            }else{
                                if(!model.questions[i].answered && unanswered === null){
                                    unanswered = model.questions[i];
                                }
                            }
                        }
                    }
                    if(unanswered !== null){
                        Quizpage.Quiz.Navigator.to_tab_by_id(unanswered.id);
                        Quizpage.Quizmap.Cmap.offsetCenter(unanswered.lat, unanswered.lon)
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            },
            init : function(){
                this._super();

                this.converter = Markdown.getSanitizingConverter();
                var onSuccess = this.options.onSuccess;

                Quizpage.Quiz.Cpublicquiz.instance = this;

                var n = 0;

                var els = this.element.find(".question-item");
                $(els).each(function(i){
                    Quizpage.Quiz.Cpublicquiz.load_jsdata_item(this , function(qst){
                        if(i === 0){
                            Quizpage.Quizmap.Cmap.offsetCenter(qst.lat, qst.lon);
                        }
                        n++;
                        if(els.length === n){
                            if(onSuccess){
                                onSuccess();
                            }
                        }
                    });
                });
            },
            show_question_results : function(){
                this.element.find(".show-quiz").hide();
                this.element.find(".show-results").show();

                var correct_num = 0;
                var all_results = $("");
                for(var i = 0; i < this.model.questions.length; i++){
                    if(i < this.model.questions.length - 1){
                        this.model.questions[i].nextquestionid = this.model.questions[i + 1].id;
                    }else{
                        this.model.questions[i].nextquestionid = null;
                    }
                    if(i > 0){
                        this.model.questions[i].prevquestionid = this.model.questions[i - 1].id;
                    }else{
                        this.model.questions[i].prevquestionid = null;
                    }
                    var question_result = Resultpage.Question.Cquestionresult
                                                .add_question_result(this.model.questions[i]);
                    all_results = all_results.add(question_result.element);
                    if(this.model.questions[i].correct == 'T'){
                        correct_num++;
                    }
                }
                this.element.find("#question-results").append(all_results);
                if(correct_num === this.model.questions.length){
                    this.element.find("#quiz-result-summary-correct").html("<b>Success!</b> Correct answers/Number of questions = " + correct_num + "/" + this.model.questions.length);
                    this.element.find("#quiz-result-summary-correct").show();
                }else{
                    this.element.find("#quiz-result-summary-wrong").html("<b>Some answers were wrong or missed!</b> Correct answers/Number of questions = " + correct_num + "/" + this.model.questions.length);
                    this.element.find("#quiz-result-summary-wrong").show();
                }

                $("#content-on-map").scroll(function() {
                    Resultpage.Question.Cquestionresult.instance.onScroll();
                });
            },
            "#finish-public-quiz-btn click" : function(){
                this.show_question_results();
            }
    });
});