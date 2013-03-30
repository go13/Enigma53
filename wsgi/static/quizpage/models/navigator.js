steal('jquery/model', function(){
    $.Model('Navigator',
        /* @Static */
        {
            defaults : {
                questions : null,
                quizid : 0
            }
        },{
            init : function(){
                this.questions = new Array();
            },
            add_question : function (question){
                this.questions.push(question);
            },
            remove_question : function (qid){
                var questions = this.questions;
                for(var i = 0; i < questions.length; i++){
                    if(qid === questions[i].qid){
                        questions.splice(i, 1);
                        break;
                    }
                }
            }
        });
});