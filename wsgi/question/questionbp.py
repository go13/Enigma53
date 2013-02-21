from flask import Flask, Blueprint, render_template, request, redirect, url_for
from sqlalchemy import Table, Column, Integer, String
from flask.ext.wtf import Form, SelectMultipleField , SubmitField, RadioField, SelectField, BooleanField, HiddenField
from wtforms import widgets
import time, datetime

from model import db
from answer import Answer, Answerhistory

questionbp = Blueprint('questionbp', __name__, template_folder='pages')

class Question_Submit_Form(Form):
    answer = SelectMultipleField(
        choices = [],
        default = [],
        option_widget=widgets.CheckboxInput(),
        widget=widgets.ListWidget(prefix_label=False, html_tag='ol')
    )
    questionid = HiddenField("questionid")
    submit = SubmitField("Submit")

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column('id', Integer, primary_key=True)
    quizid = db.Column('quizid', Integer)
    nextquestionid = db.Column('nextquestionid', Integer)
    question = db.Column('question', String)
    type = db.Column('type', Integer)
    answerList = []

    def __init__(self, question=question):
        self.question = question

    def __repr__(self):
        return '<Question %s>' % (self.description)
    
    @staticmethod
    def get_next_question(id):
        q  = Question.query.filter_by(id=id).first()
        q  = Question.query.filter_by(id=q.nextquestionid).first()
        if q is not None:
            q.questionList=Answer.get_answer_by_question_id(q.id)
            return q
        return None

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

@questionbp.route('/<int:question_id>/')
def question(question_id):
    action = request.args.get('action')
    question=Question.get_question_by_id(question_id)

    if action == 'edit':
        return render_template('question_edit.html', question=question)
    else:
        if question:
            form=Question_Submit_Form(csrf_enabled=False)
            choices = []
            for a in question.answerList:
                choices.append((a.id, a.answer))
            form.answer.choices = choices
            form.questionid.data=question.id
            return render_template('question.html',question=question, form=form)
        else:
            return render_template('404.html')

@questionbp.route('/submit_question',methods=['GET','POST'])
def submit_question():
    form = Question_Submit_Form(request.form, csrf_enabled=False)
    qid = form.questionid.data

    choices = form.answer.data
    print choices
    submittimes = []
    for ch in choices:
        print 'choice ', ch
        submittimes.append(Answerhistory(1, qid, ch, None))
    Answerhistory.add_answer_histories(submittimes)

    nextquestion = Question.get_next_question(qid)
    if question:
        return redirect(url_for('questionbp.question', question_id = nextquestion.id))
    else:
        return redirect(url_for('index'))

    