from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify
from sqlalchemy import Table, Column, Integer, String
from flask.ext.wtf import Form, SelectMultipleField , SubmitField, RadioField, SelectField, BooleanField, HiddenField
from wtforms import widgets
import time, datetime

from model import db
from answer import Answer, Answerhistory, Answer_Submit_Form

questionbp = Blueprint('questionbp', __name__, template_folder='pages')

class Question_Submit_Form(Form):
    answers = SelectMultipleField(
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
        form = Answer_Submit_Form(csrf_enabled=False)
        form.questionid.data = question_id
        choices = []
        defaults = []          
        for a in question.answerList:
            form.texts._add_entry(data=a.answer)
            choices.append((a.id,a.id))
            if a.correct:
                defaults.append(a.correct)
        form.answers.choices = choices
        form.answers.default = defaults 
        return render_template('editquestion.html', question=question, form=form)
    else:
        if question:
            form=Question_Submit_Form(csrf_enabled=False)
            choices = []
            for a in question.answerList:
                choices.append((a.id, a.answer))
            form.answers.choices = choices
            form.questionid.data=question.id
            return render_template('question.html',question=question, form=form)
        else:
            return render_template('404.html')

@questionbp.route('/submit_question',methods=['GET','POST'])
def submit_question():
    form = Question_Submit_Form(request.form, csrf_enabled=False)
    qid = form.questionid.data
    choices = form.answers.data

    submittimes = []
    for ch in choices:
        submittimes.append(Answerhistory(1, qid, ch, None))
    Answerhistory.add_answer_histories(submittimes)

    nextquestion = Question.get_next_question(qid)
    if question:
        return redirect(url_for('questionbp.question', question_id = nextquestion.id))
    else:
        return redirect(url_for('index'))
    
@questionbp.route('/answer_ajax/delete/')
def answer_ajax_delete():
    answer_id = request.args.get('answer_id')
    if Answer.delete_answer_by_id(answer_id)>0:
        return jsonify(status='OK')
    else:
        return jsonify(status='ERROR')
    
@questionbp.route('/answer_ajax/update/')
def answer_ajax_update():
    answer_id = request.args.get('answer_id')
    correct = request.args.get('correct')
    answer = request.args.get('answer')
    
    if Answer.update_answer_by_id(answer_id, answer, correct)>0:
        return jsonify(status='OK')
    else:
        return jsonify(status='ERROR')
        

@questionbp.route('/answer_ajax/create/')
def answer_ajax_create():
    question_id = request.args.get('question_id')
    answer = request.args.get('answer')
    correct = request.args.get('correct')
    
    answer_id = Answer.create_answer(question_id, answer, correct)
    return jsonify(status='OK', answer_id=answer_id)
    

    