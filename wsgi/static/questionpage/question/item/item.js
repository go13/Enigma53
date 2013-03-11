steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/dom/form_params',
    'jquery/controller/view',
    'questionpage/models' )
    .then('./views/init.ejs', function($){

        /**
         * @class Enigma53.Question.Item
         * @parent index
         * @inherits jQuery.Controller
         * Creates questions
         */
        $.Controller('Questionpage.Question.Item',
            /** @Prototype */
            {
                init : function(){
                    var obj = new Object();
                    obj.qtext = "qtext";

                    var a1 = new Object();
                    a1.atext = "atext";
                    obj.answers = [a1];

                    this.element.html(this.view('init', {question:obj}));
                }
            })

    });