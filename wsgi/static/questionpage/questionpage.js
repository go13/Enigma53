steal(
    'questionpage/models/models.js',		// steals all your models
    'questionpage/question/item',
    'questionpage/question/edit',
    'questionpage/question/result',
    function(){					// configure your application
        $('.question-item').questionpage_question_item();
        $('.question-edit').questionpage_question_edit();
    })