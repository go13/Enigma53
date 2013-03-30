steal('jquery/model', function(){

    $.Model('Message',
        /* @Static */
        {
            defaults : {
                type : "Success",
                message : "Success"
            }
        },{
            set_message_type : function(type, message){
                this.type = type;
                this.text = message;
            }
        });
});