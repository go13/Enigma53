steal('jquery/controller', 'quizpage/quiz/navigator').then(function($){
	Quizpage.Quiz.Navigator('Quizpage.Quiz.Cquiz', {
        
		load_question_item : function(el, success){
            var qc = new Questionpage.Question.Item($(el), {onSuccess : function(qst){
                var nav = Quizpage.Quiz.Navigator.instance;
                nav.model.add_question(qc.model);
                Quizpage.Quizmap.Cmap.addPoint(qst);
                if(success){
                     success(qst);
                }
            }});
        }
    },{
    	init : function(){
    		this._super();

    		var onSuccess = this.options.onSuccess;
    		
    		var n = 0;
    		
    		var els = this.element.find(".question-item"); 
            $(els).each(function(i){
            	Quizpage.Quiz.Cquizedit.load_question_item(this , function(qst){
    				if(i === 0){
    					Quizpage.Quizmap.Cmap.offsetCenter(qst.lat, qst.lon);
    				}
    				n++;
    				if(els.length === n){
    	        		if(onSuccess){
    	        			onSuccess();	
    	        		}
    				}
        		});
        	});
    	}
    });        
});