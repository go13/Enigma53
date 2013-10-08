steal('jquery/controller', 'jquery/view/ejs').then(function($){
	    	
		$.Controller('Quizpage.Quiz.Quizlist', {
	    },{     
	    	listitems : null,
	    
	    	init : function(){
	    		var self = this;
	    		this.listitems = [];
	    		var onSuccess = this.options.onSuccess;
	    		var els = this.element.find(".quiz-list-item");	    		
	    		
            	$(els).each(function(i){
            		$(this).quizpage_quiz_listitem({onSuccess : function(listitem){            			
            			
            			self.listitems.push(listitem);
            			
            			if(onSuccess && (i === els.length - 1)){
            				onSuccess(self.listitems);
            			}
            		}});            		
            	});
	    	},
            "#create-question-btn click": function(){
                var item = new Listitem();
                item.create(function(quizid){
                    window.location.href='/quiz/' + quizid + '/';
                });
            }
	    });        
});