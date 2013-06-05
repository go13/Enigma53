steal('jquery/controller').then(function($){
	$.Controller('Quizpage.Quiz.Cquizedit',
        {
			quiz_update : function(title, success){
				var qid = Quizpage.Quiz.Navigator.instance.model.quizid;
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
		            error: function (error){
		                alert("There was an error posting the data to the server: " + error.responseText);
		            }
		        });
			}
        },{        	
        	init : function(){
        		
        	},        	
	        "#settings-save-btn click" : function(){
	        	var val = $('#quiz-title-input').attr("value"); 
	        	Quizpage.Quiz.Cquizedit.quiz_update(val, function(data){
	        		if(data.status === "OK"){
	        			$('#quiz-title-legend').text("Quiz - " + val);	
	        		}else{
	        			// ERROR
	        		}	        		
	        	});	        	
	        }
        });        
});