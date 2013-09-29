steal('jquery/model', function(){
	$.Model('Question',
	/* @Static */
	{
	    defaults : {
	        id : -1,
	        quizid : 0,
	        qtext : "",
	        rendered_qtext : "",
	        lat : NaN,
	        lon : NaN,
	        answers : [],
	        gmarker : null,
            answered: false,
            correct: 'N'
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
        showInfoWindow : function(){
            var iw = new google.maps.InfoWindow();
            iw.setOptions({disableAutoPan:true});
            this.gmarker.infoWindow = iw;
            var qst = this;

            Questionpage.Question.Item.geocoder.geocode({'latLng':  this.gmarker.getPosition()}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                iw.setContent(results[0].formatted_address);
              } else {
                iw.setContent("Question" + qst.id);
              }
            } else {
                iw.setContent("Question" + qst.id);
            }
          });

          iw.open(this.gmarker.map, this.gmarker);
        },
        hideInfoWindow : function(){
            if(this.gmarker.infoWindow){
                this.gmarker.infoWindow.close();
                this.gmarker.infoWindow = null;
            }
        },
	    submit_question : function(success, error){
	        var obj = {};
	        obj.id = this.id;
	        obj.answers = [];
	        for(var i = 0; i < this.answers.length; i++ ){
	            obj.answers.push({});
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