steal(        
    'quizpage/quiz/quizlist',
    
    'quizpage/quiz/listitem',
    
    'quizpage/quizmap/cmaplist',

    'quizpage/models',

    'js/d3.v3.min.js',
    
    function(){					// configure your application
        $("#question-map").quizpage_quizmap_cmaplist(); //???

    	$(".quiz-list-container").quizpage_quiz_quizlist({onSuccess : function (listitems){
    		Quizpage.Quizmap.Cmaplist.loadPoints(listitems);    		
    	}});
    })