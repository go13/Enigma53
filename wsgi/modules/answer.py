from flask import current_app
from sqlalchemy import Integer, Unicode, String

from model import db

class Answer(db.Model):
    __tablename__ = 'answers'

    id = db.Column('id', Integer, primary_key = True)
    questionid = db.Column('questionid', Integer)
    parentid = db.Column('parentid', Integer)
    atext = db.Column('atext', Unicode)
    correct = db.Column('correct', String)

    def __init__(self, questionid = questionid, atext = atext, correct = correct, parentid = parentid):
        self.atext = atext
        self.questionid = questionid
        self.correct = correct
        self.parentid = parentid

    def __repr__(self):
        return '<Answer %s>' % (self.parentid)

    @property
    def serialize(self):
        return {
            'id':self.id,
            'atext':self.atext
           }

    @property
    def serialize_for_edit(self):
        return {
            'id':self.id,
            'questionid':self.questionid, # ???
            'atext':self.atext,
            'correct':self.correct
           }
        
    @property
    def serialize_for_result(self):
        return {
            'id':self.id,
            'atext':self.atext
           }

    @staticmethod
    def get_answer_by_id(aid):
        q  = Answer.query.filter_by(id = aid).first()
        if q is not None:
            return q
        return None

    @staticmethod
    def get_answers_by_question_id(questionid):
        return Answer.query.filter_by(questionid = questionid).all()
    
    @staticmethod
    def delete_answer_by_id(aid):
        Answer.query.filter_by(id = aid).delete()
        Answer.query.filter_by(parentid = aid).delete()
    
    @staticmethod
    def update_answer_by_id(aid, answer, correct):
        result = Answer.query.filter_by(id = aid).update({'answer':answer, 'correct':correct})                
        db.session.commit()        
        return result
    
    @staticmethod
    def clone_answers_by_question_id(old_questionid, new_questionid, batch):
        current_app.logger.debug("clone_answers_by_question_id")
        answers = Answer.query.filter_by(questionid = old_questionid).all()
        for item in answers:
            db.session.add(Answer(new_questionid, item.atext, item.correct, item.id))
        if not batch:                
            db.session.commit()

    @staticmethod
    def synchronise_answers_by_question_id(old_questionid, new_questionid, batch):
        Answer.delete_answers_by_question_id(new_questionid, True)
        Answer.clone_answers_by_question_id(old_questionid, new_questionid, batch)
    
    @staticmethod
    def create_answer(questionid, answer, correct, batch):
        answer = Answer(questionid, answer, correct, -1)
        db.session.add(answer)                
        if not batch: 
            db.session.commit()        
        return answer.id
    
    @staticmethod
    def delete_answers_by_question_id(questionid, batch):
        current_app.logger.debug("delete_answers_by_question_id = " + str(questionid))
        Answer.query.filter_by(questionid = questionid).delete()
        if not batch:
            db.session.commit()

