steal(
	'./enigma53.css', 			// application CSS file
	'./models/models.js',		// steals all your models
	'./fixtures/fixtures.js',	// sets up fixtures for your models
	'enigma53/question/create',
	'enigma53/question/list',
	function(){					// configure your application
		
		$('#questions').enigma53_question_list();
		$('#create').enigma53_question_create();
})