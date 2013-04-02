from flask import Flask, Blueprint, render_template, request, jsonify
from sqlalchemy import Table, Column, Integer, String

from model import db
from answer import Answer, Answerhistory, Historysession

question_bp = Blueprint('question_bp', __name__, template_folder='pages')


class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column('id', Integer, primary_key=True)
    quizid = db.Column('quizid', Integer)
    nextquestionid = db.Column('nextquestionid', Integer)
    qtext = db.Column('qtext', String)
    type = db.Column('type', Integer)
    answers = []

    def __init__(self, quizid, nextquestionid, qtext, type, answers):
        self.quizid = quizid
        self.nextquestionid = nextquestionid
        self.qtext = qtext
        self.type = type
        self.answers = answers

    @property
    def serialize(self):
        return {
            'quizid':self.quizid,
            'nextquestionid':self.nextquestionid,
            'qtext':self.qtext,
            'id':self.id,
            'answers':[i.serialize for i in self.answers]
           }

    @property
    def serialize_for_edit(self):
        return {
            'quizid':self.quizid,
            'nextquestionid':self.nextquestionid,
            'qtext':self.qtext,
            'id':self.id,
            'answers':[i.serialize_for_edit for i in self.answers]
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
    def get_question_by_quiz_id(quiz_id):
        print 'get_question_by_quiz_id('+str(quiz_id)+')'
        q  = Question.query.filter_by(quizid=quiz_id).first()
        if q is not None:
            q.answers=Answer.get_answer_by_question_id(id)
        return q

    @staticmethod
    def get_all_questions_by_quiz_id(quiz_id):
        print 'get_all_questions_by_quiz_id('+str(quiz_id)+')'
        qlist  = Question.query.filter_by(quizid=quiz_id).all()
        #if qlist is not None:
        #    q.answers=Answer.get_answer_by_question_id(id)
        return qlist

    @staticmethod
    def add_answer_history_by_question_id(id, historysessionid, answer_id, value, to_commit):
        question = Question.get_question_by_id(id)
        if question:
            Answerhistory.add_answer_history(id, answer_id, historysessionid, value, to_commit) # TODO: add userid

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


@question_bp.route('/edit_question_submit/',methods=['POST'])
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
        Answer.delete_answer_by_question_id(question_id, True)

        for answer in answers:
            atext = answer['atext']
            correct = answer['correct']
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
        correct = answer['correct']
        id = answer['id']
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
    question=Question.get_question_by_id(question_id)
    print question
    if question:
        qid = request.json['qid']
        answers = request.json['answers']

        hs = Historysession.get_current_historysession_by_userid(1)
        print 'answers', answers

        for answer in answers:
            value = answer['value']
            print 'val ', value
            aid = answer['id']
            print 'oko2'
            Question.add_answer_history_by_question_id(qid, hs.id, aid,  value, False)
            db.session.commit()


        result = {'jstaus':'OK'}
        return jsonify(result)
    else:
        return jsonify({"status":"ERROR"})


