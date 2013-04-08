from flask import Flask
from sqlalchemy import Table, Column, Integer, String
from datetime import datetime

from model import db
from question.question import Question
#from quiz_results import QuizResults

class Quiz(db.Model):
    __tablename__ = 'quizes'

    id = db.Column('id', Integer, primary_key=True)
    title = db.Column('title', String)
    description = db.Column('description', String)
    questions = []

    def __init__(self, description=description, title=title):
        self.description = description
        self.title = title

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
        print 'get_quiz_by_id('+str(id)+')'
        q  = Quiz.query.filter_by(id=id).first()
        if q is not None:
            q.questions=Question.get_all_questions_by_quiz_id(id)
        return q    
