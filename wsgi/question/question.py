from flask import Flask, current_app
from sqlalchemy import Table, Column, Integer, Unicode

from model import db
from modules.answer import Answer

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column('id', Integer, primary_key = True)
    quizid = db.Column('quizid', Integer)
    userid = db.Column('userid', Integer)
    nextquestionid = db.Column('nextquestionid', Integer)
    qtext = db.Column('qtext', Unicode)
    type = db.Column('type', Integer)
    lat = db.Column('lattitude', Unicode)
    lon = db.Column('longitude', Unicode)
    answers = []    

    def __init__(self, quizid, userid, nextquestionid, qtext, type, answers, lat = lat, lon = lon):
        self.quizid = quizid
        self.userid = userid
        self.nextquestionid = nextquestionid
        self.qtext = qtext
        self.type = type
        self.lat = lat
        self.lon = lon
        self.answers = answers

    @property
    def serialize(self):
        return {
            'quizid' : self.quizid,
            'nextquestionid' : self.nextquestionid,
            'qtext' : self.qtext,
            'id' : self.id,
            'lat': self.lat,
            'lon': self.lon,
            'answers':[i.serialize for i in self.answers]
           }

    @property
    def serialize_for_edit(self):
        return {
            'quizid':self.quizid,
            'nextquestionid':self.nextquestionid,
            'qtext':self.qtext,
            'id':self.id,
            'lat': self.lat,
            'lon': self.lon,
            'answers':[i.serialize_for_edit for i in self.answers]
           }

    @staticmethod
    def get_next_question(id):
        q = Question.query.filter_by(id = id).first()
        q = Question.query.filter_by(id = q.nextquestionid).first()
        if q is not None:
            q.questionList = Answer.get_answer_by_question_id(q.id)
            return q
        return None

    @staticmethod
    def get_question_by_id(id):
        current_app.logger.debug("get_question_by_id - " + str(id))
        q  = Question.query.filter_by(id = id).first()
        if q is not None:
            q.answers = Answer.get_answer_by_question_id(q.id)
            return q
        return None

    @staticmethod
    def get_questions_by_quiz_id(quiz_id):
        current_app.logger.debug("get_questions_by_quiz_id - " + str(quiz_id))
        q  = Question.query.filter_by(quizid = quiz_id).first()
        if q is not None:
            q.answers = Answer.get_answer_by_question_id(id)
        return q

    @staticmethod
    def get_all_questions_by_quiz_id(quiz_id):
        current_app.logger.debug("get_all_questions_by_quiz_id. quiz_id - " + str(quiz_id))
        return Question.query.filter_by(quizid = quiz_id).all()

    @staticmethod
    def update_question_by_id(questionid, dict, to_commit):
        Question.query.filter_by(id = questionid).update(dict)
        if to_commit:
            db.session.commit()             

    @staticmethod
    def delete_questions_by_quiz_id(quizid, batch):
        current_app.logger.debug("delete_questions_by_quiz_id - " + str(quizid))
        questions = Question.query.filter_by(quizid = quizid).all()
        if questions:
            for item in questions:
                Answer.delete_answers_by_question_id(item.id, True)
                db.session.delete(item)
        if not batch:
            db.session.commit()