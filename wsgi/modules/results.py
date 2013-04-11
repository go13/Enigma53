from flask import Flask
from datetime import datetime
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP, func

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
    endtime = db.Column('endtime', TIMESTAMP)
    quizid = db.Column('quizid', Integer)

    quizresult = None

    def __init__(self, userid=userid, starttime=starttime, endtime=endtime, quizid=quizid):
        self.userid = userid
        self.starttime = starttime
        self.endtime = endtime
        self.quizid = quizid

    @staticmethod
    def start_history_session(userid=userid, quizid=quizid):
        chs = Historysession.get_current_historysession_by_userid(userid)
        if not chs:
            chs = Historysession(userid, datetime.now(), None, quizid)
            db.session.add(chs)
            db.session.commit()

        return chs

    @staticmethod
    def finish_history_session(userid=userid, quizid=quizid):
        print 'userid', userid
        chs = Historysession.get_current_historysession_by_userid(userid)
        print 'finish_history_session ', chs
        if chs:
            chs.endtime = datetime.now()
            db.session.add(chs)
            db.session.commit()

        return chs

    @staticmethod
    def get_current_historysession_by_userid(userid=userid):
        t = db.session.query(
            func.max(Historysession.id).label('max_id')
        ).filter(Historysession.userid==userid).subquery('t')

        query = db.session.query(Historysession).filter(
            Historysession.id == t.c.max_id,
        )
        hs = query.first()

        if hs and hs.endtime == None:
            return hs
        else:
            return None

    @staticmethod
    def get_historysession_by_id(id=id):
        hs = Historysession.query.filter_by(id=id).first()
        if hs:
            hs.quizresult = QuizResult.get_quiz_results_by_id(id)
        return hs