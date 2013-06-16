steal('jquery/controller', 'quizpage/quizmap/cmap').then(function($){

	Quizpage.Quizmap.Cmap('Quizpage.Quizmap.Cmapedit', {

    	remPoint : function (qst){
    		var self = Quizpage.Quizmap.Cmap.instance;

        	for(var i = 0; i < self.markers.length; i++){
        		if(self.markers[i] === qst.gmarker){
        			self.polyLine.getPath().removeAt(i);
        			self.markers.splice(i, 1);
        			qst.gmarker.setMap(null); 
        			break;
        		}
        	}			
    	},
    	
        onMapRightClick : function(event){
        	
       	    var qm = new Questionedit();

            qm.quizid = Quizpage.Quiz.Navigator.instance.model.quizid;
            
            qm.lat = event.latLng.jb;
            qm.lon = event.latLng.kb;
            qm.answers = new Array();

            this.addPoint(qm, false);
            
            qm.create(function(){
            	Quizpage.Quiz.Cquizedit.add_question_edit(qm);
            	Quizpage.Quiz.Cquizedit.to_tab_by_id(qm.qid, false);
            });
        },
        
        onMarkerMove : function(mk){
        	mk.question.lat = mk.position.jb;
        	mk.question.lon = mk.position.kb;
        	Quizpage.Quiz.Navigator.to_tab_by_id(mk.question.qid, false);
        }
        
	},{
		init : function(){
			this._super();
			Quizpage.Quizmap.Cmap.doMapRightClick = Quizpage.Quizmap.Cmapedit.onMapRightClick;			
		}
	});
});