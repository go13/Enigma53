from question.question_result import QuestionResult
from quiz import Quiz
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP

from model import db
from modules.results import Historysession

class QuizResult(db.Model):
    __tablename__ = 'quizresults'

    sessionid = db.Column('sessionid', Integer, primary_key=True)
    quizid = db.Column('quizid', Integer)

    questionresults = []
    quiz = None

    def __init__(self, sessionid, quizid):
        self.sessionid = sessionid
        self.quizid = quizid

    @staticmethod
    def get_quiz_results_by_id(sessionid):
        results =  QuizResult.query.filter_by(sessionid=sessionid).first()
        results.quiz = Quiz.get_quiz_by_id(results.quizid)
        results.questionresults = QuestionResult.get_question_results(sessionid)
        return results

    @staticmethod
    def add_quiz_result(sessionid, quizid):
        result = QuizResult(sessionid, quizid)
        db.session.add(result)
        db.session.commit()
        
    @staticmethod
    def get_quiz_results_by_userid(userid):
        results  = QuizResult.query.filter_by(userid.in_(
            session.query(Historysession.id).filter(Historysession.userid==userid)
            )).all()        
        return results