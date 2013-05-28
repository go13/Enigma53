steal('jquery/model', function(){
    $.Model('Mapmodel',
        /* @Static */
        {
            defaults : {
            	markers : null,
            	map : null
            }
        },{
            init : function init(){
                this.markers = [];
            },
            add_marker : function add_marker(mk){
                this.markers.push(mk);
            },
     });
});