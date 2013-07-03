steal('jquery/controller').then(function($){
	$.Controller('Resultpage.Quiz.Cquizresult', {
		questionresults : [],
		addQuestion : function(question){
			this.questionresults.push(question);							
		}
    },{          	
    	init : function(){        	
    	}
    });
});