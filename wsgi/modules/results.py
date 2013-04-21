from flask import Flask
from datetime import datetime
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP, func

from model import db
from auth.user import User
#from quiz.quiz_result import QuizResult

class Historysession(db.Model):
    __tablename__ = 'historysessions'

    id = db.Column('id', Integer, primary_key=True)
    userid = db.Column('userid', Integer)
    starttime = db.Column('starttime', TIMESTAMP)
    endtime = db.Column('endtime', TIMESTAMP)
    
    user=None

    def __init__(self, userid, starttime, endtime):
        self.userid = userid
        self.starttime = starttime
        self.endtime = endtime

    @staticmethod
    def start_history_session(userid):
        chs = Historysession.get_current_historysession_by_userid(userid)
        if not chs:
            chs = Historysession(userid, datetime.now(), None)
            db.session.add(chs)
            db.session.commit()
        return chs

    @staticmethod
    def finish_history_session(userid):
        print 'userid', userid
        chs = Historysession.get_current_historysession_by_userid(userid)
        print 'finish_history_session ', chs
        if chs:
            chs.endtime = datetime.now()
            db.session.add(chs)
            db.session.commit()
        return chs

    @staticmethod
    def get_current_historysession_by_userid(userid):
        t=db.session.query(
            func.max(Historysession.id).label('max_id')
        ).filter(Historysession.userid==userid).subquery('t')

        query = db.session.query(Historysession).filter(
            Historysession.id==t.c.max_id,
        )
        hs=query.first()

        if hs and hs.endtime==None:
            #hs.user=User.get_user_by_id(userid)
            return hs
        else:
            return None

    @staticmethod
    def get_historysession_by_id(id):
        hs=Historysession.query.filter_by(id=id).first()
        hs.user=User.get_user_by_id(hs.userid)
        return hs
    
    @staticmethod
    def get_historysessions_by_userid(userid):
        query=db.session.query(Historysession).filter(
            Historysession.id==db.session.query(Historysession.id).filter(Historysession.userid==userid))
        return query.all()
    
    @staticmethod
    def delete_historysession_by_sessionid(sessionid, batch):
        print 'delete_historysession_by_quiz_id ', sessionid        
        hs=Historysession.query.filter_by(id=sessionid).all()
        for item in hs:   
            db.session.delete(item)        
        if not batch:
            db.session.commit()            
        