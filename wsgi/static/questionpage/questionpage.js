steal(
    //'questionpage/questionpage.css', 			// application CSS file
    'questionpage/models/models.js',		// steals all your models
    //'questionpage/fixtures/fixtures.js',	// sets up fixtures for your models
    'questionpage/question/item',
    'questionpage/question/edit',
    //'questionpage/question/router',
    function(){					// configure your application
        $('#question').questionpage_question_item();
        $('#question-edit').questionpage_question_edit();
        //$(document).questionpage_question_router();
    })