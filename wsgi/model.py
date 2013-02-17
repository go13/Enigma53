from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from sqlalchemy import Table, Column, Integer, String

import config

# DB class
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =  config.DB_URI
db = SQLAlchemy(app)

# DB classess
# class User(db.Model):
#     __tablename__ = 'users'

# uid = db.Column('uId', Integer, primary_key=True)
#   uname = db.Column('uName', String(30), unique=True)
#   umail = db.Column('uMail', String(50), unique=True)
#   upassword = db.Column('uPassword', String(100))
#   ulogin = db.Column('ulogin', String(100), unique=True)
#   urole = db.Column('urole', Integer)

#   def __init__(self, uname=None, umail=None, upassword=None):
#      self.uname = uname
#        self.umail = umail
#       self.upassword = upassword

#   def __repr__(self):
#         return '<User %s %s>' % (self.uname, self.umail)

#   @staticmethod
#   def get_user_id(username):
#       p  = User.query.filter_by(username=username).first()
#       if p is not None:
#           return p
#       return None

#   @staticmethod
#   def get_userid_by_mail(umail):
#       p  = User.query.filter_by(umail=umail).first()
#       if p is not None:
#           return p
#       return None

#   @staticmethod
#   def get_user_by_id(uid):
#       p  = User.query.filter_by(uid=uid).first()
#       if p is not None:
#           return p
#       return None

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







