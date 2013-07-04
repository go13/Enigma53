steal('jquery/controller').then(function($){

	$.Controller('Quizpage.Quizmap.Cmaplist', {

        	instance : null,
	        mapLoaded : false,
	        pointsLoaded : false,
	        listitems : null,
	        markers : null,
	        
        	defaults : {
		        questionMap : null,		        
		        
		        onMapRightClick : null,
		        onMarkerClick : null,
		        onMarkerRightClick : null,
		        doMapReady : null,
		        onMarkerMove : null
        	},
        	
	    	addPoint : function(quiz, success){
	    		var self = Quizpage.Quizmap.Cmaplist.instance;
	    		
	    		if(this.mapLoaded){		    		
	
		    		lat = quiz.lat;
		    		lng = quiz.lon;
	
		    		var marker = new google.maps.Marker({
		      	         position: new google.maps.LatLng(lat, lng),
		      	         draggable: false
		      	    });
	
		    		marker.quiz = quiz;            		
		    		quiz.gmarker = marker;
	
		    	    this.markers.push(marker);
	
		    		marker.setMap(self.questionMap); 
	
		    	    google.maps.event.addListener(marker, 'click', function() {
		    	    	Quizpage.Quizmap.Cmaplist.onMarkerClick(marker);
		    	    });
	
		    	    google.maps.event.addListener(marker, 'rightclick', function() {
		    	    	Quizpage.Quizmap.Cmaplist.onMarkerRightClick(marker);
		    	    });
	
		    	    google.maps.event.addListener(marker, 'dragend', function() {
		    	    	Quizpage.Quizmap.Cmaplist.onMarkerMove(marker);
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
	    		var self = Quizpage.Quizmap.Cmaplist.instance;

	    		if(this.mapLoaded && this.markers.length > 0 && !isNaN(lat) && !isNaN(lon)){   			

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
	    	fitAllMarkers : function(){
	 			var self = Quizpage.Quizmap.Cmaplist.instance;
	    		if(this.pointsLoaded && this.markers.length > 0){
	    			if(this.markers.length > 1){
	    				var LatLngList = [];
			    		
			    		for(var i = 0; i < this.markers.length; i++){
			    			LatLngList.push(this.markers[i].position);
			    		}
				    	//  Create a new viewpoint bound
				    	var bounds = new google.maps.LatLngBounds();
				    	//  Go through each...
				    	for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
				    	  //  And increase the bounds to take this point
				    	  bounds.extend (LatLngList[i]);
				    	}
				    	//  Fit these bounds to the map
				    	self.questionMap.fitBounds (bounds);
				    	var curzoom = self.questionMap.getZoom();
				    	if(curzoom > 0){
				    		self.questionMap.setZoom(curzoom - 1);	
				    	}
	    			}else{
	    				self.questionMap.setCenter(this.markers[0].position);
	    				self.questionMap.setZoom(7);
	    			}		    		
	    		}
	    	},
	    	loadPoints : function(listitems){
	    		if(listitems){
	    			this.listitems = listitems;	    				    			
	    		}
	    		if(this.listitems && !this.pointsLoaded && this.mapLoaded){
	    			this.pointsLoaded = true;
	    			
	    			if(this.listitems.length > 0){
		    			for(var i = 0; i < this.listitems.length; i++){
		    				if(!isNaN(this.listitems[i].lat) && !isNaN(this.listitems[i].lon)){
		    					this.addPoint(this.listitems[i]);	
		    				}
		    			}
		    			this.fitAllMarkers();
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
	        	if(this.doMarkerMove){
	        		this.doMarkerMove(mk);
	        	}
	        }
        },{ 
        	init : function(){
	 			var self = this;
	 			
	 			Quizpage.Quizmap.Cmaplist.mapLoaded = false;
	 			Quizpage.Quizmap.Cmaplist.pointsLoaded = false;	 			
	 			Quizpage.Quizmap.Cmaplist.markers = new Array();

	 			Quizpage.Quizmap.Cmaplist.instance = self;
	 			
	 			var lat = parseFloat(window.jsdata.latitude);
	 			var lon = parseFloat(window.jsdata.longitude);

        		var mapOptions = {
         			    zoom: 7,		    
         			    center: new google.maps.LatLng(lat, lon),
         			    panControl: true,
         			    streetViewControl: false,
         			    mapTypeControl: false,
         			    overviewMapControl: true,
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

				google.maps.event.addListener(self.questionMap, 'rightclick', function(event){
					Quizpage.Quizmap.Cmaplist.onMapRightClick(event);
				});
				
				google.maps.event.addListenerOnce(self.questionMap, 'idle', function(){		        	
		        	if(Quizpage.Quizmap.Cmaplist.onMapReady){
		        		Quizpage.Quizmap.Cmaplist.onMapReady();
		        	}					
				});
	        }
        });	
});