from flask import Flask
from sqlalchemy import Table, Column, Integer, String, Unicode
from datetime import datetime

from model import db
from question.question import Question
#from quiz_results import QuizResult

class Quiz(db.Model):
    __tablename__ = 'quizes'

    id = db.Column('id', Integer, primary_key=True)
    title = db.Column('title', Unicode)
    description = db.Column('description', Unicode)
    userid = db.Column('userid', Integer)
    questions = []

    def __init__(self, description=description, title=title, userid=userid):
        self.description = description
        self.title = title
        self.userid = userid

    @property
    def serialize(self):
        return {
            'id':self.id,
            'title':self.title,
            'description':self.description,
            'questions':[i.serialize for i in self.questions]
           }

    @staticmethod
    def get_quiz_by_id(id):
        q  = Quiz.query.filter_by(id=id).first()
        if q:
            q.questions = Question.get_all_questions_by_quiz_id(id)
        return q

    @staticmethod
    def get_quiz_by_userid(userid):
        return Quiz.query.filter_by(userid = userid).all()
    
    @staticmethod
    def create_quiz(description, title, userid):
        quiz = Quiz(description = description, title = title, userid = userid)
        db.session.add(quiz)
        db.session.commit()
        return quiz

    @staticmethod
    def delete_quiz_by_id(id, batch):
        print 'delete_quiz_by_id ',id 
        
        quiz = Quiz.query.filter_by(id=id).first()
        print 'Quiz found ', quiz.id
        if quiz:
            Question.delete_questions_by_quiz_id(id, False)
            db.session.delete(quiz)
        if not batch:
            db.session.commit()
            print 'Commit'