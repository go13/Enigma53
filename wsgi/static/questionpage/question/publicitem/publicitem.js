steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models',
    'questionpage/question/item',
    
    'pagedown/Markdown.js').then('//questionpage/question/item/views/init.ejs', function($){
    	
        Questionpage.Question.Item('Questionpage.Question.Publicitem', {

            },{
                set_question : function(question){
                    this.model.id = question.id;
                    this.model.quizid = question.quizid;
                    this.model.qtext = question.qtext;
                    this.model.answers = question.answers;

                    this.model.lon = parseFloat(question.lon);
                    this.model.lat = parseFloat(question.lat);

                    this.model.answers.sort(function(a, b) { return a.id - b.id });

                    for(var i = 0; i < this.model.answers.length; i++){
                        this.model.answers[i].correct = question.answers[i].correct;
                        this.model.answers[i].value = 'F';
                    }
                },
                ".question-submit-btn click" : function(el){
                    this.model.answered = true;
                    var r = Quizpage.Quiz.Cpublicquiz.instance.to_next_unanswered_question();
                    if (!r && (confirm("Do you want to finish the quiz?") == true)){
                        Quizpage.Quiz.Cpublicquiz.instance.show_question_results();
                    }
                }
            });
    });