from flask import current_app
from question.question_result import QuestionResult
from quiz import Quiz
from sqlalchemy import Integer

from model import db
from modules.results import Historysession

class QuizResult(db.Model):
    __tablename__ = 'quizresults'

    sessionid = db.Column('sessionid', Integer, primary_key = True)    
    quizid = db.Column('quizid', Integer)
    ncorrect = db.Column('ncorrect', Integer)
    nquestion = db.Column('nquestion', Integer)
    ## fields loaded in a separate request    
    historysession = None
    question_results = []
    quiz = None

    def __init__(self, sessionid, quizid, nquestion, ncorrect):
        self.sessionid = sessionid
        self.quizid = quizid
        self.ncorrect = ncorrect
        self.nquestion = nquestion

    @property
    def serialize_for_result(self):
        return {
            'sessionid' : self.sessionid,
            'ncorrect' : self.ncorrect,
            'nquestion' : self.nquestion,            
            'question_results' : [i.serialize_for_result for i in self.question_results],
            'quiz' : self.quiz.serialize_for_result
           }
    def finish_session(self):
        current_app.logger.debug("finish_session sessionid = " + str(self.sessionid))

        self.question_results = QuestionResult.get_question_results_by_id(self.sessionid)
        self.ncorrect = 0
        self.quiz = Quiz.get_quiz_only_by_id(self.quizid)

        for q in self.question_results:
            if q.correct == 1:
                self.ncorrect += 1

        db.session.merge(self)
        db.session.commit()
        current_app.logger.debug("correct num = " + str(self.ncorrect) + "out of " + str(self.nquestion))

    @staticmethod
    def get_quiz_result_by_id(sessionid):
        current_app.logger.debug("get_quiz_results_by_id(" + str(sessionid) + ")")
        
        result = QuizResult.query.filter_by(sessionid = sessionid).first()
        current_app.logger.debug("quizid - " + str(result.quizid))
        
        if result:
            result.quiz = Quiz.get_quiz_only_by_id(result.quizid)
            result.question_results = QuestionResult.get_question_results_by_id(sessionid)
            print 'result.question_results' + str(result.question_results)             
        return result

    @staticmethod
    def get_quiz_results_by_quiz_id(quizid):
        current_app.logger.debug("get_quiz_results_by_id(" + str(quizid) + ")")
        
        results = QuizResult.query.filter_by(quizid = quizid).all()        
        if results:
            for item in results:                
                item.historysession = Historysession.get_historysession_by_id(item.sessionid)
                item.question_results = QuestionResult.get_question_results_by_id(item.sessionid)
        return results

    @staticmethod
    def get_quiz_result_by_quiz_id_user_id(quizid, userid):
        current_app.logger.debug("get_quiz_results_by_id(" + str(quizid) + "," + str(userid) + ")")
        hs = Historysession.get_current_historysession_by_userid(userid)
        qr = QuizResult.query.filter_by(sessionid = hs.id).first()
        if qr:
            qr.quiz = Quiz.get_quiz_only_by_id(qr.quizid)
        return qr


    @staticmethod
    def start_session(quizid, userid):
        current_app.logger.debug("start_session(" + str(quizid) + ", " + str(userid) + ")")        
        
        hs = Historysession.start_history_session(userid)
        
        qr = QuizResult.query.filter_by(sessionid = hs.id).first()        
        if not qr:
            nquestion = Quiz.get_number_of_questions_by_id(quizid)
            
            qr = QuizResult(hs.id, quizid, nquestion, None)
            db.session.add(qr)
            db.session.commit()
            
            current_app.logger.debug("committed")
        qr.historysession = hs
        return qr
    
    @staticmethod
    def finish_session(quizid, userid):
        current_app.logger.debug("finish_session")        
        qr = None
        hs = Historysession.finish_history_session(userid)
        if hs:
            qr = QuizResult.query.filter_by(sessionid = hs.id).first()
            qr.question_results = QuestionResult.get_question_results_by_id(hs.id)
            qr.ncorrect = 0
            qr.quiz = Quiz.get_quiz_only_by_id(quizid)
            for q in qr.question_results:
                current_app.logger.debug("answ corr " + str(q.correct))
                if q.correct == 1: #TODO
                    qr.ncorrect += 1
            db.session.merge(qr)
            db.session.commit()
            current_app.logger.debug("correct num = " + str(qr.ncorrect))            
        return qr            
        
    @staticmethod
    def delete_quizresults_by_sessionid(sessionid, batch):
        current_app.logger.debug("delete_quizresults_by_sessionid(" + str(sessionid) + ", " + str(batch) + ")")
        
        QuestionResult.delete_questionresults_by_sessionid(sessionid, False)
        Historysession.delete_historysession_by_sessionid(sessionid, False)
        
        results = QuizResult.query.filter_by(sessionid = sessionid).all()        
        if results:
            for item in results:
                current_app.logger.debug("QuizResults found - " + str(item.quizid))
                db.session.delete(item)
        if not batch:
            db.session.commit()
            
    @staticmethod
    def delete_quizresults_by_quiz_id(quizid, batch):
        current_app.logger.debug("delete_quizresults_by_quiz_id(" + str(quizid) + ")")

        results = QuizResult.query.filter_by(quizid = quizid).all()
        for qr in results:                
            QuestionResult.delete_questionresults_by_sessionid(qr.sessionid, False)
            Historysession.delete_historysession_by_sessionid(qr.sessionid, False)                
            db.session.delete(qr)
        if not batch:
            db.session.commit()
