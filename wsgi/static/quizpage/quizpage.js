steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',

    'questionpage/models/models.js',
    'questionpage/question/item',

    'pagemessage/message/item',
    function(){					// configure your application
        $("#quiz-navigator").quizpage_quiz_navigator();

        $(".question-item").each(function(i){
            Quizpage.Quiz.Navigator.load_question_item(this, function(qst){
    			if(i === 0){
                	Quizpage.Quiz.Navigator.to_tab_by_id(qst.qid, true);
                }	
    		});
        });
        $(".page-message").pagemessage_message_item();
    })