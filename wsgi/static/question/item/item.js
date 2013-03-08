steal( 'jquery/controller',
       'jquery/view/ejs',
	   'jquery/dom/form_params',
	   'jquery/controller/view',
	   'enigma53/models' )
	.then('./views/init.ejs', function($){

/**
 * @class Enigma53.Question.Item
 * @parent index
 * @inherits jQuery.Controller
 * Creates questions
 */
$.Controller('Enigma53.Question.Item',
/** @Prototype */
{
	init : function(){
		this.element.html(this.view());
	},
	submit : function(el, ev){
		ev.preventDefault();
		this.element.find('[type=submit]').val('Creating...')
		new Enigma53.Models.Question(el.formParams()).save(this.callback('saved'));
	},
	saved : function(){
		this.element.find('[type=submit]').val('Create');
		this.element[0].reset()
	},
})

});