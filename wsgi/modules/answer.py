from flask import Flask, render_template
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP

from model import db

class Answer(db.Model):
    __tablename__ = 'answers'

    id = db.Column('id', Integer, primary_key=True)
    questionid = db.Column('questionid', Integer)
    atext = db.Column('atext', String)
    correct = db.Column('correct', String)

    def __init__(self, questionid=questionid, atext=atext, correct=correct):
        self.atext = atext
        self.questionid = questionid
        self.correct = correct

    def __repr__(self):
        return '<Answer %s>' % (self.atext)

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
    @staticmethod
    def get_answer_by_id(id):
        q  = Answer.query.filter_by(id=id).first()
        if q is not None:
            return q
        return None

    @staticmethod
    def get_answer_by_question_id(questionid):
        list  = Answer.query.filter_by(questionid=questionid).all()
        if list is not None:
            return list
        return None
    
    @staticmethod
    def delete_answer_by_id(id):
        return Answer.query.filter_by(id=id).delete()
    
    @staticmethod
    def update_answer_by_id(id, answer, correct):
        result = Answer.query.filter_by(id=id).update({'answer':answer, 'correct':correct})                
        db.session.commit()        
        return result
    
    @staticmethod
    def create_answer(questionid, answer, correct, batch):
        answer = Answer(questionid, answer, correct)
        db.session.add(answer)                
        if batch: 
            db.session.commit()        
        return answer.id
    
    @staticmethod
    def delete_answer_by_question_id(questionid, batch):
        result = Answer.query.filter_by(questionid=questionid).delete()                
        if batch: 
            db.session.commit()        
        return result 

