from flask import Flask
from sqlalchemy import Table, Column, Integer, String

from model import db
from modules.answer import Answer
#from modules.results import Historysession

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
    def get_questions_by_quiz_id(quiz_id):
        print 'get_questions_by_quiz_id('+str(quiz_id)+')'
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
    def add_answer_result_by_question_id(questionid, sessionid, answer_id, value, to_commit):
        question = Question.get_question_by_id(questionid)
        if question:
            AnswerResult.add_answer_history(id, answer_id, historysessionid, value, to_commit) # TODO: add userid
