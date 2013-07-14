from flask import current_app
from answer_result import AnswerResult
from question import Question

from sqlalchemy import Integer
from model import db

class QuestionResult(db.Model):
    __tablename__='questionresults'

    session_id = db.Column('sessionid', Integer, primary_key=True)
    question_id = db.Column('questionid', Integer, primary_key=True)
    revision_id = db.Column('revisionid', Integer)
    correct = db.Column('correct', Integer)
    
    question = None
    answer_results = []

    def __init__(self, session_id, question_id, revision_id, correct):
        self.session_id = session_id
        self.question_id = question_id
        self.revision_id = revision_id
        self.correct = correct
        
    @property
    def serialize_for_result(self):
        return {
            'questionid' : self.question_id,
            'correct' : self.correct,
            'answer_results' : [i.serialize_for_result for i in self.answer_results],
            'question' : self.question.serialize_for_result
           }

    @staticmethod
    def get_latest_results_by_question_id(question_id):
        current_app.logger.debug("get_question_results_by_revision_id(" + str(question_id) + ")")
        return QuestionResult.query.filter_by(question_id=question_id).all()

    @staticmethod
    def get_question_results_by_revision_id(revision_id):
        return QuestionResult.query.filter_by(revision_id=revision_id).all()

    @staticmethod
    def get_question_results_by_id(session_id):
        question_result_list = QuestionResult.query.filter_by(session_id=session_id).all()
        for qr in question_result_list:
            qr.question = Question.get_question_by_revision_id(qr.revision_id)
            qr.answer_results = AnswerResult.get_answer_results_by_session_id_question_id(session_id, qr.question.qid)
        return question_result_list
        
    @staticmethod
    def add_question_result(session_id, question_id, revision_id, correct):
        result = QuestionResult(session_id, question_id, revision_id, correct)
        db.session.merge(result)

    @staticmethod
    def delete_questionresults_by_session_id(session_id):
        AnswerResult.delete_answer_results_by_session_id(session_id)
        QuestionResult.query.filter_by(session_id=session_id).delete()