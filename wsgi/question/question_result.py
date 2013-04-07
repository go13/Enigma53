from question import Question
from answer_result import AnswerResult

from sqlalchemy import Table, Column, Integer, String
from model import db

class QuestionResult(db.Model):
    __tablename__ = 'questionresults'

    #id = db.Column('id', Integer, primary_key=True)
    sessionid = db.Column('sessionid', Integer, primary_key=True)
    questionid = db.Column('questionid', Integer, primary_key=True)
    correct = db.Column('correct', Integer)

    question = None
    answer_results = []

    def __init__(self, sessionid=sessionid, questionid=questionid, correct=correct):
        self.sessionid = sessionid
        self.questionid = questionid
        self.correct=correct

    @staticmethod
    def get_question_results(sessionid):
        results =  QuestionResult.query.filter_by(sessionid=sessionid).all()
        for item in results:
            item.question = Question.query.filter_by(id=item.questionid).first()
            item.answer_results = AnswerResult.get_answer_results(sessionid, item.questionid)
        return results

    @staticmethod
    def add_question_result(sessionid, questionid, correct):
        result = QuestionResult(sessionid, questionid, correct)
        db.session.merge(result)
        db.session.commit()
