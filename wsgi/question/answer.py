from flask import Flask, Blueprint, render_template
from datetime import datetime
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP, func

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

class Answerhistory(db.Model):
    __tablename__ = 'answerhistory'

    id = db.Column('id', Integer, primary_key=True)
    historysessionid = db.Column('historysessionid', Integer)
    questionid = db.Column('questionid', Integer)
    answerid = db.Column('answerid', Integer)
    value = db.Column('value', String)

    def __init__(self, questionid=questionid, answerid=answerid, historysessionid=historysessionid, value=value):
        self.questionid = questionid
        self.answerid = answerid
        self.historysessionid = historysessionid
        self.value = value

    def __repr__(self):
        return '<Answer %s>' % (self.answer)

    @staticmethod
    def add_answer_history(question_id, answer_id, historysessionid, value, to_commit): # todo:
        ah = Answerhistory(question_id, answer_id, historysessionid, value) # datetime.now()
        db.session.add(ah)
        if to_commit:
            db.session.commit()

    @staticmethod
    def add_answer_histories(submitdates):
        db.session.add_all(submitdates)
        db.session.commit()

class Historysession(db.Model):
    __tablename__ = 'Historysessions'

    id = db.Column('id', Integer, primary_key=True)
    userid = db.Column('userid', Integer)
    submittime = db.Column('submittime', TIMESTAMP)
    nodetype = db.Column('nodetype', String)

    def __init__(self, userid=userid, submittime=submittime, nodetype=nodetype):
        self.userid = userid
        self.submittime = submittime
        self.nodetype = nodetype

    @staticmethod
    def start_history_session(userid=userid, nodetype=nodetype):
        sh = Historysession(userid, datetime.now(), nodetype)
        db.session.add(sh)
        db.session.commit()

    #Finish session

    @staticmethod
    def get_current_historysession_by_userid(userid=userid):
        t = db.session.query(
            func.max(Historysession.id).label('max_id'),
        ).filter(Historysession.userid==userid).subquery('t')

        query = db.session.query(Historysession).filter(
            Historysession.id == t.c.max_id,
        )
        hs = query.first()

        if hs:
            return hs

