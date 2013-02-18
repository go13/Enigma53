from flask import Flask, Blueprint, render_template, request
from sqlalchemy import Table, Column, Integer, String
from flask.ext.wtf import Form, SelectMultipleField , SubmitField, RadioField, SelectField, BooleanField
from wtforms import widgets

from model import db

questionbp = Blueprint('questionbp', __name__, template_folder='pages')

class Question_Submit_Form(Form):
    answer = SelectMultipleField(
        choices = [],
        default = [],
        option_widget=widgets.CheckboxInput(),
        widget=widgets.ListWidget(prefix_label=False, html_tag='ol')
    )
    submit = SubmitField("Submit")

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column('id', Integer, primary_key=True)
    quizid = db.Column('quizid', Integer)
    nextquestion = db.Column('nextquestionid', Integer)
    question = db.Column('question', String)
    type = db.Column('type', Integer)
    answerList = []

    def __init__(self, question=question):
        self.question = question

    def __repr__(self):
        return '<Question %s>' % (self.description)

    @staticmethod
    def get_question_by_id(id):
        q  = Question.query.filter_by(id=id).first()
        if q is not None:
            q.answerList=Answer.get_answer_by_question_id(q.id)
            return q
        return None

    @staticmethod
    def get_question_by_quiz_id(quizid):
        q  = Question.query.filter_by(quizid=quizid).first()
        if q is not None:
            q.questionList=Answer.get_answer_by_question_id(id)
            return q
        return None
		
class Answer(db.Model):
    __tablename__ = 'answers'

    id = db.Column('id', Integer, primary_key=True)
    questionid = db.Column('questionid', Integer)
    answer = db.Column('answer', String)
    correct = db.Column('correct', Integer)

    def __init__(self, questionid=questionid, answer=answer):
        self.answer = answer
        self.questionid = questionid

    def __repr__(self):
        return '<Answer %s>' % (self.answer)

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

@questionbp.route('/<int:question_id>/')
def question(question_id):
    action = request.args.get('action')
    question=Question.get_question_by_id(question_id)

    if action == 'edit':
        return render_template('question_edit.html', question=question)
    else:
        if question:
            form=Question_Submit_Form(csrf_enabled=False)
            choises = []
            for q in question.answerList:
                choises.append((q.id, q.answer))
            form.answer.choices = choises

            return render_template('question.html',question=question, form=form)
        else:
            return render_template('404.html')

@questionbp.route('/submit_question',methods=['GET','POST'])
def submit_question():
    return redirect(url_for('question',question_id=1))

    