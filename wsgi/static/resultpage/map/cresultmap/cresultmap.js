steal('jquery/controller', 'quizpage/quizmap/cabstractmap').then(function($){
	
	Quizpage.Quizmap.Cabstractmap('Resultpage.Map.Cresultmap', {		
        },{        	
        	init : function(){
        		Quizpage.Quizmap.Cabstractmap.isline = true;
        		this._super();
        	}        	
        });
});