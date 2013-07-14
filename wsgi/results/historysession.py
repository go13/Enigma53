from datetime import datetime
from sqlalchemy import Integer, TIMESTAMP, func

from model import db
from auth.user import User

class Historysession(db.Model):
    __tablename__ = 'historysessions'

    hsid = db.Column('id', Integer, primary_key=True)
    user_id = db.Column('userid', Integer)
    start_time = db.Column('starttime', TIMESTAMP)
    end_time = db.Column('endtime', TIMESTAMP)
    
    user = None

    def __init__(self, user_id, start_time, end_time):
        self.user_id = user_id
        self.start_time = start_time
        self.end_time = end_time

    def finish_history_session(self):
        self.end_time = datetime.now()
        db.session.merge(self)

    @staticmethod
    def start_history_session(user_id):
        chs = Historysession.get_current_history_session_by_user_id_quiz_id(user_id)
        if not chs:
            chs = Historysession(user_id, datetime.now(), None)
            db.session.add(chs)
            db.session.flush()
        return chs

    @staticmethod
    def get_current_history_session_by_user_id_quiz_id(user_id):
        t = db.session.query(
            func.max(Historysession.hsid).label('max_id'),
        ).filter(Historysession.user_id == user_id).subquery('t')

        query = db.session.query(Historysession).filter(
            Historysession.hsid == t.c.max_id,
        )
        hs = query.first()

        if hs and hs.end_time == None:
            return hs
        else:
            return None

    @staticmethod
    def get_historysession_by_id(hsid):
        hs = Historysession.query.filter_by(hsid=hsid).first()
        hs.user = User.get_user_by_id(hs.user_id)
        return hs
    
    @staticmethod
    def delete_history_session_by_session_id(session_id):
        Historysession.query.filter_by(hsid=session_id).delete()