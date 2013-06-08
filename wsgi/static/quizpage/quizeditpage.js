steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',

    'questionpage/models/models.js',
    'questionpage/question/edit',

    'pagemessage/message/item',
    
    'quizpage/quiz/cquizedit',
    
    //'libs/lib.js',
    
    'libs/d3.v3.min.js',
    
    //'libs/jquery.timeago.js',
    
    function(){					// configure your application
        $("#quiz-navigator").quizpage_quiz_navigator({ onSuccess : function(quizid){
        	$(".question-edit").each(function(i){
        		Quizpage.Quiz.Navigator.load_question_edit(this);        		
        	});
        	$("#content-on-map").quizpage_quiz_cquizedit({ quizid : quizid });
        }});
        
        $(".page-message").pagemessage_message_item();        
    })