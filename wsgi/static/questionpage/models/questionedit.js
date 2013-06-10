steal('jquery/model', function(){

$.Model('Questionedit',
/* @Static */
{
    defaults : {
        qid : -1,
        nextquestionid : 0,
        quizid : 0,
        qtext : "" ,
        lat : "",
        lon : "",
        answers : [],

        atext : "",
        correct : 'T',
        isNew : false,
        gmarker : null
    },
    findAll: "/questions.json",
    findOne : "/question/jget_for_edit/{id}/"
},{
    to_object : function(){
        var obj = new Object();
        obj.qid = this.qid;
        obj.quizid = this.quizid;
        obj.qtext = this.qtext;
        obj.answers = this.answers;
        obj.lat = this.lat;
        obj.lon = this.lon; 
        return obj;
    },
    set_question : function(question){
        this.qid = question.qid;
        this.nextquestionid = question.nextquestionid;
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
            url: "/question/jupd/" + this.qid + "/",
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
    },    
    destroy : function(success, error){
            // TODO refactor answers so they don't have unnecessary fields
            $.ajax({
                type: "POST",
                url: "/question/jdelete/"+this.qid+"/",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: "kill",
                success : success,
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
            success : function(data){
            	self.qid = data.qid;
            	if(success){
            		success();            		
            	}            	
            },
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
    },
    clean : function(){
        this.qid = -1;
        this.qtext = "";
        this.lat = "";
        this.lon = "";

        this.atext = "";
        this.gmarker = null;
    	
    	this.answers = [];
    },
    submit_question : function(success, error){
        var obj = new Object();
        obj.qid = this.qid;
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
            url: "/question/jsubmit/"+this.qid+"/",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success : success,
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
},
{
});

});