steal('jquery/controller', 'jquery/view/ejs').then(function($){

    $.Controller('Quizpage.Quiz.Listitem', {
    },{        
    	lat : null,
    	lon : null,
    	gmarker : null,
    	
    	init : function(){
    		var onSuccess = this.options.onSuccess;
    		
    		this.lat = parseFloat(this.element.attr("data-lat"));
    		this.lon = parseFloat(this.element.attr("data-lon"));
    		    		
    		if(onSuccess){
    			onSuccess(this);
    		}
    	},
    	".quiz-list-item click" : function(){
    		alert('ok');	
    	}    
    });    
        
});