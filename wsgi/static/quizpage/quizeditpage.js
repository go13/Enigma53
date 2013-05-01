steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',

    'questionpage/models/models.js',
    'questionpage/question/edit',

    'pagemessage/message/item',
    'questionmap/questionmap/cquestionmap',
    
    function(){					// configure your application
        $("#quiz-navigator").quizpage_quiz_navigator();
        
        Quizpage.Quiz.Navigator.load_question_new($(".question-new"));
        
        $(".question-edit").each(function(){
            Quizpage.Quiz.Navigator.load_question_edit(this);
        });
        
        $(".page-message").pagemessage_message_item();
    })