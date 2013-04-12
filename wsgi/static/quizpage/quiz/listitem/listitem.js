steal( 'jquery/controller'
    ).then(function($){

        $.Controller('Quizpage.Quiz.Listitem',
            /** @Prototype */
            {


            },{
                quizid : 0,

                init : function(){
                    var quiz_name = this.element.attr("name");
                    this.quizid = parseInt(quiz_name.split("quiz")[1]);
                },
                ".quiz-list-item-start click" : function(){
                    window.location.href='/quiz/'+this.quizid;
                },
                ".quiz-list-item-delete click" : function(){
                    var el = this.element;
                    $.ajax({
                        type: "DELETE",
                        url: "/quiz/jdelete/"+this.quizid+"/",
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
                    window.location.href='/quiz/'+this.quizid+'/edit/';
                }
            });
    });