steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models',
    'questionpage/question/item',
    
    'pagedown/Markdown.js').then('//questionpage/question/item/views/init.ejs', function($){
    	
        Questionpage.Question.Item('Questionpage.Question.Publicitem', {

            },{
                ".question-submit-btn click" : function(el){
                    this.model.answered = true;
                    var r = Quizpage.Quiz.Navigator.instance.to_next_unanswered_question();
                    if (!r && (confirm("Do you want to finish the quiz?") == true)){
                        alert("todo");
                    }
                }
            });
    });