steal(
    'quizpage/models/models.js',		// steals all your models

    'questionpage/models/models.js',
    'questionpage/question/publicitem',
    'quizpage/quizmap/cmap',
    'quizpage/quiz/cpublicquiz',

    function(){					// configure your application
    	
    	$("#question-map").quizpage_quizmap_cmap();

    	$("#quiz-navigator").quizpage_quiz_cpublicquiz({onSuccess : function (){
    		Quizpage.Quizmap.Cmap.loadPoints();
    	}});

    	Messenger.options = {
         		extraClasses: 'messenger-fixed messenger-on-bottom',
         		maxMessages: 3,
         		theme: 'air'
        };

    });