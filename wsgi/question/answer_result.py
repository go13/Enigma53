from answer.answer import Answer
from flask import current_app
from sqlalchemy import Integer, String

from model import db
from results.historysession import Historysession

class AnswerResult(db.Model):
    __tablename__ = 'answerresults'

    session_id = db.Column('sessionid', Integer, primary_key = True)
    answer_id = db.Column('answerid', Integer, primary_key = True)
    revision_id = db.Column('revisionid', Integer)
    value = db.Column('value', String)
    answer = None

    def __init__(self, session_id, answer_id, revision_id, value):
        self.session_id = session_id
        self.answer_id = answer_id
        self.revision_id = revision_id
        self.value = value
        
    @property
    def serialize_for_result(self):
        return {
            'answerid' : self.answer_id,
            'correct' : self.answer.correct,
            'value' : self.value
           }

    @staticmethod
    def get_answer_results_by_session_id_question_id(session_id, question_id):
        results = []

        answers = Answer.get_answers_by_question_id(question_id)

        for a in answers:
            r = AnswerResult.query.filter_by(session_id=session_id, answer_id=a.aid).first()
            if r:
                results.append(r)
                r.answer = a

        return results

    @staticmethod
    def add_answer_result(session_id, answer_id, revision_id, value):
        ar = AnswerResult(session_id, answer_id, revision_id, value)
        db.session.merge(ar)
        return ar

    @staticmethod
    def delete_answer_results_by_session_id(session_id):
        AnswerResult.query.filter_by(session_id=session_id).delete()