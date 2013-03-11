steal('jquery/model', function(){

/**
 * @class Enigma53.Models.Question
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend question services.  
 */
$.Model('Enigma53.Models.Question',
/* @Static */
{
	findAll: "/questions.json",
  	findOne : "/questions/{id}.json", 
  	create : "/questions.json",
 	update : "/questions/{id}.json",
  	destroy : "/questions/{id}.json"
},
/* @Prototype */
{});

})