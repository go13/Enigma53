steal('funcunit',function(){

module("Enigma53.Question.List", { 
	setup: function(){
		S.open("//enigma53/question/list/list.html");
	}
});

test("delete questions", function(){
	S('#create').click()
	
	// wait until grilled cheese has been added
	S('h3:contains(Grilled Cheese X)').exists();
	
	S.confirm(true);
	S('h3:last a').click();
	
	
	S('h3:contains(Grilled Cheese)').missing(function(){
		ok(true,"Grilled Cheese Removed")
	});
	
});


});