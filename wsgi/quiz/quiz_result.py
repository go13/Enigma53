import datetime
from flask import current_app
from question.question_result import QuestionResult
from quiz import Quiz
from sqlalchemy import Integer

from model import db
from results.historysession import Historysession

class QuizResult(db.Model):
    __tablename__ = 'quizresults'

    session_id = db.Column('sessionid', Integer, primary_key=True)
    quiz_id = db.Column('quizid', Integer)
    ncorrect = db.Column('ncorrect', Integer)
    nquestion = db.Column('nquestion', Integer)
    ## fields loaded in a separate request
    historysession = None
    question_results = []
    quiz = None

    def __init__(self, session_id, quiz_id, nquestion, ncorrect):
        self.session_id = session_id
        self.quiz_id = quiz_id
        self.ncorrect = ncorrect
        self.nquestion = nquestion

    @property
    def serialize_for_result(self):
        return {
            'session_id' : self.session_id,
            'ncorrect' : self.ncorrect,
            'nquestion' : self.nquestion,            
            'question_results' : [i.serialize_for_result for i in self.question_results],
            'quiz' : self.quiz.serialize_for_result
           }

    @property
    def serialize_for_statistics(self):
        return {
            'id': self.session_id,
            'correct': self.ncorrect,
            'total': self.nquestion,
            'date': self.historysession.start_time.strftime('%d-%b-%y %H:%M:%S')
           }

    def finish_session(self):
        self.question_results = QuestionResult.get_question_results_by_id(self.session_id)
        self.ncorrect = 0

        for q in self.question_results:
            if q.correct == 1:
                self.ncorrect += 1

        db.session.merge(self)

        hs = Historysession.get_historysession_by_id(self.session_id)

        hs.finish_history_session()

        current_app.logger.debug("correct num = " + str(self.ncorrect) + "out of " + str(self.nquestion))

    @staticmethod
    def get_quiz_result_by_id(session_id):
        quiz_result = QuizResult.query.filter_by(session_id=session_id).first()
        if quiz_result:
            quiz_result.quiz = Quiz.get_quiz_only_by_id(quiz_result.quiz_id)
            quiz_result.question_results = QuestionResult.get_question_results_by_id(session_id)
        return quiz_result

    @staticmethod
    def get_quiz_results_by_quiz_id(quiz_id):
        results = QuizResult.query.filter_by(quiz_id=quiz_id).all()
        for item in results:
            item.historysession = Historysession.get_historysession_by_id(item.sessionid)
            item.question_results = QuestionResult.get_question_results_by_id(item.sessionid)
        return results

    @staticmethod
    def get_quiz_results_only_by_quiz_id(quiz_id):
        quiz_results = QuizResult.query.filter_by(quiz_id=quiz_id).order_by(QuizResult.session_id.asc()).limit(15).all()
        for qr in quiz_results:
            qr.historysession = Historysession.get_historysession_by_id(qr.session_id)
        return quiz_results

    @staticmethod
    def get_quiz_result_by_quiz_id_user_id(quiz_id, user_id):
        hs = Historysession.get_current_history_session_by_user_id_quiz_id(user_id)
        if hs:
            qr = QuizResult.query.filter_by(session_id=hs.hsid).first()
            if qr:
                qr.quiz = Quiz.get_quiz_only_by_id(qr.quiz_id)
            return qr
        else:
            return None

    @staticmethod
    def start_session(quiz_id, user_id):
        hs = Historysession.start_history_session(user_id)
        
        qr = QuizResult.query.filter_by(session_id=hs.hsid).first()
        if not qr:
            nquestion = Quiz.get_number_of_active_questions_by_id(quiz_id)
            
            qr = QuizResult(hs.hsid, quiz_id, nquestion, None)
            db.session.add(qr)
        qr.historysession = hs
        return qr
            
    @staticmethod
    def delete_quiz_results_by_quiz_id(quiz_id):
        quiz_result_list = QuizResult.query.filter_by(quiz_id=quiz_id).all()
        for qr in quiz_result_list:
            QuestionResult.delete_questionresults_by_session_id(qr.session_id)
            Historysession.delete_history_session_by_session_id(qr.session_id)
            db.session.delete(qr)
