from flask import Blueprint, render_template, jsonify, request, redirect, current_app, flash, url_for
from modules.jsonschema import validate, Draft4Validator
from wtforms import Form, TextField, validators

from model import db
from quiz import Quiz
from quiz_result import QuizResult
from flask_login import login_required, current_user

quiz_bp = Blueprint('quiz_bp', __name__, template_folder = 'pages')
auth_failure_message = u"You don't have permissions to "

@quiz_bp.route('/<int:quiz_id>/')
@login_required
def quiz(quiz_id):
    current_app.logger.debug("quiz. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    if quiz:            
        if current_user.id == quiz.userid:
            QuizResult.start_session(quiz_id, current_user.id)
            return render_template('quiz.html', quiz = quiz)
        else:
            return render_template('auth_failure.html')            
    else:
        current_app.logger.warning("No quiz found")
        return render_template('404.html')

@quiz_bp.route('/<int:quiz_id>/edit/')
@login_required
def quiz_map_edit(quiz_id):
    current_app.logger.debug("quiz_edit. quiz_id - " + str(quiz_id))

    quizes = Quiz.get_quizes_by_userid(current_user.id)

    quiz = Quiz.get_quiz_by_id(quiz_id)

    if quiz:
        current_app.logger.debug("quiz_edit. current_user.id - " + str(current_user.id) + " userid - " + str(quiz.userid))
        if current_user.id == quiz.userid:
            return render_template('quiz_map_edit.html', quiz = quiz, quizes = quizes, active_page = "quiz_edit")
        else:
            return render_template('auth_failure.html')
    else:
        current_app.logger.warning("No quiz found")        
        return render_template('404.html')

@quiz_bp.route('/<int:quiz_id>/results/')
@login_required
def quiz_results_tsv(quiz_id):
    current_app.logger.debug("quiz_results_tsv. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:        
        if current_user.id == quiz.userid:
            results = QuizResult.get_quiz_results_by_quiz_id(quiz_id)
            return render_template('quiz_results.html', quiz = quiz, results = results)
        else:
            return render_template('auth_failure.html')
    else:
        current_app.logger.warning("No quiz found")        
        return render_template('404.html')

class CreateForm(Form):
    title = TextField('Quiz title', [
        validators.Length(min = 1, max = 128),
        validators.Required()
        ])

@quiz_bp.route('/list/')
@login_required
def quiz_list():
    current_app.logger.debug("quiz_list")

    quizes = Quiz.get_quizes_by_userid(current_user.id)

    return render_template('quiz_list.html', quizes = quizes, active_page = "quiz_list")

@quiz_bp.route('/jupdate/<int:quiz_id>/', methods = ["GET", "POST"])
def jupdate(quiz_id):
    current_app.logger.debug("jupdate. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:
        if current_user.id == quiz.userid:
            schema = {
                "type" : "object",
                "properties" : {            
                    "title" : {"type" : "string", "minLength" : 5, "maxLength" : 55, "optional" : False},
                    }
                }

            v = Draft4Validator(schema)
            errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)
    
            if len(errors) > 0:
                msg = u"Error : "
                if len(request.json['title']) < 5 or len(request.json['title']) > 55:
                    msg = u"Title length should be greater than 4 and less than 55 symbols"                    
                else:
                    for e in errors:
                        msg = msg +e.message.decode("UTF-8")
                    
                result = {"status" : "ERROR", "message" : msg}        
                current_app.logger.warning(result)
                return jsonify(result)
            else:
                title = request.json['title']
                
                quiz = Quiz.update_quiz_by_id(quiz_id, {'title' : title}, False)
                
                current_app.logger.debug('Quiz updated. quiz.id - ' + str(quiz_id) + ', title - ' + title)
                return jsonify({"status" : "OK", "quizid" : quiz_id})
        else:
            msg = auth_failure_message + u"update this quiz(id = " + str(quiz_id).decode("UTF-8")+")"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})
    else:
        msg = u"No quiz found with such quiz_id" + str(quiz_id).decode("UTF-8")
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message" : msg})
    
@quiz_bp.route('/jget/<int:quiz_id>/')
def jget(quiz_id):
    current_app.logger.debug("jget. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:
        if current_user.id == quiz.userid:
            result = {'status' : 'OK'}
            result.update(quiz.serialize)
           
            return jsonify(result)
        else:
            msg = auth_failure_message + u"view this quiz(id = " + str(quiz_id).decode("UTF-8")+")"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})
    else:
        msg = u"No quiz found with such quiz_id" + str(quiz_id).decode("UTF-8")
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message" : msg})

@quiz_bp.route('/jdelete/<int:quiz_id>/', methods = ['DELETE'])
@login_required
def jdelete(quiz_id):
    current_app.logger.debug("jdelete. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:
        if current_user.id == quiz.userid:
            QuizResult.delete_quizresults_by_quiz_id(quiz_id, True)
            Quiz.delete_quiz_by_id(quiz_id, False)
        
            current_app.logger.debug("Quiz deleted")
        
            return jsonify({"status":"OK"})
        else:
            msg = auth_failure_message + u"delete this quiz(id = " + str(quiz_id).decode("UTF-8")+")"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})
    else:
        msg = u"No quiz found with such quiz_id" + str(quiz_id).decode("UTF-8")
        current_app.logger.warning(msg)        
        return jsonify({"status" : "ERROR", "message" : msg})
    
@quiz_bp.route('/jcreate/', methods = ['POST'])
@login_required
def jcreate():
    current_app.logger.debug("jcreate")
    
    schema = {
        "type" : "object",
        "properties" : {            
            "title" : {"type" : "string", "minLength" : 5,"maxLength" : 55, "optional" : False}
            }
        }
        
    v = Draft4Validator(schema)
    errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)
        
    if len(errors) > 0:
        msg = u"Error : "
        if len(request.json['title']) < 5 or len(request.json['title']) > 55:
            msg = u"Title length should be greater than 4 and less than 55 symbols"                    
        else:
            for e in errors:
                msg = msg + e.message.decode("UTF-8")
            
        result = {"status" : "ERROR", "message" : msg}
        current_app.logger.warning(result)
        return jsonify(result)
    else:        
        title = request.json['title']
        
        quiz = Quiz.create_quiz(title, current_user.id)
        
        current_app.logger.debug('Quiz created. quiz.id - ' + str(id))   
        
        return jsonify({"status" : "OK", "quizid" : quiz.id})

@quiz_bp.route('/create/')
@login_required
def create():
    current_app.logger.debug("create")

    quiz = Quiz.create_quiz('New Quiz', current_user.id)
    
    current_app.logger.debug('Quiz created. quiz.id - ' + str(quiz.id))   
    
    return redirect("/quiz/" + str(quiz.id) + "/edit/")


@quiz_bp.route('/<int:quiz_id>/finish/')
@login_required
def finish_session(quiz_id):
    current_app.logger.debug('finish_session')

    qr = QuizResult.finish_session(quiz_id, current_user.id)

    if qr:        
        if current_user.id == qr.quiz.userid:
            QuizResult.start_session(quiz_id, current_user.id)
            current_app.logger.debug('Finishing the session')
            return redirect("/quiz/results/" + str(qr.sessionid))
        else:
            return render_template('auth_failure.html')
    else:
        current_app.logger.warning("No such quiz found")        
        return render_template('404.html')