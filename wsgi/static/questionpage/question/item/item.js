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
                model : null,

                init : function(){
                    this.model = new Question();
                    var id = parseInt(this.element.attr("name").split("question")[1]);
                    var question = this.model;
                                                        // Change to this.model
                    this.element.html(this.view('init', Question.findOne({id:id}, function(data){
                        question.qid = data.id;
                        question.nextquestionid = data.id;
                        question.quizid = data.quizid;
                        question.qtext = data.qtext;
                        question.answers = data.answers;
                        console.log( "received a question:" );
                        console.log( "id - " + data.id );
                        console.log( "quizid - " + data.quizid );
                        console.log( "qtext - " + data.qtext );

                        for(var i=0; i<question.answers.length; i++){
                            question.answers[i].value = 'F';
                            console.log( "answer:"+i+" - "+ question.answers[i].value );
                        }

                    })));
                },
                ".question-submit-btn click" : function(el){
                    this.model.submit_question();
                    Quizpage.Quiz.Navigator.to_next_tab();
                },
/*                ".question-edit-btn click" : function(el){
                    document.location.href = '/quiz/'+this.model.quizid+'/edit/';
                },*/
                ".answer-checkbox click" : function(el){
                    var id = parseInt(el.attr("id").split("answer")[1]);
                    var answer = this.model.get_answer_by_id(id);
                    if(el.prop('checked')){
                        answer.value = 'T';
                    }else{
                        answer.value = 'F';
                    }
                }
            });
    });