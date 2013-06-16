steal('jquery/controller').then(function($){
	$.Controller('Quizpage.Csettings', {
			quiz_update : function(title, success){
				var qid = Quizpage.Quiz.Navigator.instance.quizid;
				var obj = {
					title : title
				};
	        	$.ajax({
		            type: "POST",
		            url: "/quiz/jupdate/"+qid+"/",
		            dataType: "json",
		            contentType: "application/json; charset=utf-8",
		            data: JSON.stringify(obj),
		            success :  success,
		            error:  function (e){
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
        },{        	
	        "#settings-save-btn click" : function(){
	        	var val = $('#quiz-title-input').attr("value"); 
	        	Quizpage.Csettings.quiz_update(val, function(data){
	        		if(data.status === "OK"){
	        			$('#quiz-title-legend').text("Quiz - " + val);
                        Messenger().post({
                    		  message: 'Quiz settings updated',
                    		  showCloseButton: true
                        });
	        		}else{
                        Messenger().post({
                  		  message: data.message,
                  		  type : 'error',
                  		  showCloseButton: true
                      });	        			
	        		}	        		
	        	});	        	
	        }
        });        
});