steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',

    'questionpage/models/models.js',
    'questionpage/question/item',
    'questionpage/question/edit',

    'pagemessage/message/item',
    function(){					// configure your application
        $("#quiz-navigator").quizpage_quiz_navigator();

        $(".question-new").questionpage_question_edit({type:"new",
            quizid:Quizpage.Quiz.Navigator.instance.model.quizid});

        $(".question-item").each(function(){
            Quizpage.Quiz.Navigator.load_question_item(this);
        });
        $(".question-edit").each(function(){
            Quizpage.Quiz.Navigator.load_question_edit(this);
        });
        $(".page-message").pagemessage_message_item();
    })