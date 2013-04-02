steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'questionpage/models')
    .then('./views/init.ejs', function($){
        $.Controller('Questionpage.Question.Result',
            {

            },
            {
                init : function(){
                }
            });
    });