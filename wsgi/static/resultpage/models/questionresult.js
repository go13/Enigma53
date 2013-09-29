steal('jquery/model', function(){

	$.Model('Questionresult',
	/* @Static */
	{
	    defaults : {
	        id : -1,
	        quizid : 0,
	        qtext : "",
	        lat : NaN,
	        lon : NaN,
	        answers : [],
	        gmarker : null
	    },
	    findAll: "/questions.json",
		findOne : "/qresult/jget/{id}/"
	},{
	    get_answer_by_id : function(id){
	        var result = null;
	        for(var i = 0; i< this.answers.length; i++){
	            if(this.answers[i].id === id){
	                result = this.answers[i];
	                break;
	            }
	        }
	        return result;
	    }
	},{

	});
});