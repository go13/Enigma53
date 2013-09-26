steal( 'jquery/controller', 'jquery/view/ejs', 'jquery/controller/view').then(function($){
        $.Controller('Quizpage.Quiz.Navigator',
            /** @Prototype */
            {
                instance : null,
                can_persist : true,

                defaults : {
                    model: null,
                    quizid : -1,
                    mnew_question : null,
                    cnew_question : null
                },
                to_next_tab : function(){
                    var navigator = Quizpage.Quiz.Navigator.instance;
                    var el = navigator.element.find("#tabs > .question-tab.active");
                    if(el.next().length > 0){
                        if(navigator.model.current_question){
                            navigator.model.current_question.hideInfoWindow();
                        }

                        el.removeClass("active");
                        el.next().addClass("active");

                        el = navigator.element.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");
                        el.next().addClass("active");

                        el = el.next();

                        var id = parseInt(el.attr("id").split("tab-question-page")[1]);
                        navigator.model.set_current_question_by_id(id);
                        var qst = navigator.model.get_question_by_id(id);

                        qst.showInfoWindow();

                        Quizpage.Quizmap.Cmap.offsetCenter(qst.lat, qst.lon);
                        return true;
                    }else{
                    	return false;
                    }                    
                },
                to_prev_tab : function(){
                    var navigator = Quizpage.Quiz.Navigator.instance;
                    var el = navigator.element.find("#tabs > .question-tab.active");
                    if(el.prev().length > 0){
                        if(navigator.model.current_question){
                            navigator.model.current_question.hideInfoWindow();
                        }

                        el.removeClass("active");
                        el.prev().addClass("active");

                        el = navigator.element.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");
                        el.prev().addClass("active");

                        el = el.prev();

                        var id = parseInt(el.attr("id").split("tab-question-page")[1]);
                        navigator.model.set_current_question_by_id(id);
                        var qst = navigator.model.get_question_by_id(id);

                        qst.showInfoWindow();

                        Quizpage.Quizmap.Cmap.offsetCenter(qst.lat, qst.lon);

                        return true;
                    }else{
                    	return false;
                    }   
                },
                to_tab_by_id : function(id, do_focus){
                    var navel = Quizpage.Quiz.Navigator.instance.element;
                    var navigator = Quizpage.Quiz.Navigator.instance;

                    if(navigator.model.current_question){
                        navigator.model.current_question.hideInfoWindow();
                    }

                    var el = navel.find("#tabs > .question-tab");
                    if(el){
                    	var ela = navel.find("#tabs > .question-tab.active");
                    	if(ela.length > 0){
                            var tab_id_string = ela.attr("id").split("tab-question-page")[1];
                            if(tab_id_string != id){
                                ela.removeClass("active");
                            }                    		
                    	}
                        el = navel.find("#tabs > #tab-question" + id);
                        el.addClass("active");

                        el = navel.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");

                        el = navel.find("#tabs-container > #tab-question-page" + id);
                        el.addClass("active");
                        var id_num = parseInt(id);
                        var qst = navigator.model.get_question_by_id(id);
                        qst.showInfoWindow();
                        if(do_focus){
	                        Quizpage.Quizmap.Cmap.offsetCenter(qst.lat, qst.lon);
                        }
                        navigator.model.set_current_question_by_id(id_num);
                    }
                },
                get_current_question_id : function(){
                    var navigator = Quizpage.Quiz.Navigator.instance;
                    var el = navigator.element.find("#tabs > .question-tab.active");
                    var idstr = el.attr("id");
                    idstr = idstr.split("tab-question")[1];
                    return parseInt(idstr);
                },
                get_current_question : function(){
                	var question = null;
                    var id = Quizpage.Quiz.Navigator.get_current_question_id();
                    if(!isNaN(id)){
                    	question = Quizpage.Quiz.Navigator.instance.model.get_question_by_id(id); 
                    }
                    return question;
               }
            },{
                init : function(){
                	var self = this;

                    var quiz_name = self.element.attr("name");
                    this.quizid = parseInt(quiz_name.split("quiz")[1]);                    
                    Quizpage.Quiz.Navigator.instance = self;
                    Quizpage.Quiz.Navigator.can_persist = jsdata.can_persist;

                    self.model = new Navigator({quizid : this.quizid});
                },
                ".question-next click" : function(){
                    Quizpage.Quiz.Navigator.to_next_tab();
                },
                ".question-back click" : function(){
                    Quizpage.Quiz.Navigator.to_prev_tab();
                },
                ".tab-question-item click" : function(el){
                    if(this.model.current_question){
                        this.model.current_question.hideInfoWindow();
                    }

                	var id = parseInt(el.attr("id").split("tab-question")[1]);
                    this.model.set_current_question_by_id(id);

                    var qst = this.model.get_question_by_id(id);

                    qst.showInfoWindow();

                    Quizpage.Quizmap.Cmap.offsetCenter(qst.lat, qst.lon);
                }
            });
    });