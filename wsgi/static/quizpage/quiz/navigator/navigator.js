steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
    ).then(function($){

        $.Controller('Quizpage.Quiz.Navigator',
            /** @Prototype */
            {
                instance : null,
                default : {                	
                    model: null,
                    mnew_question : null,
                    cnew_question : null,
                    new_marker : null
                },
                create_question : function(mk){
                    var qm = new Questionedit();
                    qm.quizid = Quizpage.Quiz.Navigator.instance.model.quizid;
                    qm.gmarker = mk;
                    qm.create(function(){
                    	Quizpage.Quiz.Navigator.add_question_edit(qm);
                        Quizpage.Quiz.Navigator.to_tab_by_id(qm.qid, true);
                        mk.question = qm;
                        Pagemessage.Message.Item.show_message("Success", "Created");
                    });                    
                    return qm;
                },
                add_question_edit : function(question){                	                	
                    Quizpage.Quiz.Navigator.instance.element.find("#tabs")
                        .append("<li id='tab-question" + question.qid + "' class='question-tab tab-question-edit'>" +
                            "<a href='#tab-question-page" + question.qid + "' data-toggle='tab'>Question " + question.qid + "</a>" +
                            "</li>");
                    Quizpage.Quiz.Navigator.instance.element.find("#tabs-container")
                        .append("<div id='tab-question-page" + question.qid + "' class='tab-pane' style='margin-right:20px'>" +
                            "<div class='question-edit' name='question" + question.qid + "'></div>" +
                            "</div>");
                    var el = Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page" + question.qid)
                        .children(".question-edit :first");
                    
                    var mc = new Questionpage.Question.Edit($(el), {type:"add", question : question, onSuccess : function(qst){
                    	Quizpage.Quiz.Navigator.instance.model.add_question(qst);
                    }});
                    Quizpage.Quiz.Navigator.instance.model.add_question(mc.model);
                    return mc.model; // returns question with id
                },                
                load_question_item : function(el){
                    var qc = new Questionpage.Question.Item($(el), {onSuccess : function(qst){
	                    Quizpage.Quiz.Navigator.instance.model.add_question(qc.model);
	                    qst.gmarker = window.addPoint(new google.maps.LatLng(qst.lat, qst.lon));
	                	qst.gmarker.question = qst;
                    }});
                },                
                load_question_edit : function(el, success){                	
                    var qc = new Questionpage.Question.Edit($(el), {onSuccess : function(qst){                    	
                    	Quizpage.Quiz.Navigator.instance.model.add_question(qst);             
                    	qst.gmarker = window.addPoint(new google.maps.LatLng(qst.lat, qst.lon));
                    	qst.gmarker.question = qst;
                    	if(success){
                    		success(qst);                    		
                    	}
                    }});
                },
                load_question_new : function(el){
                	var quizid = Quizpage.Quiz.Navigator.instance.model.quizid;
                    var qc = new Questionpage.Question.Edit($(el), {type : "new", quizid : quizid});
                    Quizpage.Quiz.Navigator.instance.mnew_question = qc.model;
                    Quizpage.Quiz.Navigator.instance.cnew_question = qc;
                },
                remove_question_by_id : function(qid){
                	var el = Quizpage.Quiz.Navigator.instance.element.find("#tab-question"+qid);
                	if(el.hasClass("active")){
                		if(!Quizpage.Quiz.Navigator.to_prev_tab()){
                			Quizpage.Quiz.Navigator.to_next_tab();
                		}
                	};                	
                    el.remove();
                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page"+qid).remove();

                    Quizpage.Quiz.Navigator.instance.model.remove_question_by_id(qid);
                },
                to_next_tab : function(){
                    var navigator = Quizpage.Quiz.Navigator.instance;
                    var el = navigator.element.find("#tabs > .question-tab.active");
                    if(el.next().length > 0){
                        el.removeClass("active");
                        el.next().addClass("active");

                        el = navigator.element.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");
                        el.next().addClass("active");

                        el = el.next();

                        var qid = parseInt(el.attr("id").split("tab-question-page")[1]);
                        navigator.model.set_current_question_by_id(qid);
                        var qst = navigator.model.get_question_by_id(qid);
                        window.offsetCenter(qst.gmarker.position);
                        return true;
                    }else{
                    	return false;
                    }                    
                },
                to_prev_tab : function(){
                    var navigator = Quizpage.Quiz.Navigator.instance;
                    var el = navigator.element.find("#tabs > .question-tab.active");
                    if(el.prev().length > 0){
                        el.removeClass("active");
                        el.prev().addClass("active");

                        el = navigator.element.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");
                        el.prev().addClass("active");

                        el = el.prev();

                        var qid = parseInt(el.attr("id").split("tab-question-page")[1]);
                        navigator.model.set_current_question_by_id(qid);
                        var qst = navigator.model.get_question_by_id(qid);
                        window.offsetCenter(qst.gmarker.position);
                        return true;
                    }else{
                    	return false;
                    }   
                },
                to_tab_by_id : function(qid, do_focus){
                    var navel = Quizpage.Quiz.Navigator.instance.element;
                    var navigator = Quizpage.Quiz.Navigator.instance;
                    var el = navel.find("#tabs > .question-tab");
                    if(el){
                    	var ela = navel.find("#tabs > .question-tab.active");
                    	if(ela.length > 0){
                            var tab_id_string = ela.attr("id").split("tab-question-page")[1];
                            if(tab_id_string != qid){
                                ela.removeClass("active");
                            }                    		
                    	}
                        el = navel.find("#tabs > #tab-question" + qid);
                        el.addClass("active");

                        el = navel.find("#tabs-container > .tab-pane.active");
                        el.removeClass("active");

                        el = navel.find("#tabs-container > #tab-question-page"+qid);
                        el.addClass("active");
                        var qid_num = parseInt(qid);
                        if(do_focus){
	                        var qst = navigator.model.get_question_by_id(qid);
	                        window.offsetCenter(qst.gmarker.position);
                        }
                        navigator.model.set_current_question_by_id(qid_num);
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
                    var qid = Quizpage.Quiz.Navigator.get_current_question_id();
                    if(!isNaN(qid)){
                    	question = Quizpage.Quiz.Navigator.instance.model.get_question_by_id(qid); 
                    }
                    return question;
               },
               onMapClick4Create : function(event, questionmap){
               	 var qm = new Questionedit();
                    qm.quizid = Quizpage.Quiz.Navigator.instance.model.quizid;
                    qm.gmarker = window.addPoint(event.latLng);
                    qm.gmarker.question = qm;
                    qm.lat = event.latLng.jb;
                    qm.lon = event.latLng.kb;
                    qm.create(function(){
                    	Quizpage.Quiz.Navigator.add_question_edit(qm);
                        Quizpage.Quiz.Navigator.to_tab_by_id(qm.qid, false);
                        Pagemessage.Message.Item.show_message("Success", "Created");
                    });                    
               },
               onMarkerClick : function(mk){
               		Quizpage.Quiz.Navigator.to_tab_by_id(mk.question.qid, false);
               },
               onMapClick4Edit : function(event, questionmap){
	               	 //alert('add handler!');                	
               },
               onMarkerMove : function(mk){
            	   mk.question.lat = mk.position.jb;
            	   mk.question.lon = mk.position.kb;
               	   Quizpage.Quiz.Navigator.to_tab_by_id(mk.question.qid, false);
               }
            },{
                init : function(){
                    var quiz_name = this.element.attr("name");
                    var quizid = parseInt(quiz_name.split("quiz")[1]);
                    Quizpage.Quiz.Navigator.instance = this;
                    this.model = new Navigator({quizid : quizid});
                    window.onMapClick = Quizpage.Quiz.Navigator.onMapClick4Create;
                    window.onMarkerClick = Quizpage.Quiz.Navigator.onMarkerClick;
                    window.onMarkerMove = Quizpage.Quiz.Navigator.onMarkerMove;
                },
                ".question-next click" : function(){
                    Quizpage.Quiz.Navigator.to_next_tab();
                },
                ".question-back click" : function(){
                    Quizpage.Quiz.Navigator.to_prev_tab();
                },
                ".question-delete-btn click" : function(){
                	var qst = Quizpage.Quiz.Navigator.get_current_question();
                	var qid = qst.qid;                	
                	var self = this;
                	qst.destroy(function(data){
                        Quizpage.Quiz.Navigator.remove_question_by_id(qid);
                        window.remPoint(qst.gmarker);
                        Pagemessage.Message.Item.show_message("Success", "Deleted");
                    }, function(){
                    	Pagemessage.Message.Item.show_message("Error", "Could not delete the question");
                    })
                },
                ".tab-question-edit click" : function(el){
                	if(!el.hasClass("active")){
                		//window.onMapClick = this.onMapClick4Edit;
                	}                	
                },
                ".tab-question-edit click" : function(el){
                	var qid = parseInt(el.attr("id").split("tab-question")[1]);
                    this.model.set_current_question_by_id(qid);
                    var qst = this.model.get_question_by_id(qid);
                    window.offsetCenter(qst.gmarker.position);
                }
            });
    });