steal('jquery/model', function(){
	$.Model('Question',
	/* @Static */
	{
	    defaults : {
	        id : -1,
	        quizid : 0,
	        qtext : "",
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
	        obj.id = this.id;
	        obj.answers = new Array();
	        for(var i = 0; i < this.answers.length; i++ ){
	            obj.answers.push(new Object());
	            obj.answers[i].value = this.answers[i].value;
	            obj.answers[i].id = this.answers[i].id;
	        }
	        // TODO refactor answers so they don't have unnecessary fields
	
	        $.ajax({
	            type: "POST",
	            url: "/question/jsubmit/"+this.id+"/",
	            dataType: "json",
	            contentType: "application/json; charset=utf-8",
	            data: JSON.stringify(obj),
	            success : function(data){
	            	if(data.status == "ERROR"){
	                	Messenger().post({
	                		  message: data.message,
	                		  type : 'error',
	                		  showCloseButton: true
	                		});            		
	            	}else{
		            	if(success){
		            		success();
		            	}
	            	}
	            },
	            error: function (e){
	            	Messenger().post({
	          		  message: 'There was an error posting the data to server',
	          		  type : 'error',
	          		  showCloseButton: true
	          		});
	            	if(error){
	            		error(e);
	            	}            	
	            }
	        });
	    }
	},
	{

	});
});