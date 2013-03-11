//js enigma53/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('enigma53/enigma53.html', {
		markdown : ['enigma53']
	});
});