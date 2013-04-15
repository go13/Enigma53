from flask import Flask
from datetime import datetime
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP, func

from model import db
from quiz.quiz_result import QuizResult

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
    def get_historysession_by_id(id = id):
        hs = Historysession.query.filter_by(id=id).first()
        if hs:
            hs.quizresult = QuizResult.get_quiz_results_by_id(id)
        return hs
    
    @staticmethod
    def get_historysessions_by_userid(userid):
        query = db.session.query(Historysession).filter(
            Historysession.id == db.session.query(Historysession.id).filter(Historysession.userid == userid))
        return query.all()
    
    @staticmethod
    def delete_historysession_by_quiz_id(quizid, batch):
        print 'delete_historysession_by_quiz_id ', quizid        
        hs = Historysession.query.filter_by(quizid = quizid).all()
        print 'hs found ', hs
        if hs:                   
            for item in hs:
                print 'Historysession found ', item.id                
                QuizResult.delete_quizresults_by_sessionid(sessionid = item.id, batch = False)
                db.session.delete(item)
        if not batch:
            db.session.commit()            
        