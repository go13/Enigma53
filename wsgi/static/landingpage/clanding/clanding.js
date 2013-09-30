steal('jquery/controller').then(function($){

	$.Controller('Landingpage.Clanding', {

        	instance : null,
	        mapLoaded : false,
	        pointsLoaded : false,
	        markers : null,
            geocoder : null,

        	defaults : {
		        questionMap : null,

		        onMapRightClick : null,
		        onMarkerClick : null,
		        onMarkerRightClick : null,
		        doMapReady : null,
		        onMarkerMove : null
        	},

	    	addPoint : function(quiz, success){
	    		var self = Landingpage.Clanding.instance;

	    		if(this.mapLoaded){

		    		lat = quiz.latitude;
		    		lng = quiz.longitude;

		    		var marker = new google.maps.Marker({
		      	         position: new google.maps.LatLng(lat, lng),
		      	         draggable: false
		      	    });

		    		marker.quiz = quiz;
		    		quiz.gmarker = marker;

                    var iw = new google.maps.InfoWindow();
                    marker.infoWindow = iw;

                    Landingpage.Clanding.geocoder.geocode({'latLng':  marker.getPosition()}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                          if (results[1]) {
                            iw.setContent("<a class='nolink' href='/quiz/" + quiz.id + "/'><b>" + quiz.title +"</b></a>" +
                                " </br> <a href='/quiz/" + quiz.id + "/'>Start</a>" +
                                " </br>" + results[0].formatted_address
                            );
                          } else {
                            iw.setContent("<a class='nolink' href='/quiz/" + quiz.id + "/'><b>" + quiz.title +"</b></a>" +
                                " </br> <a href='/quiz/" + quiz.id + "/'>Start</a>"
                            );
                          }
                        } else {
                            iw.setContent("<a class='nolink' href='/quiz/" + quiz.id + "/'><b>" + quiz.title +"</b></a>" +
                                " </br> <a href='/quiz/" + quiz.id + "/'>Start</a>"
                            );
                        }
                    });
                    iw.open(self.questionMap, marker);

		    	    this.markers.push(marker);

		    		marker.setMap(self.questionMap);

		    	    google.maps.event.addListener(marker, 'click', function() {
		    	    	Landingpage.Clanding.onMarkerClick(marker);
		    	    });

		    	    google.maps.event.addListener(marker, 'rightclick', function() {
		    	    	Landingpage.Clanding.onMarkerRightClick(marker);
		    	    });

		    	    google.maps.event.addListener(marker, 'dragend', function() {
		    	    	Landingpage.Clanding.onMarkerMove(marker);
		    	    });

		    	    if(success){
		    	    	success();
		    	    }

		    	    return marker;
	    		}else{
	    			return null;
	    		}
	    	},
	    	fitAllMarkers : function(){
	 			var self = Landingpage.Clanding.instance;
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
				    	self.questionMap.fitBounds(bounds);
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
	    	loadPoints : function(){
	    		if(!this.pointsLoaded && this.mapLoaded){
	    			this.pointsLoaded = true;

	    			if(window.jsdata.quizes.length > 0){
		    			for(var i = 0; i < window.jsdata.quizes.length; i++){
		    				if(!isNaN(window.jsdata.quizes[i].latitude) && !isNaN(window.jsdata.quizes[i].longitude)){
		    					this.addPoint(window.jsdata.quizes[i]);
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
                mk.infoWindow.open(Landingpage.Clanding.instance.questionMap, mk);
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

                Landingpage.Clanding.geocoder = new google.maps.Geocoder();

	 			Landingpage.Clanding.mapLoaded = false;
	 			Landingpage.Clanding.pointsLoaded = false;
	 			Landingpage.Clanding.markers = [];

	 			Landingpage.Clanding.instance = self;

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
					Landingpage.Clanding.onMapRightClick(event);
				});

				google.maps.event.addListenerOnce(self.questionMap, 'idle', function(){
		        	if(Landingpage.Clanding.onMapReady){
		        		Landingpage.Clanding.onMapReady();
		        	}
				});
	        }
        });
});
