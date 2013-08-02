steal(
    'quizpage/models/models.js',		// steals all your models
    'quizpage/quiz/navigator',

    'questionpage/models/models.js',
    'questionpage/question/edit',

    'quizpage/quiz/cquizedit',
    
    'quizpage/quizmap/cmapedit',

    'quizpage/quiz/quizlist',
    'quizpage/quiz/listitem',
    
    'quizpage/csettings',   
    
    'js/d3.v3.min.js',    

    //'libs/jquery.timeago.js',
    
    function(){	// configure your application
    	$("#question-map").quizpage_quizmap_cmapedit();
    	    	
    	$("#quiz-navigator").quizpage_quiz_cquizedit({onSuccess : function (){
    		Quizpage.Quizmap.Cmapedit.loadPoints();    		
    	}});
    	
    	$("#tab-settings").quizpage_csettings();

    	$(".quiz-list-container").quizpage_quiz_quizlist();
    	
        Messenger.options = {
        		extraClasses: 'messenger-fixed messenger-on-bottom',
        		'maxMessages': 3,
        		theme: 'air'
        };

        var tour = new Tour({
            name: "tour",
            container: "#tour-container"
        });

        tour.addSteps([
            {
                element: "#question-map-hint",
                title: "1/7",
                content: "<b>Right click</b> on the map to create a question associated with this place.",
                placement: "bottom",
                onShow: function(tour) {
                    onQuizesMenuItemClick(false);
                }
            },{
                element: "#tabs-container .tab-pane.active .wmd-button-row",
                title: "2/7",
                content: "This is a Markdown editor which allows you to add <b>Checkboxes</b> and <b>Explanation sections</b>.",
                placement: 'left'
            } ,{
                element: "#tabs-container .tab-pane.active .wmd-button[title='Add Checkbox ?[+]']",
                title: "3/7",
                content: "Checkboxes are marekd as <b>?[+]</b> for correct answers and <b>?[-]</b> for incorrect.<br><br> You can either click here to add one or put it manually in the editor.<br><br>",
                placement: 'left'
            }, {
                element: "#tabs-container .tab-pane.active .wmd-button[title='Add Explanation %[ Put text here ]%']",
                title: "4/7",
                content: "Explanation sections are marked as <br><br><b>%[ This explanation text is shown on the page of results ]%</b><br><br> You can either click here to add one or put it manually to the editor</b>.",
                placement: 'left'
            }, {
                element: "#tabs-container .tab-pane.active .wmd-input",
                title: "5/7",
                content: "Put the following text to see it rendered in the field below the editor: <br><br>" +
                "Who is the main character of Lewis Carroll's book?<br><br>" +
                "?[+] Alice<br><br>" +
                "?[-] Bob<br><br>" +
                "?[-] No correct answers<br><br>" +
                "%[ The book is 'Alice in wonderland' ]%",
                placement: 'left'
            },{
                element: "#tabs-container .tab-pane.active .wmd-button[title='Save Question']",
                title: "6/7",
                content: "Click this button to save current question.",
                placement: 'left'
            },{
                element: "#startquiz",
                title: "7/7",
                content: "Finally, start the quiz you created.",
                placement: 'left'
            }
        ]);

        tour.restart();
        tour.showStep(0);
})