steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',

    'questionpage/models/models.js',
    'questionpage/question/item',

    'pagemessage/message/item',
    function(){					// configure your application
        $("#quiz-navigator").quizpage_quiz_navigator();

        $(".question-item").each(function(){
            Quizpage.Quiz.Navigator.load_question_item(this);
        });
        $(".page-message").pagemessage_message_item();
    })