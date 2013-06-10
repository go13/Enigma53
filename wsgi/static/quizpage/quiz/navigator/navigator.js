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
                    new_marker : null,
                    
                	questionMap : null,	
            		markers : null,
            		polyLine : null,
            		polyLineArrows : null,
        
			    	onMapClick : null,    
			    	onMarkerClick : null,    	
			    	onMarkerMove : null
    	
                },
                create_question : function(mk){
                    var qm = new Questionedit();
                    qm.quizid = Quizpage.Quiz.Navigator.instance.model.quizid;
                    qm.gmarker = mk;
                    qm.create(function(){
                    	Quizpage.Quiz.Navigator.add_question_edit(qm);
                        Quizpage.Quiz.Navigator.to_tab_by_id(qm.qid, false);
                        mk.question = qm;                   	
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
                load_question_item : function(el, success){
                    var qc = new Questionpage.Question.Item($(el), {onSuccess : function(qst){
                    	var nav = Quizpage.Quiz.Navigator.instance;
	                    nav.model.add_question(qc.model);
	                    qst.gmarker = nav.addPoint(new google.maps.LatLng(qst.lat, qst.lon), true);
	                	qst.gmarker.question = qst;
	                	if(success){
                    		success(qst);                    		
                    	}
                    }});
                },                
                load_question_edit : function(el, success){                	
                    var qc = new Questionpage.Question.Edit($(el), {onSuccess : function(qst){
                    	var nav = Quizpage.Quiz.Navigator.instance;
                    	nav.model.add_question(qst);             
                    	qst.gmarker = nav.addPoint(new google.maps.LatLng(qst.lat, qst.lon), true);
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
                        navigator.offsetCenter(qst.gmarker.position); 
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
                        navigator.offsetCenter(qst.gmarker.position); 
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
	                        navigator.offsetCenter(qst.gmarker.position); 
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
               doMapClick4Create : function(event, questionmap){
               	    var qm = new Questionedit();
               	    var nav = Quizpage.Quiz.Navigator.instance;
                    qm.quizid = nav.model.quizid;
                    qm.gmarker = nav.addPoint(event.latLng, false);
                    qm.gmarker.question = qm;
                    qm.lat = event.latLng.jb;
                    qm.lon = event.latLng.kb;
                    qm.create(function(){
                    	Quizpage.Quiz.Navigator.add_question_edit(qm);
                        Quizpage.Quiz.Navigator.to_tab_by_id(qm.qid, false);
                    });                    
               },
               doMarkerClick : function(mk){
               		Quizpage.Quiz.Navigator.to_tab_by_id(mk.question.qid, false);
               },
               doMapClick4Edit : function(event, questionmap){
	               	 //
               },
               doMarkerMove : function(mk){
            	   mk.question.lat = mk.position.jb;
            	   mk.question.lon = mk.position.kb;
               	   Quizpage.Quiz.Navigator.to_tab_by_id(mk.question.qid, false);
               }
            },{
                init : function(){
                	this.markers = [];
                	this.polyLineArrows = [];
                	var onSuccess = this.options.onSuccess;
                    var quiz_name = this.element.attr("name");
                    var quizid = parseInt(quiz_name.split("quiz")[1]);                    
                    Quizpage.Quiz.Navigator.instance = this;
                    
                    this.load_map();
                    
                    this.model = new Navigator({quizid : quizid});
                    this.onMapClick = Quizpage.Quiz.Navigator.doMapClick4Create;
                    this.onMarkerClick = Quizpage.Quiz.Navigator.doMarkerClick;
                    this.onMarkerMove = Quizpage.Quiz.Navigator.doMarkerMove;
                    
                    if(onSuccess){
                    	onSuccess(quizid);
                    }
                },
            	remPoint : function (marker){
                	for(var i = 0; i < this.markers.length; i++){
                		if(this.markers[i] === marker){
                			this.polyLine.getPath().removeAt(i);
                			this.markers.splice(i, 1);
                			marker.setMap(null); 
                			break;
                		}
                	}			
            	},
            	addPoint : function(latlng, lazy) {
            		var self = this;
            	    var marker = new google.maps.Marker({
            	      position: latlng,
            	      draggable: true
            	    });
            	    
            	    this.markers.push(marker);
            	    
            	    if(!lazy){
            	    	this.showPoint(marker);
            	    	
            	    }
            	    return marker;
            	},
            	showPoint : function(marker, success){
            		var self = this;            		
            		marker.setMap(self.questionMap); 
            	    
            	    this.polyLine.getPath().push(marker.position);
            	    
            	    marker.setTitle("#"+(this.polyLine.getPath().getLength()).toString());
            	    
            	    google.maps.event.addListener(marker, 'click', function() {
            	    	if(self.onMarkerClick){
            	    		self.onMarkerClick(marker);
            	    	}			
            	    });
            	    
            	    google.maps.event.addListener(marker, 'rightclick', function() {
            	    	if(self.onMarkerRightClick){
            	    		self.onMarkerRightClick(marker);
            	    	}
            	    });
            	    
            	    google.maps.event.addListener(marker, 'dragend', function() {
            	    	for(var i = 0; i < self.markers.length; i++){
            	    		if(self.markers[i] === marker){
            	    			self.polyLine.getPath().setAt(i, marker.position);
            	    			break;
            	    		}
            	    	}	    	
            	    	if(self.onMarkerMove){
            	    		self.onMarkerMove(marker);
            	    	}
            	    });
            	    
            	    if(success){
            	    	success();            	    	
            	    }
            	},
            	showAllPoints : function(){
            		for(var i = 0; i < this.markers.length; i++){
            			var self = this;
            			this.showPoint(this.markers[i], function(){
            				if(i === 0){
                    			Quizpage.Quiz.Navigator.to_tab_by_id(self.markers[0].question.qid, true);
                    		};	
            			});            			
            		};
            	},
            	offsetCenter : function(latlng) {
            		if(this.markers.length > 0){
	            		var offsetx = - $(window).width() * 0.3;
	            		var offsety = 0;
	
	            		// latlng is the apparent centre-point
	            		// offsetx is the distance you want that point to move to the right, in pixels
	            		// offsety is the distance you want that point to move upwards, in pixels
	            		// offset can be negative
	            		// offsetx and offsety are both optional
	
	            		var scale = Math.pow(2, this.questionMap.getZoom());
	            		var nw = new google.maps.LatLng(
	            				this.questionMap.getBounds().getNorthEast().lat(),
	            				this.questionMap.getBounds().getSouthWest().lng()
	            		);
	
	            		var worldCoordinateCenter = this.questionMap.getProjection().fromLatLngToPoint(latlng);
	            		var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)
	
	            		var worldCoordinateNewCenter = new google.maps.Point(
	            		    worldCoordinateCenter.x - pixelOffset.x,
	            		    worldCoordinateCenter.y + pixelOffset.y
	            		);
	
	            		var newCenter = this.questionMap.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
	
	            		this.questionMap.setCenter(newCenter);
            		}
            	},
                load_map : function(){                   
             	   var mapOptions = {
             			    zoom: 8,		    
             			    center: new google.maps.LatLng(37.4419, -122.1419),
             			    panControl: true, 
             			    streetViewControl: false,
             			    mapTypeControl: false,
             			    overviewMapControl: true,
             			    mapTypeId: google.maps.MapTypeId.ROADMAP
             			  };
     			  
     			  this.questionMap = new google.maps.Map(document.getElementById('question-map'), mapOptions); // td ?
     			  
     			  var lineSymbol = {
     					    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
     					  };
     			  
     			  var polyOptions = {
     					  icons: [{
     					      icon: lineSymbol,
     					      offset: '100%',
     					      repeat:'100px'
     					    }],
     					    strokeColor: 'rgb(255, 255, 255)',
     					    strokeOpacity: 1.0,
     					    strokeWeight: 3
     			  };		  
     			  
     			  this.polyLine = new google.maps.Polyline(polyOptions);
     			  this.polyLine.setMap(this.questionMap);
     			  
     			  var self = this;
     			  
     			  google.maps.event.addListener(this.questionMap, 'rightclick', function(event) {
     				    if(self.onMapClick != null){
     				    	self.onMapClick(event, self.questionMap);		    	
     				    }
     			  });
     			  google.maps.event.addListenerOnce(this.questionMap, 'idle', function(){
     				 self.showAllPoints();
     			  });
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
                        Quizpage.Quiz.Navigator.instance.remPoint(qst.gmarker);
                        Messenger().post({
                    		  message: 'Question deleted',
                    		  showCloseButton: true
                    		});
                    });
                },
                ".tab-question-edit click" : function(el){                	
                },
                ".tab-question-edit click" : function(el){
                	var qid = parseInt(el.attr("id").split("tab-question")[1]);
                    this.model.set_current_question_by_id(qid);
                    var qst = this.model.get_question_by_id(qid);
                    this.offsetCenter(qst.gmarker.position); 
                }
            });
    });