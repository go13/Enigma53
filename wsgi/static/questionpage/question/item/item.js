steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models')
    .then('./views/init.ejs', function($){
        $.Controller('Questionpage.Question.Item',
            {

            },
            {
                model : new Question(),

                init : function(){
                    var id = this.element.attr("name").split("question")[1];
                    var question = this.model;
                                                        // Change to this.model
                    this.element.html(this.view('init', Question.findOne({id:id}, function(data){
                        question.qid = data.id;
                        question.nextquestionid = data.id;
                        question.quizid = data.quizid;
                        question.qtext = data.qtext;
                        question.answers = data.answers;
                        for(var i=0; i<question.answers.length; i++){
                            question.answers[i].value='0';
                        }
                        console.log( "received a question:" );
                        console.log( "id - " + data.id );
                        console.log( "quizid - " + data.quizid );
                        console.log( "qtext - " + data.qtext );
                    })));
                },
                ".question-submit click" : function(el){
                    this.model.submit_question();
                    //document.location.href = '/question/'+this.model.qid;
                },
                ".answer-checkbox click" : function(el){
                    var id = el.attr("id").split("answer")[1];
                    var answer = this.model.get_answer_by_id(id);
                    if(el.prop('checked')){
                        answer.value = '1';
                    }else{
                        answer.value = '0';
                    }
                }
            });
    });