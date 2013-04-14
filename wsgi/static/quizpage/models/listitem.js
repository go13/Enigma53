steal('jquery/model', function(){
	$.Model('Listitem',
	/* @Static */
	{
		// static
	    defaults : {
	    	quizid : 0,
	    	title : "type in your title.."
	    }	    
	},{
	  // dynamic
		create :  function(success){
			var model = this;
			var obj = {
					title : model.title
			};
			$.ajax({
	            type: "CREATE",
	            url: "/quiz/jcreate/",
	            dataType: "json",
	            contentType: "application/json; charset=utf-8",
	            data: JSON.stringify(obj),
	            success :  function (data){
	            	model.quizid = data.quizid;
	            	success();
	            },
	            error: function (error){
	                alert("There was an error posting the data to the server: " + error.responseText);
	            }
	        });
	    }
	},{
		
	});
});