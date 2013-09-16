from flask import current_app
from sqlalchemy import Integer, String

from model import db

class Answer(db.Model):
    __tablename__ = 'answers'

    aid = db.Column('id', Integer, primary_key=True)
    question_id = db.Column('questionid', Integer)
    revision_id = db.Column('revisionid', Integer)
    correct = db.Column('correct', String)

    def __init__(self, question_id, revision_id, correct):
        self.question_id = question_id
        self.revision_id = revision_id
        self.correct = correct

    @property
    def serialize(self):
        return {
            'id': self.aid
           }

    @property
    def serialize_for_edit(self):
        return {
            'id': self.aid,
            'question_id': self.question_id,
            'correct': self.correct
           }
        
    @property
    def serialize_for_result(self):
        return {
            'id': self.aid
           }

    @staticmethod
    def get_answer_by_id(aid):
        return Answer.query.filter_by(aid=aid).first()

    @staticmethod
    def get_answers_by_question_id(question_id):
        return Answer.query.filter_by(question_id=question_id).all()

    @staticmethod
    def get_answers_by_question_id_revision_id(question_id, revision_id):
        return Answer.query.filter_by(question_id=question_id, revision_id=revision_id).all()

    @staticmethod
    def create_answer(question_id, revision_id, correct):
        a = Answer(question_id, revision_id, correct)
        db.session.add(a)
        db.session.flush()
        return a
    
    @staticmethod
    def delete_answers_by_question_id_revision_id(question_id, revision_id):
        current_app.logger.debug("delete_answers_by_question_id = " + str(question_id))
        Answer.query.filter_by(question_id=question_id, revision_id=revision_id).delete()

    @staticmethod
    def delete_answers_by_question_id(question_id):
        Answer.query.filter_by(question_id=question_id).delete()