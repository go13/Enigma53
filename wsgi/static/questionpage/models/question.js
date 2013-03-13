steal('jquery/model', function(){

/**
 * @class Questionpage.Models.Question
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend question services.  
 */
$.Model('Question', //questionpage.Models.
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