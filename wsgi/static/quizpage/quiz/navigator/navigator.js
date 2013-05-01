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
                create_question : function(question){

                },
                add_question_edit : function(question){                	
                	
                    Quizpage.Quiz.Navigator.instance.element.find("#tabs")
                        .append("<li id='tab-question" + question.qid + "' class='question-tab tab-question-edit'>" +
                            "<a href='#tab-question-page" + question.qid + "' data-toggle='tab'>Question " + question.qid + "</a>" +
                            "</li>");
                    Quizpage.Quiz.Navigator.instance.element.find("#tabs-container")
                        .append("<div id='tab-question-page" + question.qid + "' class='tab-pane'>" +
                            "<div class='question-edit' name='question" + question.qid + "'></div>" +
                            "</div>");
                    var el = Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page" + question.qid)
                        .children(".question-edit :first");

                    el.questionpage_question_edit({type:"add", question:question});
                    Quizpage.Quiz.Navigator.instance.model.add_question(question);
                },
                load_question_item : function(el){
                    var qc = new Questionpage.Question.Item($(el));
                    Quizpage.Quiz.Navigator.instance.model.add_question(qc.model);
                },
                load_question_edit : function(el){
                    var qc = new Questionpage.Question.Edit($(el));
                    Quizpage.Quiz.Navigator.instance.model.add_question(qc.model);
                },
                load_question_new : function(el){
                	var quizid = Quizpage.Quiz.Navigator.instance.model.quizid;
                    var qc = new Questionpage.Question.Edit($(el), {type : "new", quizid : quizid});
                    Quizpage.Quiz.Navigator.instance.mnew_question = qc.model;
                    Quizpage.Quiz.Navigator.instance.cnew_question = qc;
                },
                remove_question_by_id : function(qid){
                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question"+qid).remove();
                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page"+qid).remove();

                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question-new").addClass("active");
                    Quizpage.Quiz.Navigator.instance.element.find("#tab-question-page-new").addClass("active");

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
                    }
                },
                to_tab_by_id : function(qid){
                    var navel = Quizpage.Quiz.Navigator.instance.element;
                    var el = navel.find("#tabs > .question-tab.active");
                    if(el){
                        var tab_id_string = el.attr("id").split("tab-question")[1];
                        if(tab_id_string != qid){
                            el.removeClass("active");

                            el = navel.find("#tabs > #tab-question"+qid);
                            el.addClass("active");

                            el = navel.find("#tabs-container > .tab-pane.active");
                            el.removeClass("active");

                            el = navel.find("#tabs-container > #tab-question-page"+qid);
                            el.addClass("active");
                            var qid_num = parseInt(qid);
                            Quizpage.Quiz.Navigator.instance.model.set_current_question_by_id(qid_num);
                        }
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
                }
            },{
                init : function(){
                    var quiz_name = this.element.attr("name");
                    var quizid = parseInt(quiz_name.split("quiz")[1]);
                    Quizpage.Quiz.Navigator.instance = this;
                    this.model = new Navigator({quizid : quizid});
                    window.onMapClick = this.onMapClick4Create;
                },
                ".question-next click" : function(){
                    Quizpage.Quiz.Navigator.to_next_tab();
                },
                ".question-back click" : function(){
                    Quizpage.Quiz.Navigator.to_prev_tab();
                },
                ".question-create click" : function(data){
					
					//question.marker = window.currentMapMarker;
                	
					if( this.new_marker != null){
						
						this.mnew_question.lat = this.new_marker.position.kb;
						this.mnew_question.lon = this.new_marker.position.jb;
						var self = this;
						
	                	this.mnew_question.create(function(data){
						    var newQuestion = Quizpage.Quiz.Navigator.instance.mnew_question.to_object();
						    newQuestion.qid = data.qid;
						    self.cnew_question.clean();
						    
						    Quizpage.Quiz.Navigator.add_question_edit(newQuestion);						    
						    
						    Pagemessage.Message.Item.show_message("Success", "Created");
						});
	                	this.new_marker = null;
	                	window.onMapClick = this.onMapClick4Create;
					}else{
						Pagemessage.Message.Item.show_message("Error", "Please select a location for this question on the map");
					}
                },
                ".question-delete-btn click" : function(){
                	var question = Quizpage.Quiz.Navigator.get_current_question();
                    question.destroy(function(data){
                        Quizpage.Quiz.Navigator.remove_question_by_id(question.qid);
                        Pagemessage.Message.Item.show_message("Success", "Deleted");
                    })
                },
                ".tab-question-create click" : function(el){
                	if(!el.hasClass("active")){
                		if(this.new_marker === null){
                			window.onMapClick = this.onMapClick4Create;
                		} else {
                			window.onMapClick = this.onMapClick4Edit;
                		}
                	}                	
                },
                ".tab-question-edit click" : function(el){
                	if(!el.hasClass("active")){
                		window.onMapClick = this.onMapClick4Edit;
                	}                	
                },                
                onMapClick4Create : function(event, questionmap){
	                var mk = new google.maps.Marker({
		           	     position: event.latLng,
		           	     editable : true,
		           	     draggable : true,
		           	     map: questionmap
	                });
	               	google.maps.event.addListener(mk, 'click', function() {
	               		 window.location.href = 'google.com';
	               	});
	               	Quizpage.Quiz.Navigator.instance.new_marker = mk;
	               	window.onMapClick = Quizpage.Quiz.Navigator.instance.onMapClick4Edit;
                },
                onMapClick4Edit : function(event, questionmap){
	               	 //alert('add handler!');                	
                }
                /*,
                ".quiz-finish-btn click" : function(){
                    var quizid = Quizpage.Quiz.Navigator.instance.model.quizid;
                    $.ajax({
                        type: "POST",
                        url: "/quiz/jfinishsession/"+quizid+"/",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify("finish-session"),
                        success :  function(){
                            document.location.href = '/quiz/'+quizid+'/home/';
                        },
                        error: function (error){
                            alert("There was an error posting the data to the server: " + error.responseText);
                        }
                    });
                }*/
            });
    });