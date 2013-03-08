// load('enigma53/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("enigma53/enigma53.html","enigma53/out")
});
