steal('jquery/controller').then(function($){

	$.Controller('Quizpage.Quizmap.Cabstractmap', {
			items : [],
	        mapLoaded : false,
	        pointsLoaded : false,
        	polyLine : null,
        	polyLineArrows : null,
        	isline : false,
	        markers : null,
	        itemMap : null,
	        
        	defaults : {		        
		        onMapRightClick : null,
		        onMarkerClick : null,
		        onMarkerRightClick : null,
		        doMapReady : null,
		        onMarkerMove : null
        	},
	    	addPoint : function(item){
	    		this.items.push(item);
	    		this.loadPoints();
	    	},
	    	loadPoints : function(onSuccess){
	    		
	    		if(this.mapLoaded){
	    			var items = this.items;
	    			this.items = [];
	    			
	    			for(var i = 0; i < items.length; i++){
	    				var item = items[i];
	    				
			    		var lat = item.lat;
			    		var lon = item.lon;
		
			    		var marker = new google.maps.Marker({
			      	         position: new google.maps.LatLng(lat, lon),
			      	         draggable: false
			      	    });
		
			    		this.markers.push(marker);
			    	    
			    		if(this.isline){
			    	    	this.polyLine.getPath().push(marker.position);	
			    	    }			    		
		
			    	    google.maps.event.addListener(marker, 'click', function() {
			    	    	Quizpage.Quizmap.Cabstractmap.onMarkerClick(marker);
			    	    });
		
			    	    google.maps.event.addListener(marker, 'rightclick', function() {
			    	    	Quizpage.Quizmap.Cabstractmap.onMarkerRightClick(marker);
			    	    });
			    	    
			    	    google.maps.event.addListener(marker, 'dragend', function() {			    	    	
			    	    	Quizpage.Quizmap.Cabstractmap.onMarkerMove(marker);
			    	    });
			    	    
			    		marker.setMap(this.itemMap);
			    		this.offsetCenter(lat, lon);
			    		
			    	    if(onSuccess){
			    	    	onSuccess(marker);
			    	    }
	    			}	    			
	
		    	    return marker;
	    		}else{
	    			return null;
	    		}
	    	},
	    	offsetCenter : function(lat, lon) {
	    		
	    		if(this.mapLoaded && this.markers.length > 0 && !isNaN(lat) && !isNaN(lon)){   			

	        		var offsetx = - $(window).width() * 0.3;
	        		var offsety = 0;

	        		// latlng is the apparent centre-point
	        		// offsetx is the distance you want that point to move to the right, in pixels
	        		// offsety is the distance you want that point to move upwards, in pixels
	        		// offset can be negative
	        		// offsetx and offsety are both optional
	
	        		var scale = Math.pow(2, this.itemMap.getZoom());
	        		var nw = new google.maps.LatLng(
	        				this.itemMap.getBounds().getNorthEast().lat(),
	        				this.itemMap.getBounds().getSouthWest().lng()
	        		);
	
	        		var worldCoordinateCenter = this.itemMap.getProjection()
	        					.fromLatLngToPoint(new google.maps.LatLng(lat, lon));
	        		
	        		var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)
	
	        		var worldCoordinateNewCenter = new google.maps.Point(
	        		    worldCoordinateCenter.x - pixelOffset.x,
	        		    worldCoordinateCenter.y + pixelOffset.y
	        		);
	
	        		var newCenter = this.itemMap.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
	
	        		this.itemMap.setCenter(newCenter);
	    		}
	    	},
	    	onMapRightClick : function(event){
	    		if(this.doMapRightClick){
	    			this.doMapRightClick(event);
	    		}
	    	},
	        onMarkerClick : function(mk){
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
	        	if(this.doMapReady){
	        		this.doMapReady();	        		
	        	}
	        }, 
	        onMarkerMove : function(mk){
	        	if(this.doMarkerMove){
	        		this.doMarkerMove(mk);
	        	}
	        }
        },{ 
        	init : function(){
        		var cself = Quizpage.Quizmap.Cabstractmap;
	 			
	 			cself.mapLoaded = false;
	 			cself.pointsLoaded = false;
	 			
	 			cself.markers = new Array();

        		var mapOptions = {
         			    zoom: 8,		    
         			    center: new google.maps.LatLng(37.4419, -122.1419),
         			    panControl: true,
         			    streetViewControl: false,
         			    mapTypeControl: false,
         			    overviewMapControl: true,
         			    mapTypeId: google.maps.MapTypeId.ROADMAP
        		};

	 			cself.itemMap = new google.maps.Map(this.element[0], mapOptions);
	 			
	 			if(cself.isline){
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
		
					cself.polyLine = new google.maps.Polyline(polyOptions);
					cself.polyLine.setMap(cself.itemMap);
	 			}

				google.maps.event.addListener(cself.itemMap, 'rightclick', function(event){
					cself.onMapRightClick(event);
				});
				
				google.maps.event.addListenerOnce(cself.itemMap, 'idle', function(){
					cself.mapLoaded = true;
					cself.loadPoints();
					
		        	if(cself.onMapReady){		        		
		        		cself.onMapReady();
		        	}					
				});
	        }
        });	
});