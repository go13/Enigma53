steal('jquery/controller', 'resultpage/quiz/cquizresult').then(function($){
	$.Controller('Resultpage.Question.Cquestionresult', {		
        },{        	
        	lat : null,
        	lon : null,
        	id : -1,
        	
        	init : function(){
        		this.lat = parseFloat(this.element.attr("data-lat"));
        		this.lon = parseFloat(this.element.attr("data-lon"));
        		this.id = parseFloat(this.element.attr("data-questionid"));
        		
        		console.log("id - " + this.id);
        		console.log("lat - " + this.lat);
        		console.log("lon - " + this.lon);
        		
        		Resultpage.Map.Cresultmap.addPoint(this);
        	}
        });
});