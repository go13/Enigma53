from flask import Blueprint, render_template, jsonify, request, redirect, current_app
from modules.jsonschema import validate, Draft4Validator

from model import db
from quiz import Quiz
from question.question import Question
from quiz_result import QuizResult
from modules.results import Historysession
from flask_login import login_required, current_user

quiz_bp = Blueprint('quiz_bp', __name__, template_folder='pages')

@quiz_bp.route('/<int:quiz_id>/')
def quiz(quiz_id):
    current_app.logger.debug("quiz. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    if quiz:    
        QuizResult.start_session(quiz_id, current_user.id)
        
        return render_template('quiz.html', quiz = quiz)
    else:
        current_app.logger.warning("No quiz found")
        return render_template('404.html')
        
@quiz_bp.route('/<int:quiz_id>/home/')
def quiz_home(quiz_id):
    current_app.logger.debug("quiz_home. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:        
        results = QuizResult.get_quiz_results_by_quiz_id(quiz_id)        
        return render_template('quiz_home.html', quiz = quiz, results = results)
    else:
        current_app.logger.warning("No quiz found")        
        return render_template('404.html')

@quiz_bp.route('/<int:quiz_id>/edit/')
@login_required
def quiz_edit(quiz_id):
    current_app.logger.debug("quiz_edit. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:        
        return render_template('quiz_edit.html', quiz=quiz)
    else:
        current_app.logger.warning("No quiz found")        
        return render_template('404.html')

# TODO - check ho to convert form strings to unicode
@quiz_bp.route('/<int:quiz_id>/settings/', methods = ["GET", "POST"])
@login_required
def quiz_settings(quiz_id):
    current_app.logger.debug(request.method + " quiz_settings. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:
        if request.method == "POST":            
            
            title = request.form["title"] 
            description = request.form["description"]
        
            if len(title) > 128:
                current_app.logger.warning("Error posting quiz details. Title is too long - " + str(len(title)))
            elif len(description) > 32768:
                current_app.logger.warning("Error posting quiz details. Description is too long " + str(len(description)))
            else:                
                quiz.title = title
                quiz.description = description
                Quiz.update_quiz(quiz)

                current_app.logger.debug("Updated the quiz" )
                
        return render_template('quiz_settings.html', quiz = quiz)
    else:
        current_app.logger.warning("No quiz found")
        
        return render_template('404.html')

@quiz_bp.route('/list/')
@login_required
def quiz_list():
    current_app.logger.debug("quiz_list")
    
    quizes=Quiz.get_quiz_by_userid(current_user.id)
    
    if quizes:
        return render_template('quiz_list.html', quizes=quizes)
    else:
        current_app.logger.warning("No quizes found")
        
        return render_template('404.html')

@quiz_bp.route('/jget/<int:quiz_id>/')
def jget(quiz_id):
    current_app.logger.debug("jget. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:
        result = {'status':'OK'}
        result.update(quiz.serialize)
       
        return jsonify(result)
    else:
        current_app.logger.warning("Quiz not found")
        return jsonify({"status":"ERROR"})

@quiz_bp.route('/jdelete/<int:quiz_id>/', methods=['DELETE'])
@login_required
def jdelete(quiz_id):
    current_app.logger.debug("jdelete. quiz_id - " + str(quiz_id))

    QuizResult.delete_quizresults_by_quiz_id(quiz_id, True)
    Quiz.delete_quiz_by_id(quiz_id, False)
    
    current_app.logger.debug("Quiz deleted")
    
    return jsonify({"status":"OK"})
    
@quiz_bp.route('/jcreate/', methods=['CREATE'])
@login_required
def jcreate():
    current_app.logger.debug("jcreate")
    
    schema = {
        "type" : "object",
        "properties" : {            
            "title" : {"type" : "string", "maxLength" : 128 } # "pattern" : "^[A-Za-z0-9\?\%\)\(\&\*\!\=\+\-\,\.\t\ ]*$", "maxLength" : 128}
            },
        "required" : ["title"]
        }
        
    v = Draft4Validator(schema)
    errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)
        
    if len(errors) > 0:
        message = 'Error creating a quiz. Received json is not valid'
        
        current_app.logger.error(message)
        
        #causes = []
        #for error in errors:            
        #    causes.append(error.message)     
        
        result = {"status" : "ERROR", "message" : message} # "causes" : causes }
        
        current_app.logger.error(result)
                    
        return jsonify(result) #, "causes" : causes })
    else:        
        title = request.json['title']
        
        quiz = Quiz.create_quiz('description', title, current_user.id)
        
        current_app.logger.debug('Quiz created. Title - ' + title + ', id - ' + quiz.id)   
        
        return jsonify({"status" : "OK", "quizid" : quiz.id})

@quiz_bp.route('/<int:quiz_id>/finish/') #, methods=['POST'])
@login_required
def finish_session(quiz_id):
    current_app.logger.debug('finish_session')

    qr=QuizResult.finish_session(quiz_id, current_user.id)

    if qr:
        current_app.logger.debug('Finishing the session')
        
        return redirect("/quiz/results/" + str(qr.sessionid))
    else:
        current_app.logger.debug("No such quiz found")        
        return render_template('404.html')
        