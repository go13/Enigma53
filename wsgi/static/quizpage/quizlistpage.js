steal(
    'quizpage/quiz/listitem',  
    'quizpage/quiz/quizlist',
    'pagemessage/message/item',    
    function(){					// configure your application
        $(".quizpage_quiz_listitem").quizpage_quiz_listitem();
        $(".page-message").pagemessage_message_item();
        $(".quiz-list-container").quizpage_quiz_quizlist();
    })