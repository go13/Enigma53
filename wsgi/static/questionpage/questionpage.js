steal(
    //'questionpage/questionpage.css', 			// application CSS file
    'questionpage/models/models.js',		// steals all your models
    'questionpage/fixtures/fixtures.js',	// sets up fixtures for your models
    'questionpage/question/item',
    function(){					// configure your application
        $('#question').questionpage_question_item();
    })