from flask import Flask
from datetime import datetime
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP

from model import db

class Answerhistory(db.Model):
    __tablename__ = 'answerhistory'

    id = db.Column('id', Integer, primary_key=True)
    historysessionid = db.Column('historysessionid', Integer)
    questionid = db.Column('questionid', Integer)
    answerid = db.Column('answerid', Integer)
    value = db.Column('value', String)
    #question = None

    def __init__(self, questionid=questionid, answerid=answerid, historysessionid=historysessionid, value=value):
        self.questionid = questionid
        self.answerid = answerid
        self.historysessionid = historysessionid
        self.value = value

    def __repr__(self):
        return '<Answer %s>' % (self.answer)

    @staticmethod
    def add_answer_history(question_id, answer_id, historysessionid, value, to_commit): # todo:
        ah = Answerhistory(question_id, answer_id, historysessionid, value) # datetime.now()
        db.session.add(ah)
        if to_commit:
            db.session.commit()

    @staticmethod
    def add_answer_histories(submitdates):
        db.session.add_all(submitdates)
        db.session.commit()

    @staticmethod
    def get_answerhistories_by_historysessionid(historysessionid=historysessionid):
        ahlist = Answerhistory.query.filter_by(historysessionid=historysessionid).all()
        return ahlist

class Historysession(db.Model):
    __tablename__ = 'historysessions'

    id = db.Column('id', Integer, primary_key=True)
    userid = db.Column('userid', Integer)
    starttime = db.Column('starttime', TIMESTAMP)
    endttime = db.Column('endttime', TIMESTAMP)
    quizid = db.Column('quizid', Integer)

    quizresult = None

    def __init__(self, userid=userid, starttime=starttime, quizid=quizid):
        self.userid = userid
        self.starttime = starttime
        self.quizid = quizid

    @staticmethod
    def start_history_session(userid=userid, quizid=quizid):
        sh = Historysession(userid, datetime.now(), quizid)
        db.session.add(sh)
        db.session.commit()
        return sh

    #Finish session

    @staticmethod
    def get_current_historysession_by_userid(userid=userid):
        t = db.session.query(
            func.max(Historysession.id).label('max_id'),
        ).filter(Historysession.userid==userid).subquery('t')

        query = db.session.query(Historysession).filter(
            Historysession.id == t.c.max_id,
        )
        return query.first()

    @staticmethod
    def get_historysession_by_id(id=id):
        hs = Historysession.query.filter_by(id=id).first()
        if hs:
            hs.quizresult = QuizResult.get_quiz_results_by_id(id)
        return hs