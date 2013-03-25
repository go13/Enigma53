from flask import Flask, Blueprint, render_template, jsonify
from sqlalchemy import Table, Column, Integer, String

from model import db
from question.question_bp import Question

quiz_bp = Blueprint('quiz_bp', __name__, template_folder='pages')

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

@quiz_bp.route('/<int:quiz_id>/')
def quiz(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:
        print quiz.questions
        return render_template('quiz.html', quiz=quiz)
    else:
        return render_template('404.html')

@quiz_bp.route('/<int:quiz_id>/edit/')
def quiz_edit(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:
        return render_template('quiz_edit.html', quiz=quiz)
    else:
        return render_template('404.html')


@quiz_bp.route('/jget/<int:quiz_id>/')
def jget(quiz_id):
    quiz=Quiz.get_quiz_by_id(quiz_id)
    if quiz:
       result = {'jstaus':'OK'}
       result.update(quiz.serialize)
       return jsonify(result)
    else:
       return jsonify({"status":"ERROR"})

