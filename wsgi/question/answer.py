from flask import Flask, Blueprint, render_template
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP

from model import db

class Answer(db.Model):
    __tablename__ = 'answers'

    id = db.Column('id', Integer, primary_key=True)
    questionid = db.Column('questionid', Integer)
    atext = db.Column('atext', String)
    correct = db.Column('correct', Integer)

    def __init__(self, questionid=questionid, atext=atext, correct=correct):
        self.atext = atext
        self.questionid = questionid
        self.correct = correct

    def __repr__(self):
        return '<Answer %s>' % (self.atext)

    @staticmethod
    def get_answer_by_id(id):
        q  = Answer.query.filter_by(id=id).first()
        if q is not None:
            return q
        return None

    @staticmethod
    def get_answer_by_question_id(questionid):
        q  = Answer.query.filter_by(questionid=questionid).all()
        if q is not None:
            return q
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

class Answerhistory(db.Model):
    __tablename__ = 'answerhistory'

    id = db.Column('id', Integer, primary_key=True)
    userid = db.Column('userid', Integer)
    questionid = db.Column('questionid', Integer)
    answerid = db.Column('answerid', Integer)
    submittime = db.Column('submittime', TIMESTAMP)

    def __init__(self, userid=userid, questionid=questionid, answerid=answerid, submittime=submittime):
        self.userid = userid
        self.questionid = questionid
        self.answerid = answerid
        self.submittime = submittime

    def __repr__(self):
        return '<Answer %s>' % (self.answer)

    @staticmethod
    def add_answer_history(userid, questionid, answerid):
        ah = Answerhistory(userid, questionid, answerid)
        db.session.add(ah)
        db.session.commit()

    @staticmethod
    def add_answer_histories(submitdates):
        db.session.add_all(submitdates)
        db.session.commit()


