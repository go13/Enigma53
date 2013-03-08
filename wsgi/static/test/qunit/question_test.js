steal("funcunit/qunit", "enigma53/fixtures", "enigma53/models/question.js", function(){
	module("Model: Enigma53.Models.Question")
	
	test("findAll", function(){
		expect(4);
		stop();
		Enigma53.Models.Question.findAll({}, function(questions){
			ok(questions)
	        ok(questions.length)
	        ok(questions[0].name)
	        ok(questions[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Enigma53.Models.Question({name: "dry cleaning", description: "take to street corner"}).save(function(question){
			ok(question);
	        ok(question.id);
	        equals(question.name,"dry cleaning")
	        question.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Enigma53.Models.Question({name: "cook dinner", description: "chicken"}).
	            save(function(question){
	            	equals(question.description,"chicken");
	        		question.update({description: "steak"},function(question){
	        			equals(question.description,"steak");
	        			question.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Enigma53.Models.Question({name: "mow grass", description: "use riding mower"}).
	            destroy(function(question){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})