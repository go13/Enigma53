from flask import Flask, Blueprint, render_template, jsonify, request, redirect
from sqlalchemy import Table, Column, Integer, String
from datetime import datetime

from model import db
from quiz import Quiz
from question.question import Question
from quiz_result import QuizResult
from modules.results import Historysession
from flask_login import login_required, current_user

quiz_bp = Blueprint('quiz_bp', __name__, template_folder='pages')

@quiz_bp.route('/<int:quiz_id>/')
def quiz(quiz_id):
    print 'quiz',quiz_id 
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:    
        print '----------', current_user.id
        QuizResult.start_session(quiz_id, current_user.id)
        
        return render_template('quiz.html', quiz=quiz)
    else:
        return render_template('404.html')
        
@quiz_bp.route('/<int:quiz_id>/home/')
def quiz_home(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:        
        results=QuizResult.get_quiz_results_by_quiz_id(quiz_id)
        return render_template('quiz_home.html', quiz=quiz, results=results)
    else:
        return render_template('404.html')

@quiz_bp.route('/<int:quiz_id>/edit/')
def quiz_edit(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:
        return render_template('quiz_edit.html', quiz=quiz)
    else:
        return render_template('404.html')

@quiz_bp.route('/<int:quiz_id>/settings/', methods=["GET", "POST"])
def quiz_settings(quiz_id):
    print 'quiz_settings'
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if request.method == "POST":
        title=request.form["title"]        
        description=request.form["description"]
        print title
        print description
        if quiz:
            quiz.title=title
            quiz.description=description
            Quiz.update_quiz(quiz)        
    if quiz:
        return render_template('quiz_settings.html', quiz=quiz)
    else:
        return render_template('404.html')

@quiz_bp.route('/list/')
def quiz_list():
    quizes=Quiz.get_quiz_by_userid(current_user.id)
    if quiz:
        return render_template('quiz_list.html', quizes=quizes)
    else:
        return render_template('404.html')

@quiz_bp.route('/jget/<int:quiz_id>/')
def jget(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:
       result = {'jstaus':'OK'}
       result.update(quiz.serialize)
       return jsonify(result)
    else:
       return jsonify({"status":"ERROR"})

@quiz_bp.route('/jdelete/<int:quiz_id>/', methods=['DELETE'])
def jdelete(quiz_id):
    print 'deleting the quiz ', quiz_id
    #Historysession.delete_historysession_by_quiz_id(quiz_id, True)
    QuizResult.delete_quizresults_by_quiz_id(quiz_id, True)
    Quiz.delete_quiz_by_id(quiz_id, False)
    
    return jsonify({"status":"OK"})
    #else:
    #    return jsonify({"status":"ERROR"})
    
@quiz_bp.route('/jcreate/', methods=['CREATE'])
def jcreate():
    print 'creating a quiz ' 
    title=request.json['title']
    print title
    quiz=Quiz.create_quiz('description', title, current_user.id)   
    return jsonify({"quizid" : quiz.id})

@quiz_bp.route('/<int:quiz_id>/finish/')#, methods=['POST'])
def finish_session(quiz_id):
    print 'FINISH'
    qr=QuizResult.finish_session(quiz_id, current_user.id)
    #Historysession.finish_history_session(current_user.id, quiz_id)

    #result = {'jstaus':'OK'}
    #return jsonify(result)
    if qr:        
        return redirect("/quiz/results/"+str(qr.sessionid))
    else:
        return render_template('404.html')
        