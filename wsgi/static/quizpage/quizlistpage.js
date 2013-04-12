steal(
    'quizpage/quiz/listitem',
    'pagemessage/message/item',
    function(){					// configure your application
        $(".quiz-list-item").quizpage_quiz_listitem();
        $(".page-message").pagemessage_message_item();
    })