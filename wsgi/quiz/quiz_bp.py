from flask import Flask, Blueprint, render_template, jsonify, request
from sqlalchemy import Table, Column, Integer, String
from datetime import datetime

from model import db
from quiz import Quiz
from question.question import Question
from quiz_result import QuizResult
from modules.results import Historysession

quiz_bp = Blueprint('quiz_bp', __name__, template_folder='pages')

@quiz_bp.route('/<int:quiz_id>/')
def quiz(quiz_id):
    print 'quiz',quiz_id 
    quiz = Quiz.get_quiz_by_id(quiz_id)
    if quiz:    
        hs = Historysession.start_history_session(1, quiz_id)
        QuizResult.add_quiz_result(hs.id, quiz_id)
        return render_template('quiz.html', quiz=quiz)
    else:
        return render_template('404.html')
        
@quiz_bp.route('/<int:quiz_id>/home/')
def quiz_home(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:        
        #QuizResult.get_quiz_results_by_userid(1)
        return render_template('quiz_home.html', quiz=quiz)
    else:
        return render_template('404.html')

@quiz_bp.route('/<int:quiz_id>/edit/')
def quiz_edit(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:
        return render_template('quiz_edit.html', quiz=quiz)
    else:
        return render_template('404.html')

@quiz_bp.route('/list/')
def quiz_list():
    userid = 1
    quizes=Quiz.get_quiz_by_userid(userid)
    if quiz:
        return render_template('quiz_list.html', quizes = quizes)
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
    Historysession.delete_historysession_by_quiz_id(quiz_id, True)
    Quiz.delete_quiz_by_id(quiz_id, False)
    
    return jsonify({"status":"OK"})
    #else:
    #    return jsonify({"status":"ERROR"})
    
@quiz_bp.route('/jcreate/', methods=['CREATE'])
def jcreate():
    print 'creating a quiz ' 
    title = request.json['title']
    print title
    quiz = Quiz.create_quiz('description', title, 1)   
    return jsonify({"quizid" : quiz.id})

#@quiz_bp.route('/jstartsession/<int:quiz_id>/')
#def jstart_session(quiz_id):
#    print 'jstart_session',quiz_id 
    #userid = 1
    #quiz = Quiz.get_quiz_by_id(quiz_id)
    #if quiz:    
    #    hs = Historysession.start_history_session(userid, quiz_id)
    #    QuizResult.add_quiz_result(hs.id, quiz_id)
    #    result = {'jstaus':'OK'}
    #else:
    #    result = {'jstaus':'ERROR', 'messgage':'No such Quiz found'}
    #print result 
    #return jsonify(result)

@quiz_bp.route('/jfinishsession/<int:quiz_id>/', methods=['POST'])
def finish_session(quiz_id):
    print 'FINISH'
    userid = 1
    Historysession.finish_history_session(userid, quiz_id)

    result = {'jstaus':'OK'}
    return jsonify(result)