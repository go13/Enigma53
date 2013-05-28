from flask import Flask, Blueprint, render_template, request, jsonify, current_app
from sqlalchemy import Table, Column, Integer, String

from model import db
from question import Question
from modules.answer import Answer
from quiz.quiz_result import QuizResult
from question_result import QuestionResult
from answer_result import AnswerResult
from modules.results import Historysession
from flask_login import login_required, current_user

question_bp = Blueprint('question_bp', __name__, template_folder = 'pages')

@question_bp.route('/<int:question_id>/')
def question(question_id):
    question = Question.get_question_by_id(question_id)
    if question:
        return render_template('question.html', question=question)
    else:
        return render_template('404.html')

@question_bp.route('/<int:question_id>/edit/')
@login_required
def question_edit(question_id):
    question = Question.get_question_by_id(question_id)
    if question:
        return render_template('question_edit.html', question=question)
    else:
        return render_template('404.html')


@question_bp.route('/edit_question_submit/', methods=['POST'])
@login_required
def edit_question_submit():
    # validate
    #for item in request.json:

    print 'got a post ', request.json

    questionid = request.json['qid']
    print 'submitting a question ', questionid

    question = Question.get_question_by_id(questionid)
    print 'got a question from DB ', questionid

    if question:
        answers = request.json['answers']
        qtext = request.json['qtext']

        question.qtext = qtext

        Question.update_question_by_id(questionid, {'qtext':qtext}, False)

        Answer.delete_answer_by_question_id(questionid, False)

        for answer in answers:
            atext = answer['atext']
            if answer['correct']=='T':
                correct = 'T'
            else:
                correct = 'F';
            Answer.create_answer(questionid, atext, correct, False)
        db.session.commit()

        return jsonify(status='OK', redirect='/question/'+questionid)
    else:
        return jsonify(status='Error')

@question_bp.route('/jget/<int:question_id>/')
@login_required
def jget(question_id):
    current_app.logger.debug("jget - " + str(question_id))
    question = Question.get_question_by_id(question_id)
    if question:
        result = {'jstaus':'OK'}
        result.update(question.serialize)
        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})

@question_bp.route('/jget_for_edit/<int:question_id>/')
@login_required
def jget_for_edit(question_id):
    current_app.logger.debug("jget_for_edit - " + str(question_id))
    question = Question.get_question_by_id(question_id)
    if question:
        result = {'jstaus':'OK'}
        result.update(question.serialize_for_edit)
        
        current_app.logger.debug("jget_for_edit - " + str(result))
        
        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})

@question_bp.route('/jupd/<int:question_id>/',methods=['POST'])
@login_required
def jupd(question_id):
    # TODO: validate!
    question = Question.get_question_by_id(question_id)
    if question:
        print 'got a question from DB, id = ', question_id
        print 'qid ', request.json['qid']
        print 'qtext ', request.json['qtext']
        print 'answers ', request.json['answers']
        print 'lat ', request.json['lat']
        print 'lon ', request.json['lon']

        qid = request.json['qid']
        qtext = request.json['qtext']
        answers = request.json['answers']
        lat = request.json['lat']
        lon = request.json['lon']
        
        
        Question.update_question_by_id(question_id, {'qtext':qtext, 'lat':lat, 'lon':lon}, False)
        Answer.delete_answers_by_question_id(question_id, True)

        for answer in answers:
            atext = answer['atext']
            correct = 'F'
            if answer['correct']=='T':
                correct = 'T'
            Answer.create_answer(question_id, atext, correct, True)
        db.session.commit()

        result = {'jstaus':'OK'}
        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})


@question_bp.route('/jcreate/',methods=['POST'])
@login_required
def jcreate():
    print 'got a question to create'
    print 'qtext ', request.json['qtext']
    print 'quizid ', request.json['quizid']
    print 'answers ', request.json['answers']
    print 'lat ', request.json['lat']
    print 'lon ', request.json['lon']

    qtext = request.json['qtext']
    quizid = request.json['quizid']
    answers = request.json['answers']
    lat = request.json['lat']
    lon = request.json['lon']

    newQuestion = Question(quizid = quizid, nextquestionid = 2, qtext = qtext, type = 1, answers = answers, lat = lat, lon = lon)
    db.session.add(newQuestion)
    db.session.commit()

    for answer in answers:
        atext = answer['atext']
        id = answer['id']
        correct = 'F'
        if answer['correct'] == 1:
            correct = 'T'

        newAnswer = Answer(newQuestion.id, atext, correct)
        db.session.add(newAnswer)

    db.session.commit()

    result = {'jstaus':'OK', 'qid':newQuestion.id}
    return jsonify(result)


@question_bp.route('/jdelete/<int:question_id>/',methods=['POST'])
@login_required
def jdelete(question_id):
    print 'deleting a question ', question_id

    question=Question.get_question_by_id(question_id)

    if question:
        for answer in question.answers:
            db.session.delete(answer)

        db.session.delete(question)
        db.session.commit()

    result = {'jstaus':'OK'}
    return jsonify(result)

@question_bp.route('/jsubmit/<int:question_id>/', methods=['POST'])
def jsubmit(question_id):
    print 'jsubmit', question_id
    
    hs = Historysession.get_current_historysession_by_userid(current_user.id)
    
    sessionid = hs.id
    
    print sessionid
    
    question = Question.get_question_by_id(question_id)

    if question:
        qid = request.json['qid']
        receivedanswers = request.json['answers']
        correct = True

        for i in range(0, len(receivedanswers)):
            item = receivedanswers[i]
            aid = item['id']

            value = 'F'
            if item['value'] == 'T':
                value = 'T'
            
            print '------------------------', sessionid, ' value - ', value,' aid - ', aid 
            AnswerResult.add_answer_result(sessionid, aid, value, False)

            correct = correct and (value == question.answers[i].correct)
            
            print i, ' - ', question.answers[i].correct
            print 'value - ', value, ' answer = ', question.answers[i].correct, ', correct - ', correct

        QuestionResult.add_question_result(sessionid, qid, correct, False)
        db.session.commit()
        
        result = {'jstaus':'OK'}
        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})

