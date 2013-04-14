from flask import Flask, Blueprint, render_template, request, jsonify
from sqlalchemy import Table, Column, Integer, String

from model import db
from question import Question
from modules.answer import Answer
from quiz.quiz_result import QuizResult
from question_result import QuestionResult
from answer_result import AnswerResult
#from modules.results import Historysession

question_bp = Blueprint('question_bp', __name__, template_folder='pages')

@question_bp.route('/<int:question_id>/')
def question(question_id):
    question=Question.get_question_by_id(question_id)
    if question:
        return render_template('question.html', question=question)
    else:
        return render_template('404.html')

@question_bp.route('/<int:question_id>/edit/')
def question_edit(question_id):
    question=Question.get_question_by_id(question_id)
    if question:
        return render_template('question_edit.html', question=question)
    else:
        return render_template('404.html')


@question_bp.route('/edit_question_submit/', methods=['POST'])
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

        Question.query.filter_by(id=questionid).update({'qtext':qtext})
        Answer.delete_answer_by_question_id(questionid, True)

        for answer in answers:
            atext = answer['atext']
            if answer['correct']=='T':
                correct = 'T'
            else:
                correct = 'F';
            Answer.create_answer(questionid, atext, correct, True)
        db.session.commit()

        return jsonify(status='OK', redirect='/question/'+questionid)
    else:
        return jsonify(status='Error')

@question_bp.route('/jget/<int:question_id>/')
def jget(question_id):
    question=Question.get_question_by_id(question_id)
    if question:
        result = {'jstaus':'OK'}
        result.update(question.serialize)
        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})

@question_bp.route('/jget_for_edit/<int:question_id>/')
def jget_for_edit(question_id):
    question=Question.get_question_by_id(question_id)
    if question:
        result = {'jstaus':'OK'}
        result.update(question.serialize_for_edit)
        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})


@question_bp.route('/jupd/<int:question_id>/',methods=['POST'])
def jupd(question_id):
    question=Question.get_question_by_id(question_id)
    if question:
        print 'got a question from DB, id = ', question_id
        print 'qid ', request.json['qid']
        print 'qtext ', request.json['qtext']
        print 'answers ', request.json['answers']

        qid = request.json['qid']
        qtext = request.json['qtext']
        answers = request.json['answers']

        Question.query.filter_by(id=question_id).update({'qtext':qtext})
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
def jcreate():
    print 'got a question to create'
    print 'qtext ', request.json['qtext']
    print 'quizid ', request.json['quizid']
    print 'answers ', request.json['answers']

    qtext = request.json['qtext']
    quizid = request.json['quizid']
    answers = request.json['answers']

    newQuestion=Question(quizid=quizid, nextquestionid=2, qtext=qtext, type=1, answers=answers)
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

@question_bp.route('/jsubmit/<int:question_id>/',methods=['POST'])
def jsubmit(question_id):

    sessionid = 1
    question = Question.get_question_by_id(question_id)
    print 'question_id', question_id

    if question:
        qid = request.json['qid']
        receivedanswers = request.json['answers']
        correct = True

        for i in range(0,len(receivedanswers)):
            item = receivedanswers[i]
            aid = item['id']

            value = 'F'
            if item['value'] == 'T':
                value = 'T'

            AnswerResult.add_answer_result(sessionid, aid, value)

            db.session.commit()

            correct = correct and (value == question.answers[i].correct)
            print question.answers
            print i, ' - ', question.answers[i].correct

            print 'value - ', value, ' answer = ', question.answers[i].correct, ', correct - ', correct

        QuestionResult.add_question_result(sessionid, qid, correct)

        result = {'jstaus':'OK'}
        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})


