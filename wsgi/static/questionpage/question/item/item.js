steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models',
    
    'pagedown/Markdown.js'
    
    ).then('./views/init.ejs', function($){
        $.Controller('Questionpage.Question.Item',
            {

            },
            {
                model : null,

                init : function(){
                	var self = this;
                	var onSuccess = self.options.onSuccess;
                    var questionControls = self.options.questionControls;

                    this.model = new Question();
                    var id = parseInt(self.element.attr("name").split("question")[1]);
                    var question = self.model;
                                                        // Change to this.model
                    
                    this.element.html(this.view('init', Question.findOne({id:id}, function(data){
                        question.qid = data.id;
                        question.quizid = data.quizid;
                        question.qtext = data.qtext;
                        question.answers = data.answers;
                        question.lon = parseFloat(data.lon);
                        question.lat = parseFloat(data.lat);
                        
                        //question.editor = self.loadPageDownEditor(question.qid, questionControls);

                        for(var i=0; i<question.answers.length; i++){
                            question.answers[i].value = 'F';
                            console.log( "answer:"+i+" - "+ question.answers[i].value );
                        }
                        if(onSuccess != null){
                        	onSuccess(question);
                        }

                    })));
                },
                ".question-submit-btn click" : function(el){
                    this.model.submit_question();
                    Quizpage.Quiz.Navigator.to_next_tab();
                },
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