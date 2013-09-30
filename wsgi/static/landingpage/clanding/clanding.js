steal('jquery/controller').then(function($){

	$.Controller('Landingpage.Clanding', {

        	instance : null,
	        mapLoaded : false,
	        pointsLoaded : false,
	        markers : null,
            geocoder : null,
            questionMap : null,

        	defaults : {
		        onMapRightClick : null,
		        onMarkerClick : null,
		        onMarkerRightClick : null,
		        doMapReady : null,
		        onMarkerMove : null
        	},

	    	addPoint : function(quiz, success){
	    		var self = Landingpage.Clanding;

	    		if(self.mapLoaded){

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
                                " by " + quiz.author + " " +
                                " </br> <a href='/quiz/" + quiz.id + "/'>Start</a>" +
                                " </br>" + results[0].formatted_address
                            );
                          } else {
                            iw.setContent("<a class='nolink' href='/quiz/" + quiz.id + "/'><b>" + quiz.title +"</b></a>" +
                                " by " + quiz.author + " " +
                                " </br> <a href='/quiz/" + quiz.id + "/'>Start</a>"
                            );
                          }
                        } else {
                            iw.setContent("<a class='nolink' href='/quiz/" + quiz.id + "/'><b>" + quiz.title +"</b></a>" +
                                " by " + quiz.author + " " +
                                " </br> <a href='/quiz/" + quiz.id + "/'>Start</a>"
                            );
                        }
                    });
                    iw.open(self.questionMap, marker);

		    	    self.markers.push(marker);

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
	    	loadPoints : function(){
                var self = Landingpage.Clanding;
	    		if(!self.pointsLoaded && self.mapLoaded){
	    			self.pointsLoaded = true;

	    			if(window.jsdata.quizes.length > 0){
		    			for(var i = 0; i < window.jsdata.quizes.length; i++){
		    				if(!isNaN(window.jsdata.quizes[i].latitude) && !isNaN(window.jsdata.quizes[i].longitude)){
		    					Landingpage.Clanding.addPoint(window.jsdata.quizes[i]);
		    				}
		    			}
		    			self.fitAllMarkers();
	    			}
	    		}
	    	},
            offsetCenter : function(lat, lon, offsetx, offsety) {
	    		var self = Landingpage.Clanding;

	    		if(self.mapLoaded && self.markers.length > 0 && !isNaN(lat) && !isNaN(lon)){

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
	 			var self = Landingpage.Clanding;
	    		if(self.pointsLoaded && self.markers.length > 0){
	    			if(self.markers.length > 1){
	    				var LatLngList = [];

			    		for(var i = 0; i < self.markers.length; i++){
			    			LatLngList.push(self.markers[i].position);
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
                        self.offsetCenter(bounds.getCenter().lat(), bounds.getCenter().lng(), 0, - 0.15 * $(window).height());
	    			}else{
	    				self.questionMap.setCenter(self.markers[0].position);
	    				self.questionMap.setZoom(7);
	    			}
	    		}
	    	},
	    	onMapRightClick : function(event){
	    		if(this.doMapRightClick){
	    			this.doMapRightClick(event);
	    		}
	    	},
	        onMarkerClick : function(mk){
                mk.infoWindow.open(Landingpage.Clanding.questionMap, mk);
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
                var self = Landingpage.Clanding;
	        	self.mapLoaded = true;
	        	self.loadPoints();
	        },
	        onMarkerMove : function(mk){
	        	if(this.doMarkerMove){
	        		this.doMarkerMove(mk);
	        	}
	        }
        },{
        	init : function(){
	 			var self = Landingpage.Clanding;

                self.geocoder = new google.maps.Geocoder();

	 			self.mapLoaded = false;
	 			self.pointsLoaded = false;
	 			self.markers = [];

	 			self.instance = this;

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

	 			self.questionMap = new google.maps.Map(this.element[0], mapOptions);

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
