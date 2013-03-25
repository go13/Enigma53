steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',
    function(){					// configure your application
        $('#quiz-navigator').quizpage_quiz_navigator();
        $(".question-item").questionpage_question_item();
        $(".question-edit").questionpage_question_edit();
    })