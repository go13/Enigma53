steal('jquery/controller'//,
//    'jquery/controller/route'
)
    .then(function($){

        $.Controller('Questionpage.Question.Router',
            {
                "save route" :function(){
                    alert('save');
                },
                "edit route" :function(){
                    alert('edit');
                }
            });
    });