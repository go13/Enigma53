steal( 'jquery/controller',
    'jquery/view/ejs',
    'jquery/dom/form_params',
    'jquery/controller/view',
    'questionpage/models')
    .then('./views/init.ejs', function($){
        //$.fixture.on = false;

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

                    //var obj = ; //questionpage.Models.
                    //obj.qtext = questionpage.Models.Question.findOne(2).question.qtext;

                    //var a1 = new Object();
                    //a1.atext = "atext";
                    //obj.answers = [a1];
                    //alert(obj.question);
                    this.element.html(this.view('init', Question.findOne({id:2})));
                }
            });


    });