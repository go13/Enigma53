steal( 'jquery/controller',		
		'jquery/view/ejs',
		'jquery/controller/view',
		'quizpage/models/listitem.js'
    ).then('./views/init.ejs', function($){

        $.Controller('Quizpage.Quiz.Listitem',
            /** @Prototype */
            {     
        		defaults : {
        			model : null
        		},
		    	create : function(title, success){
		    		var el = $("<tr name='quiznew'></tr>"); 
		    		var c = new Quizpage.Quiz.Listitem(el);
		    		c.model.title = title;
		    		
		    		c.model.create(function(){
		    			Pagemessage.Message.Item.show_message("Success", "Created");
		    			c.element.html(c.view('init', c.model));
		    			success(c.model, el);
		    		});		    		
				}
            },{               
                init : function(){
                    var quiz_name = this.element.attr("name");
                    if(quiz_name !== "quiznew"){
	                    var quizid = parseInt(quiz_name.split("quiz")[1]);
	                    this.model = new Listitem({quizid : quizid});
                    }else{
                    	this.model = new Listitem();                    	
                    }
                },                
                ".quiz-list-item-start click" : function(){
                    window.location.href='/quiz/'+this.model.quizid;
                },
                ".quiz-list-item-delete click" : function(){
                    var el = this.element;
                    $.ajax({
                        type: "DELETE",
                        url: "/quiz/jdelete/"+this.model.quizid+"/",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify("delete-quiz"),
                        success :  function(){
                            el.remove();
                            Pagemessage.Message.Item.show_message("Success", "Deleted");
                        },
                        error: function (error){
                            alert("There was an error posting the data to the server: " + error.responseText);
                        }
                    });
                },
                ".quiz-list-item-edit click" : function(){
                    window.location.href='/quiz/'+this.model.quizid+'/edit/';
                }
            });
    });