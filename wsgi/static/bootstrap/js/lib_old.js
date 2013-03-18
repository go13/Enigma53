function qanswer_delete(self){
	$(self).parent().parent('.qanswer').remove();	
}

function qanswer_check(self){
	$(self).children('i:first').toggleClass('icon-ok icon-ban-circle');
	if($(self).children('i:first').hasClass('icon-ok')){
		$(self).data('checked', 'T');	
	}else{
		$(self).data('checked', 'F');
	};
}

function qanswer_add(self){
	$( '#answer_template' ).tmpl( { 'AnswerId' : 1 }  )
		.appendTo( '#answers' );
}

function edit_question_submit(){
	var question = new Object();
	question.answers = [];
	question.qtext = $('#qtext').val();
	
	var url = window.location.href;
	url = url.split('/');	
	question.qid = url[4];
	
	$('#answers').children().each(function(){
		var atext = $(this).children('input:first').attr('value');
		var correct = 'F';
		
		if(	$(this).children('.qanswer-check:first').
					children('i:first').
					hasClass('icon-ok')){
			correct = 'T';
		};
		
		var answer = new Object();
		answer.atext = atext;
		answer.correct = correct;
		question.answers.push(answer);	
	});
	
	if(question != null){		
		$.ajax({
		    type: "POST",
		    url: "/question/edit_question_submit/",
		    data: JSON.stringify(question),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function(data){
		    	window.location.replace(data.redirect);
		    },
		    failure: function(errMsg) {
		        alert(errMsg);
		    }
		});
		
	}else{
		alert('No answers! Please add an answer.');
	}	
}
