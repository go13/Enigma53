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
        to_next_unanswered_question : function(){
            var navigator = Quizpage.Quiz.Navigator.instance;

            var el = navigator.element.find("#tabs > .question-tab.active");
            if(el !== null){

                var id = parseInt(el.attr("id").split("tab-question")[1]);

                var unanswered = null;

                var hasUnansweredAfterMe = false;
                var afterMe = false;

                var model = navigator.model;

                for(var i=0; i < model.questions.length; i++){
                    if(afterMe){
                        if(!model.questions[i].answered){
                            unanswered = model.questions[i];
                            hasUnansweredAfterMe = true;
                            break;
                        }
                    }else{
                        if(model.questions[i].id === id){
                            afterMe = true;
                        }else{
                            if(!model.questions[i].answered && unanswered === null){
                                unanswered = model.questions[i];
                            }
                        }
                    }
                }
                if(unanswered !== null){
                    Quizpage.Quiz.Navigator.to_tab_by_id(unanswered.id);
                    Quizpage.Quizmap.Cmap.offsetCenter(unanswered.lat, unanswered.lon)
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        },
    	init : function(){
    		this._super();

    		var onSuccess = this.options.onSuccess;

    		var n = 0;

    		var els = this.element.find(".question-item");
            $(els).each(function(i){
            	Quizpage.Quiz.Cquiz.load_question_item(this , function(qst){
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