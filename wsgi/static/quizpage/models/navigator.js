steal('jquery/model', function(){
    $.Model('Navigator',
        /* @Static */
        {
            defaults : {
                questions : null,
                quizid : 0,
                current_question : null,
                current_question_num : -1
            }
        },{
            init : function(){
                this.questions = [];
            },
            add_question : function (question){
                this.questions.push(question);
            },
            get_question_by_id : function(qid){
            	var res = null;
            	for(var i = 0; i <= this.questions.length; i++){
            		if(qid === this.questions[i].qid){
            			res = this.questions[i];
            			break;
            		}
            	} 
            	return res;
            },
            get_question_by_mk : function(mk){
            	var res = null;
            	for(var i = 0; i <= this.questions.length; i++){
            		if(mk === this.questions[i].gmarker){
            			res = this.questions[i];
            			break;
            		}
            	} 
            	return res;
            },
            remove_question_by_id : function(qid){
                if(this.questions.length === 0){
                   return false;
                }else{
                    var b = false;
                    for(var i = 0; i < this.questions.length; i++){
                        if(qid === this.questions[i].qid){
                            this.questions.splice(i, 1);
                            b = true;
                            break;
                        }
                    }
                    if(b){
                        if(this.questions.length > 0){
                            this.current_question = this.questions[0];
                            this.current_question_num = 0;
                        }else{
                            this.current_question = null;
                            this.current_question_num = -1;
                        }
                    }
                    return b;
                }
            },
            set_current_question_by_id : function(qid){
                if(qid == null || isNaN(qid) || this.questions.length === 0){
                    this.current_question = null;
                    this.current_question_num = -1;
                    return this.current_question_num;
                }else{
                    if(qid === -1){
                        this.current_question = this.questions[0];
                        this.current_question_num = 0;
                        return -1;
                    }else{
                        for(var i = 0; i < this.questions.length; i++){
                            if(qid === this.questions[i].qid){
                                this.current_question = this.questions[i];
                                this.current_question_num = i;
                                break;
                            }
                        }
                        return this.current_question_num;
                    }
                }
            },
            to_next_question : function(){
                if(this.questions.length === 0){
                    this.current_question = null;
                    this.current_question_num = -1;
                    return null;
                }else{
                    if(this.current_question == null){
                        this.current_question = this.questions[0];
                        this.current_question_num = 0;
                    }else{
                        if(this.current_question_num + 1 < this.questions.length){
                            this.current_question_num ++;
                            this.current_question = this.questions[this.current_question_num];
                        }
                    }
                    return this.current_question.qid;
                }
            },
            to_prev_question : function(){
                if(this.questions.length === 0){
                    this.current_question = null;
                    this.current_question_num = -1;
                    return null;
                }else{
                    if(this.current_question == null){
                        this.current_question = this.questions[this.questions.length-1];
                        this.current_question_num = this.questions.length-1;
                    }else{
                        if(this.current_question_num-1 >= 0){
                            this.current_question_num--;
                            this.current_question = this.questions[this.current_question_num];
                        }
                    }
                    return this.current_question.qid;
                }
            }
        });
});