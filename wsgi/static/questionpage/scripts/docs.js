//js Questionpage/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('questionpage/questionpage.html', {
		markdown : ['questionpage']
	});
});