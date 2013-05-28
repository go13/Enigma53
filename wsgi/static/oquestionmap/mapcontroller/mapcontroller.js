steal( 'jquery/controller', 'questionmap/models').then(function($){

        $.Controller('Questionmap.Mapcontroller',
            /** @Prototype */
            {
/*                default : {
                    model: null
                },*/
            },{
            	init : function(){        		
            	}
               /* init : function(){
                	this.model = new Mapmodel(); 
                	var mapOptions = {
    					    zoom: 8,
    					    center: new google.maps.LatLng(55, 0),
    					    mapTypeId: google.maps.MapTypeId.ROADMAP,
    					    zoomControl: true,
    					    mapTypeControl: false,
    					    scaleControl: true,
    					    streetViewControl: false,
    					  };
    					  
    				var map = new google.maps.Map(this.element, mapOptions);
    				
    				this.model.map = map;
    				
    				google.maps.event.addListener(map, 'click', this.map_click);
    				
    				google.maps.event.addDomListener(window, 'load', initialize);
                },
                map_click : function(event) {
                	
                }*/
            });
    });