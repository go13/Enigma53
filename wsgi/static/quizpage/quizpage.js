steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',

    'questionpage/models/models.js',
    'questionpage/question/item',

    'pagemessage/message/item',
    function(){					// configure your application    
    	$("#quiz-navigator").quizpage_quiz_navigator({ onSuccess : function(quizid){
        	$(".question-item").each(function(i){
        		Quizpage.Quiz.Navigator.load_question_item(this);        		
        	});
        }});        
    })