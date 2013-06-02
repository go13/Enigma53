from flask import Flask
from sqlalchemy import Table, Column, Integer, Unicode
from datetime import datetime

from model import db
from question.question import Question

class Quiz(db.Model):
    __tablename__ = 'quizes'

    id = db.Column('id', Integer, primary_key = True)
    title = db.Column('title', Unicode)
    description = db.Column('description', Unicode)
    userid = db.Column('userid', Integer)
    questions = []

    def __init__(self, title = title, userid = userid):
        self.title = title
        self.userid = userid

    @property
    def serialize(self):
        return {
            'id' : self.id,
            'title' : self.title,
            'questions' : [i.serialize for i in self.questions]
           }
        
    def get_number_of_questions(self):
        return len(self.questions)
    
    @staticmethod
    def get_number_of_questions_by_id(id = id):
        return Quiz.query.filter_by(id = id).count()
    
    @staticmethod
    def get_quiz_by_id(id):
        q  = Quiz.query.filter_by(id = id).first()
        if q:
            q.questions = Question.get_all_questions_by_quiz_id(id)
        return q

    @staticmethod
    def get_quiz_by_userid(userid):
        return Quiz.query.filter_by(userid = userid).all()
    
    @staticmethod
    def create_quiz(title, userid):
        quiz = Quiz(title = title, userid = userid)
        db.session.add(quiz)
        db.session.commit()
        return quiz

    @staticmethod
    def update_quiz(quiz):
        db.session.merge(quiz)
        db.session.commit()
        
    @staticmethod
    def update_quiz_by_id(quizid, dict, to_commit):
        Quiz.query.filter_by(id = quizid).update(dict)
        if to_commit:
            db.session.commit()
        
    @staticmethod
    def delete_quiz_by_id(id, batch):
        
        quiz = Quiz.query.filter_by(id = id).first()
        
        if quiz:
            Question.delete_questions_by_quiz_id(id, False)
            db.session.delete(quiz)
        if not batch:
            db.session.commit()