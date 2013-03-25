steal('jquery/model', function(){

$.Model('Questionedit',
/* @Static */
{
    defaults : {
        qid : 0,
        nextquestionid : 0,
        quizid : 0,
        qtext : "" ,
        answers : [],

        atext : "Type your answer here...",
        correct : 1
    },
    findAll: "/questions.json",
    findOne : "/question/jget_for_edit/{id}/",
    create : "/questions.json",
    destroy : "/questions/{id}.json"
},{
    get_answer_by_id : function(id){
        var result = null;
        for(var i=0; i< this.answers.length; i++){
            if(this.answers[i].id == id){
                result = this.answers[i];
                break;
            }
        }
        return result;
    },
    remove_answer_by_id : function(id){
        for(var i=0; i<this.answers.length; i++){
            if(this.answers[i].id == id){
                this.answers.splice(i,1);
                break;
            }
        }
    },
    save : function(success, error){
        var obj = new Object();
        obj.qid = this.qid;
        obj.qtext = this.qtext;
        obj.answers = this.answers;

        // TODO refactor answers so they dont have unnecessary fields

        $.ajax({
            type: "POST",
            url: "/question/jupd/"+this.qid+"/",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            success : success,
            error: function (error){
                alert("There was an error posting the data to the server: " + error.responseText);
            }
        });
    },
    submit_question : function(success, error){
        var obj = new Object();
        obj.qid = this.qid;
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
            error: function (error){
                alert("There was an error posting the data to the server: " + error.responseText);
            }
        });
    }
},
{
});

});