steal('jquery/model', function(){

$.Model('Questionedit',
/* @Static */
{
    defaults : {
        id : -1,
        quizid : 0,
        qtext : "" ,
        lat : NaN,
        lon : NaN,
        answers : null,

        gmarker : null
    },
    findAll: "/questions.json",
    findOne : "/question/jget_for_edit/{id}/"
},{
	init : function(){
		this.answers = new Array();
	},
    showInfoWindow : function(){
        var iw = new google.maps.InfoWindow();
        this.gmarker.infoWindow = iw;
        var qst = this;

        Questionpage.Question.Edit.geocoder.geocode({'latLng':  this.gmarker.getPosition()}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            iw.setContent(results[0].formatted_address);
          } else {
            iw.setContent("Question " + qst.id);
          }
        } else {
            iw.setContent("Question " + qst.id);
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
    to_object : function(){
        var obj = new Object();
        obj.id = this.id;
        obj.quizid = this.quizid;
        obj.qtext = this.qtext;
        obj.answers = this.answers;
        obj.lat = this.lat;
        obj.lon = this.lon;
        return obj;
    },
    set_question : function(question){
        this.id = question.id;
        this.quizid = question.quizid;
        this.qtext = question.qtext;
        this.answers = question.answers;
        this.lon = question.lon;
        this.lat = question.lat;
    },
    get_answer_by_id : function(id){
        var result = null;
        for(var i=0; i< this.answers.length; i++){
            if(this.answers[i].id === id){
                result = this.answers[i];
                break;
            }
        }
        return result;
    },
    remove_answer_by_id : function(id){
        for(var i=0; i<this.answers.length; i++){
            if(this.answers[i].id === id){
                this.answers.splice(i,1);
                break;
            }
        }
    },
    save : function(success, error){
        var obj = this.to_object();

        // TODO refactor answers so they dont have unnecessary fields
        $.ajax({
            type: "POST",
            url: "/question/jupd/" + this.id + "/",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            cache: false,
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
    },    
    destroy : function(success, error){
            // TODO refactor answers so they don't have unnecessary fields
            this.hideInfoWindow();

            $.ajax({
                type: "POST",
                url: "/question/jdelete/"+this.id+"/",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: "kill",
                cache: false,
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
    },
    create : function(success, error){
    	var self = this;
        var obj = this.to_object();

        // TODO refactor answers so they don't have unnecessary fields
        $.ajax({
            type: "POST",
            url: "/question/jcreate/",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            cache: false,
            success : function(data){
            	if(data.status == "ERROR"){
                	Messenger().post({
                		  message: data.message,
                		  type : 'error',
                		  showCloseButton: true
                		});
            	}else{
                    self.id = data.id;
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
    },
    clean : function(){
        this.id = -1;
        this.qtext = "";
        this.lat = NaN;
        this.lon = NaN;
    	
    	this.answers = [];
    	this.gmarker = null;
    },
    submit_question : function(success, error){
        var obj = new Object();
        obj.id = this.id;
        obj.lat = this.lat;
        obj.lon = this.lon;
        obj.answers = new Array();

        for(var i=0; i<this.answers.length; i++ ){
            obj.answers.push(new Object());
            obj.answers[i].correct = this.answers[i].correct;
            obj.answers[i].id = this.answers[i].id;
        }

        // TODO refactor answers so they don't have unnecessary fields

        $.ajax({
            type: "POST",
            url: "/question/jsubmit/"+this.id+"/",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            cache: false,
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