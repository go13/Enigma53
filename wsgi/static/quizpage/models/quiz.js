steal('jquery/model', function(){
    $.Model('Quiz',
    /* @Static */
    {
        defaults : {
            id : 0,
            title : "",
            description : "",
            questions : []
        },
        findAll: "/questions.json",
        findOne : "/quiz/jget/{id}/",
        create : "/questions.json",
        destroy : "/questions/{id}.json"
    },{

    });
});