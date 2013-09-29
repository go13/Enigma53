steal('resultpage/models/models.js',

	'resultpage/question/cquestionresult',

	'resultpage/map/cresultmap',

    function(){	// configure your application
        $(".question-result").each(function(i){
           Resultpage.Question.Cquestionresult.add_question_result_from_jsdata(this);
        });

    	$("#question-map").resultpage_map_cresultmap();
	})