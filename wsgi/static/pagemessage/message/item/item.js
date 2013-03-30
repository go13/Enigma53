steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'pagemessage/models')
    .then('./views/messages.ejs', function($){
        $.Controller('Pagemessage.Message.Item',
            {
                instance: null,

               /* default : {
                    message : "Success",
                    type : "Success",
                    time : 0
                }*/
                show_message : function(type, message){
                    var instance = Pagemessage.Message.Item.instance;
                    var model = new Message({message:message, type:type});

                    var el = instance.element;
                    el.html(instance.view('messages', model));

                    setTimeout(function(){
                        el.children().first().fadeOut(2000, function(){
                            el.empty();
                        });
                    }, 500);
                }
            },
            {
                init : function(){
                   Pagemessage.Message.Item.instance = this;
                }
            });
    });