// map fixtures for this application

steal('jquery/dom/fixture', function(){
	
	$.fixture.make("question", 5, function(i, question){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "question "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
})