steal('jquery/controller', 'questionmap/models').then(function($){
	
	$.Controller('Questionmap.Questionmap.Cquestionmap',
            {		
				default: {
					model : null,
					map : null
				}
            },
            {
                init : function(){
                	this.map = window.questionmap;
                	this.model = new Mquestionmap();
                }
            });
    });