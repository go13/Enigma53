steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'enigma53/models' )
.then( './views/init.ejs', 
       './views/question.ejs', 
       function($){

/**
 * @class Enigma53.Question.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists questions and lets you destroy them.
 */
$.Controller('Enigma53.Question.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Enigma53.Models.Question.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.question').model().destroy();
		}
	},
	"{Enigma53.Models.Question} destroyed" : function(Question, ev, question) {
		question.elements(this.element).remove();
	},
	"{Enigma53.Models.Question} created" : function(Question, ev, question){
		this.element.append(this.view('init', [question]))
	},
	"{Enigma53.Models.Question} updated" : function(Question, ev, question){
		question.elements(this.element)
		      .html(this.view('question', question) );
	}
});

});