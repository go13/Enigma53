from modules.answer import Answer
from sqlalchemy import Table, Column, Integer, String

from model import db
from modules.results import Historysession

class AnswerResult(db.Model):
    __tablename__ = 'answerresults'

    sessionid = db.Column('sessionid', Integer, primary_key = True)
    answerid = db.Column('answerid', Integer, primary_key = True)
    value = db.Column('value', String)

    answer = None

    def __init__(self, sessionid, answerid, value):
        self.sessionid = sessionid
        self.answerid = answerid
        self.value = value

    @staticmethod
    def get_answer_results(sessionid, questionid):
        results =  []

        answers = Answer.get_answer_by_question_id(questionid)

        for item in answers:
            r = AnswerResult.query.filter_by(sessionid=sessionid, answerid = item.id).first()
            if r:
                results.append(r)
                r.answer = item

        return results

    @staticmethod
    def add_answer_result(sessionid, answerid, value, batch):
        ar = AnswerResult(sessionid, answerid, value)
        db.session.merge(ar)
        if not batch:
            db.session.commit()

    @staticmethod
    def delete_answerresults_by_session_id(sessionid, batch):
        print 'delete_answerresults_by_session_id ', sessionid        
        Historysession.delete_historysession_by_sessionid(sessionid, True)        
        answers=AnswerResult.query.filter_by(sessionid = sessionid).all()
        if answers:
            for item in answers:                
                print 'AnswerResult found ', item.answerid
                db.session.delete(item)
        if not batch:
            db.session.commit()