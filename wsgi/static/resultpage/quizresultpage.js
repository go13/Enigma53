steal('resultpage/models/models.js',

	'resultpage/question/cquestionresult',

	'resultpage/map/cresultmap',
    
    function(){	// configure your application

    	$(".question-result").resultpage_question_cquestionresult();

    	$("#result-map").resultpage_map_cresultmap();

	})