function qanswer_delete(self){
	$(self).parent().parent('.qanswer').remove();	
}

function qanswer_check(self){
	$(self).children('i:first').toggleClass('icon-ok icon-ban-circle');
}

function qanswer_add(self){
	var st = '';
	var maxqid = 1;
	$('#questions').children('.qanswer').each(function(){
		var id = parseInt($(this).attr('id'));
		st = st + id;
		if(maxqid <= id){
			maxqid = id + 1;
		}
	});
	$( '#answer_template' ).tmpl( { 'AnswerId' : maxqid }  ).appendTo( '#questions' );
}