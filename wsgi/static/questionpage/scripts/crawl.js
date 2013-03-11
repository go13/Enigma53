// load('Questionpage/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("questionpage/questionpage.html","questionpage/out")
});
