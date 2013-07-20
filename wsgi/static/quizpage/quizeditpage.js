steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',

    'questionpage/models/models.js',
    'questionpage/question/edit',

    'quizpage/quiz/cquizedit',
    
    'quizpage/quizmap/cmapedit',
    
    'quizpage/csettings',   
    
    'js/d3.v3.min.js',    

    //'libs/jquery.timeago.js',
    
    function(){	// configure your application
    	$("#question-map").quizpage_quizmap_cmapedit();
    	    	
    	$("#quiz-navigator").quizpage_quiz_cquizedit({onSuccess : function (){
    		Quizpage.Quizmap.Cmapedit.loadPoints();    		
    	}});
    	
    	$("#tab-settings").quizpage_csettings();
    	
        Messenger.options = {
        		extraClasses: 'messenger-fixed messenger-on-bottom',
        		'maxMessages': 3,
        		theme: 'air'
        };
})