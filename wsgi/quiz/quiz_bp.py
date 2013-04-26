from flask import Blueprint, render_template, jsonify, request, redirect, current_app, flash, url_for
from modules.jsonschema import validate, Draft4Validator
from wtforms import Form, TextField, validators

from model import db
from quiz import Quiz
from question.question import Question
from quiz_result import QuizResult
from modules.results import Historysession
from flask_login import login_required, current_user

quiz_bp = Blueprint('quiz_bp', __name__, template_folder = 'pages')

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
        return render_template('quiz_edit.html', quiz = quiz)
    else:
        current_app.logger.warning("No quiz found")        
        return render_template('404.html')

class CreateForm(Form):
    title = TextField('Title', [
        validators.Length(min = 1, max = 128),
        validators.Required()
        ])
        
    description = TextField('Description', [
        validators.Length(max = 32768),
        validators.Optional()
        ])


@quiz_bp.route('/create/', methods = ['POST'])
@login_required
def create():
    current_app.logger.debug(request.method + " create")
    
    form = CreateForm(request.form)    
    
    if form.validate():
        current_app.logger.debug("login validation successful")
                
        title = form.title.data
        description = form.description.data   
        
        quiz = Quiz.create_quiz(description, title, current_user.id)
        if quiz:
            msg = u"Quiz created" 
            current_app.logger.debug(msg)        
            flash(msg, "success")
        else:
            msg = u"Could not create a quiz"            
            current_app.logger.debug(msg)        
            flash(msg, "error")
            
    return redirect(url_for("quiz_edit"))

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
            
            if not title:
                msg = u"Error posting quiz details. No title field passed in the form" 
                current_app.logger.warning(msg)
                flash(msg, "error")
            elif not description:
                msg = u"Error posting quiz details. No description field passed in the form"
                current_app.logger.warning(msg)
                flash(msg, "error")
            elif len(title) > 128:
                msg = u"Error posting quiz details. Title is too long - " + str(len(title).decode("UTF-8"))
                current_app.logger.warning(msg)
                flash(msg, "error")
            elif len(description) > 32768:
                msg = u"Error posting quiz details. Description is too long " + str(len(description).decode("UTF-8")) 
                current_app.logger.warning(msg)
                flash(msg, "error")
            else:                
                if isinstance(title, str):
                    quiz.title = title.decode('UTF-8')
                else:
                    quiz.title = title
                    
                if isinstance(title, str):
                    quiz.description = description.decode('UTF-8')
                else:
                    quiz.description = description
                                    
                Quiz.update_quiz(quiz)
                
                msg = u"Updated the quiz"
                current_app.logger.debug(msg)
                flash(msg, "success")
                
        return render_template('quiz_settings.html', quiz = quiz)
    else:
        current_app.logger.warning("No quiz found")
        
        return render_template('404.html')

@quiz_bp.route('/list/')
@login_required
def quiz_list():
    current_app.logger.debug("quiz_list")
    
    quizes = Quiz.get_quiz_by_userid(current_user.id)
    
    if quizes:
        return render_template('quiz_list.html', quizes = quizes)
    else:
        current_app.logger.warning("No quizes found")
        
        return render_template('404.html')

@quiz_bp.route('/jget/<int:quiz_id>/')
def jget(quiz_id):
    current_app.logger.debug("jget. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:
        result = {'status' : 'OK'}
        result.update(quiz.serialize)
       
        return jsonify(result)
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
        QuizResult.delete_quizresults_by_quiz_id(quiz_id, True)
        Quiz.delete_quiz_by_id(quiz_id, False)
    
        current_app.logger.debug("Quiz deleted")
    
        return jsonify({"status":"OK"})
        
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
            "title" : {"type" : "string", "maxLength" : 128, "optional" : False} # "pattern" : "^[A-Za-z0-9\?\%\)\(\&\*\!\=\+\-\,\.\t\ ]*$", "maxLength" : 128}
            }#,
        #"required" : ["title"]
        }
        
    v = Draft4Validator(schema)
    errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)
        
    if len(errors) > 0:
        msg = 'Error creating a quiz. Received json is not valid'
        
        #causes = []
        #for error in errors:            
        #    causes.append(error.message)     
        
        result = {"status" : "ERROR", "message" : msg} # "causes" : causes }
        
        current_app.logger.warning(result)
                    
        return jsonify(result) #, "causes" : causes })
    else:        
        title = request.json['title']
        
        quiz = Quiz.create_quiz('description', title, current_user.id)
        
        current_app.logger.debug('Quiz created. quiz.id - ' + str(id))   
        
        return jsonify({"status" : "OK", "quizid" : quiz.id})

@quiz_bp.route('/<int:quiz_id>/finish/') #, methods=['POST'])
@login_required
def finish_session(quiz_id):
    current_app.logger.debug('finish_session')

    qr = QuizResult.finish_session(quiz_id, current_user.id)

    if qr:
        current_app.logger.debug('Finishing the session')
        
        return redirect("/quiz/results/" + str(qr.sessionid))
    else:
        current_app.logger.warning("No such quiz found")        
        return render_template('404.html')
        