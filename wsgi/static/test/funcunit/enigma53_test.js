steal("funcunit", function(){
	module("enigma53 test", { 
		setup: function(){
			S.open("//enigma53/enigma53.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})