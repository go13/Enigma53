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
    	
        $("#quiz-navigator").quizpage_quiz_navigator();
        
        $("#content-on-map").quizpage_quiz_cquizedit();
        
        $(".question-edit").each(function(i){
        		Quizpage.Quiz.Navigator.load_question_edit(this, function(qst){
        			if(i === 0){
                    	Quizpage.Quiz.Navigator.to_tab_by_id(qst.qid, true);
                    }	
        		});        		
        });
        
        $(".page-message").pagemessage_message_item();        
    })