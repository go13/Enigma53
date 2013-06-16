steal('jquery/model', function(){
	$.Model('Question',
	/* @Static */
	{
	    defaults : {
	        qid : -1,
	        nextquestionid : 0,
	        quizid : 0,
	        qtext : "" ,
	        lat : NaN,
	        lon : NaN,
	        answers : new Array(),
	        gmarker : null
	    },
	    findAll: "/questions.json",
	    findOne : "/question/jget/{id}/"
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
	    },
	    submit_question : function(success, error){
	        var obj = new Object();
	        obj.qid = this.qid;
	        obj.answers = new Array();
	        for(var i=0; i<this.answers.length; i++ ){
	            obj.answers.push(new Object());
	            obj.answers[i].value = this.answers[i].value;
	            obj.answers[i].id = this.answers[i].id;
	        }
	        // TODO refactor answers so they don't have unnecessary fields
	
	        $.ajax({
	            type: "POST",
	            url: "/question/jsubmit/"+this.qid+"/",
	            dataType: "json",
	            contentType: "application/json; charset=utf-8",
	            data: JSON.stringify(obj),
	            success : success,
	            error: error
	        });
	    }
	},
	{

	});
});