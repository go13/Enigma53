steal( 'jquery/controller',
		'jquery/view/ejs',
	    'quizpage/quiz/listitem')
	    .then(function($){
	$.Controller('Quizpage.Quiz.Quizlist',
        {
        },{
        	quiztitle : "",
        	
        	init : function(){        		
        	},
        	
	        ".quiz-list-create click" : function(){
	        	var c = this;
	        	var qlist = this.element.find(".quiz-list-table");
	        	Quizpage.Quiz.Listitem.create(this.quiztitle, function(model, el){
	        		qlist.prepend(el);	
	        	});	        	
	        },
	        
	        ".input-quiz-list keyup" : function(el){
	        	this.quiztitle = el.attr("value");
            },
        });        
});