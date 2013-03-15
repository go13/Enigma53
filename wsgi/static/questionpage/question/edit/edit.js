steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/dom/form_params',
    'jquery/controller/view',
    'questionpage/models')
    .then('./views/init.ejs', function($){
        //$.fixture.on = false;

        $.Controller('Questionpage.Question.Edit',
            {
                init : function(){
                    this.element.html(this.view('init', Question.findOne({id:2}, function( data ){
                        console.log( "received a question" + data.status );
                        console.log( "id - " + data.id );
                        console.log( "quizid - " + data.quizid );
                        console.log( "qtext - " + data.qtext );
                    })));
                }
            });
    });