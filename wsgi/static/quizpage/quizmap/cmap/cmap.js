steal('jquery/controller').then(function($){

	$.Controller('Quizpage.Quizmap.Cmap', {

        	instance : null,
	        mapLoaded : false,
	        pointsLoaded : false,
	        
        	defaults : {
		        questionMap : null,
		        markers : null,
		        polyLine : null,
		        polyLineArrows : null,
		        
		        onMapRightClick : null,
		        onMarkerClick : null,
		        onMarkerRightClick : null,
		        doMapReady : null,
		        onMarkerMove : null
        	},
	    	addPoint : function(qst, success){
	    		var self = Quizpage.Quizmap.Cmap.instance;
	    		
	    		if(this.mapLoaded){		    		
	
		    		lat = qst.lat;
		    		lng = qst.lon;
	
		    		var marker = new google.maps.Marker({
		      	         position: new google.maps.LatLng(lat, lng),
		      	         draggable: true
		      	    });
	
		    		marker.question = qst;            		
		    		qst.gmarker = marker;
	
		    	    self.markers.push(marker);
	
		    		marker.setMap(self.questionMap); 
		    	    
		    	    self.polyLine.getPath().push(marker.position);
	
		    	    marker.setTitle("#" + (self.polyLine.getPath().getLength()).toString());
	
		    	    google.maps.event.addListener(marker, 'click', function() {
		    	    	Quizpage.Quizmap.Cmap.onMarkerClick(marker);
		    	    });
	
		    	    google.maps.event.addListener(marker, 'rightclick', function() {
		    	    	Quizpage.Quizmap.Cmap.onMarkerRightClick(marker);
		    	    });
	
		    	    google.maps.event.addListener(marker, 'dragend', function() {
		    	    	for(var i = 0; i < self.markers.length; i++){
		    	    		if(self.markers[i] === marker){
		    	    			self.polyLine.getPath().setAt(i, marker.position);
		    	    			break;
		    	    		}
		    	    	}
		    	    	Quizpage.Quizmap.Cmap.onMarkerMove(marker);
		    	    });
	
		    	    if(success){
		    	    	success();
		    	    };
	
		    	    return marker;
	    		}else{
	    			return null;
	    		}
	    	},	    	
	    	offsetCenter : function(lat, lon) {
	    		var self = Quizpage.Quizmap.Cmap.instance;

	    		if(this.mapLoaded && self.markers.length > 0 && !isNaN(lat) && !isNaN(lon)){   			

	        		var offsetx = - $(window).width() * 0.3;
	        		var offsety = 0;

	        		// latlng is the apparent centre-point
	        		// offsetx is the distance you want that point to move to the right, in pixels
	        		// offsety is the distance you want that point to move upwards, in pixels
	        		// offset can be negative
	        		// offsetx and offsety are both optional
	
	        		var scale = Math.pow(2, self.questionMap.getZoom());
	        		var nw = new google.maps.LatLng(
	        				self.questionMap.getBounds().getNorthEast().lat(),
	        				self.questionMap.getBounds().getSouthWest().lng()
	        		);
	
	        		var worldCoordinateCenter = self.questionMap.getProjection()
	        					.fromLatLngToPoint(new google.maps.LatLng(lat, lon));
	        		
	        		var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)
	
	        		var worldCoordinateNewCenter = new google.maps.Point(
	        		    worldCoordinateCenter.x - pixelOffset.x,
	        		    worldCoordinateCenter.y + pixelOffset.y
	        		);
	
	        		var newCenter = self.questionMap.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
	
	        		self.questionMap.setCenter(newCenter);
	    		}
	    	},
	    	loadPoints : function(){
	    		var self = Quizpage.Quiz.Navigator.instance;
	    		if(!this.pointsLoaded && this.mapLoaded){
		    		var qlist = self.model.questions;
		    		for(var i = 0; i < qlist.length; i++){	    			
		    			this.addPoint(qlist[i]);
		    		}
		    		if(qlist.length > 0){
			    		this.offsetCenter(qlist[0].lat, qlist[0].lon)
			    		this.pointsLoaded = true;
		    		}
	    		}
	    	},
	    	onMapRightClick : function(event){
	    		if(this.doMapRightClick){
	    			this.doMapRightClick(event);
	    		}
	    	},
	        onMarkerClick : function(mk){
	        	Quizpage.Quiz.Navigator.to_tab_by_id(mk.question.id, false);
	        	if(this.doMarkerClick){
	        		this.doMarkerClick(mk);
	        	}
	        },
	        onMarkerRightClick : function(event){
	        	if(this.doMarkerRightClick){
	        		this.doMarkerRightClick(event);	        		
	        	}
	        },
	        onMapReady : function(){
	        	this.mapLoaded = true;
	        	this.loadPoints();
	        }, 
	        onMarkerMove : function(mk){
	        	mk.question.lat = mk.position.lat();
	        	mk.question.lon = mk.position.lng();
	        	Quizpage.Quiz.Navigator.to_tab_by_id(mk.question.id, false);
	        	
	        	if(this.doMarkerMove){
	        		this.doMarkerMove(mk);
	        	}
	        }
        },{ 
        	init : function(){
	 			var self = this;
	 			
	 			Quizpage.Quizmap.Cmap.mapLoaded = false;
	 			Quizpage.Quizmap.Cmap.pointsLoaded = false;
	 			
	 			self.markers = new Array();
	 			self.polyLineArrows = new Array(); 

	 			Quizpage.Quizmap.Cmap.instance = self;

        		var mapOptions = {
         			    zoom: 8,		    
         			    center: new google.maps.LatLng(37.4419, -122.1419),
         			    panControl: true,
         			    streetViewControl: false,
         			    mapTypeControl: false,
         			    overviewMapControl: true,
                        disableDoubleClickZoom: true,
         			    mapTypeId: google.maps.MapTypeId.ROADMAP
        		};

	 			this.questionMap = new google.maps.Map(self.element[0], mapOptions);

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

				self.polyLine = new google.maps.Polyline(polyOptions);
				self.polyLine.setMap(self.questionMap);

				google.maps.event.addListener(self.questionMap, 'rightclick', function(event){
					Quizpage.Quizmap.Cmap.onMapRightClick(event);
				});

                google.maps.event.addListener(self.questionMap, 'dblclick', function(event){
					Quizpage.Quizmap.Cmap.onMapRightClick(event);
				});
				
				google.maps.event.addListenerOnce(self.questionMap, 'idle', function(){		        	
		        	if(Quizpage.Quizmap.Cmap.onMapReady){
		        		Quizpage.Quizmap.Cmap.onMapReady();
		        	}					
				});
	        }
        });	
});