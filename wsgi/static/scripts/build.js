//js enigma53/scripts/build.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
	steal.build('enigma53/scripts/build.html',{to: 'enigma53'});
});
