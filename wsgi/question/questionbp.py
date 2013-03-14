from flask import Flask, Blueprint, render_template, request, jsonify
from sqlalchemy import Table, Column, Integer, String

from model import db
from answer import Answer, Answerhistory

questionbp = Blueprint('questionbp', __name__, template_folder='pages')


class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column('id', Integer, primary_key=True)
    quizid = db.Column('quizid', Integer)
    nextquestionid = db.Column('nextquestionid', Integer)
    qtext = db.Column('qtext', String)
    type = db.Column('type', Integer)
    answers = []

    def __init__(self, qtext=qtext):
        self.qtext = qtext

    @property
    def serialize(self):
        return {
            'quizid':self.quizid,
            'nextquestionid':self.nextquestionid,
            'qtext':self.qtext,
            'id':self.id,
            'answers':[i.serialize for i in self.answers]
           }

    @staticmethod
    def get_next_question(id):
        q  = Question.query.filter_by(id=id).first()
        q  = Question.query.filter_by(id=q.nextquestionid).first()
        if q is not None:
            q.questionList=Answer.get_answer_by_question_id(q.id)
            return q
        return None

    @staticmethod
    def get_question_by_id(id):
        q  = Question.query.filter_by(id=id).first()
        if q is not None:
            q.answers=Answer.get_answer_by_question_id(q.id) #[{"atext":}]
            return q
        return None

    @staticmethod
    def get_question_by_quiz_id(quizid):
        q  = Question.query.filter_by(quizid=quizid).first()
        if q is not None:
            q.questionList=Answer.get_answer_by_question_id(id)
            return q
        return None

@questionbp.route('/<int:question_id>/')
def question(question_id):
    question=Question.get_question_by_id(question_id)
    if question:
        return render_template('question.html', question=question)
    else:
        return render_template('404.html')

@questionbp.route('/<int:question_id>/edit/')
def question_edit(question_id):
    question=Question.get_question_by_id(question_id)
    if question:
        return render_template('editquestion.html', question=question)
    else:
        return render_template('404.html')


@questionbp.route('/edit_question_submit/',methods=['POST'])
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
                correct = 1
            else:
                correct = 0;
            Answer.create_answer(questionid, atext, correct, True)
        db.session.commit()

        return jsonify(status='OK', redirect='/question/'+questionid)
    else:
        return jsonify(status='Error')

@questionbp.route('/jget/<int:question_id>/')
def jget(question_id):
    question=Question.get_question_by_id(question_id)
    if question:
        result = {'jstaus':'OK'}
        result.update(question.serialize)

        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})

