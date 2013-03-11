steal("funcunit", function(){
	module("question_page test", { 
		setup: function(){
			S.open("//questionpage/question_page.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})