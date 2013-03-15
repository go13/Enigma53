steal('jquery/model', function(){

$.Model('Question',
/* @Static */
{
    findAll: "/questions.json",
    findOne : "/question/jget/{id}",
    create : "/questions.json",
    update : "/questions/{id}.json",
    destroy : "/questions/{id}.json"
},
    {});

});