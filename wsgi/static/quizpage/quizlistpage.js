steal(        
    'quizpage/quiz/quizlist',
    
    'quizpage/quiz/listitem',
    
    'quizpage/quizmap/cmaplist',
    
    function(){					// configure your application
    	$(".quiz-list-container").quizpage_quiz_quizlist({onSuccess : function (listitems){
    		Quizpage.Quizmap.Cmaplist.loadPoints(listitems);    		
    	}});
        
        $("#question-map").quizpage_quizmap_cmaplist();
    })