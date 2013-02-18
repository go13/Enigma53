from flask import Flask, Blueprint, render_template, request
from sqlalchemy import Table, Column, Integer, String
from flask.ext.wtf import Form, SelectMultipleField , SubmitField, RadioField, SelectField, BooleanField
from wtforms import widgets

from model import db
from question.questionbp import Question

quizbp = Blueprint('quizbp', __name__, template_folder='pages')

class Quiz(db.Model):
    __tablename__ = 'quizes'

    id = db.Column('id', Integer, primary_key=True)
    title = db.Column('title', String)
    description = db.Column('description', String)
    questionList = []

    def __init__(self, description=description, title=title):
        self.description = description
        self.title = title

    def __repr__(self):
        return '<Quiz %s %s>' % (self.title, self.description)

    @staticmethod
    def get_quiz_by_id(id):
        q  = Quiz.query.filter_by(id=id).first()
        if q is not None:
            q.questionList=Question.get_question_by_quiz_id(id)
            return q
        return None

@quizbp.route('/<int:quiz_id>/')
def quiz(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:
        return render_template('quiz.html', quiz=quiz)
    else:
        return render_template('404.html')

