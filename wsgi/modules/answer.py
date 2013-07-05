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
    def get_answer_by_question_id(questionid):
        lst  = Answer.query.filter_by(questionid = questionid).all()
        if lst is not None:
            return lst
        return None
    
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
    def clone_answers_by_questionid(old_questionid, new_questionid, batch):
        answers = Answer.query.filter_by(questionid = old_questionid).all()
        for item in answers:
            db.session.add(Answer(new_questionid, item.atext, item.correct, item.id))
        if not batch:                
            db.session.commit()
    
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
        answers = Answer.query.filter_by(questionid = questionid).all()
        if answers:
            for item in answers:
                current_app.logger.debug("Answer found " + str(item.id)) 
                db.session.delete(item)
        if not batch:
            db.session.commit()

