from question.question_result import QuestionResult
from quiz import Quiz
from sqlalchemy import Table, Column, Integer, String, TIMESTAMP

from model import db
from modules.results import Historysession

class QuizResult(db.Model):
    __tablename__ = 'quizresults'

    sessionid = db.Column('sessionid', Integer, primary_key=True)
    quizid = db.Column('quizid', Integer)
    
    correctnum = 0
    historysession = None
    questionresults = []
    quiz = None

    def __init__(self, sessionid, quizid):
        self.sessionid = sessionid
        self.quizid = quizid

    @staticmethod
    def get_quiz_results_by_id(sessionid):
        print 'get_quiz_results_by_id', sessionid
        results=QuizResult.query.filter_by(sessionid=sessionid).first()
        print results
        if results:
            results.quiz=Quiz.get_quiz_by_id(results.quizid)
            results.questionresults=QuestionResult.get_question_results_by_id(sessionid)            
        return results
    
    @staticmethod
    def get_quiz_results_by_quiz_id(quizid):
        print 'get_quiz_results_by_id', quizid

        results=QuizResult.query.filter_by(quizid=quizid).all()        
        if results:
            for item in results:                
                item.historysession=Historysession.get_historysession_by_id(item.sessionid)
                #item.quiz=Quiz.get_quiz_by_id(item.quizid)
                item.questionresults=QuestionResult.get_question_results_by_id(item.sessionid)
                for q in item.questionresults:                     
                    if q.correct == 1:
                        item.correctnum += 1
        return results

    
    @staticmethod
    def get_quiz_results_by_user_id(userid):
        print 'get_quiz_results_by_user_id', userid
        results=QuizResult.query.filter_by(userid=userid).all()
        for item in results:
            item.quiz=Quiz.get_quiz_by_id(item.quizid)
            item.questionresults=QuestionResult.get_question_results(item.sessionid)
        return results

    @staticmethod
    def add_quiz_result(sessionid, quizid):
        qr = QuizResult.query.filter_by(sessionid=sessionid).first()
        if not qr:
            qr = QuizResult(sessionid, quizid)
            db.session.add(qr)
            db.session.commit()        
        return qr
    
    @staticmethod
    def start_session(quizid, userid):
        hs=Historysession.start_history_session(userid)
        #if not hs.userid==userid:
        qr=QuizResult.query.filter_by(sessionid=hs.id).first()
        if not qr:
            qr=QuizResult(hs.id, quizid)
            db.session.add(qr)
            db.session.commit()
        qr.historysession=hs        
        return qr
    
    @staticmethod
    def finish_session(quizid, userid):
        hs=Historysession.finish_history_session(userid)
        qr=QuizResult.query.filter_by(sessionid=hs.id).first()
        return qr            
        
    @staticmethod
    def delete_quizresults_by_sessionid(sessionid, batch):
        print 'delete_quizresults_by_sessionid ', sessionid
        QuestionResult.delete_questionresults_by_sessionid(sessionid, False)
        Historysession.delete_historysession_by_sessionid(sessionid, False)
        
        results = QuizResult.query.filter_by(sessionid=sessionid).all()        
        if results:
            for item in results:
                print 'QuizResults found ', item.quizid                
                db.session.delete(item)
        if not batch:
            db.session.commit()
            
    @staticmethod
    def delete_quizresults_by_quiz_id(quizid, batch):
        print 'delete_quizresults_by_quiz_id ', quizid
        result=QuizResult.query.filter_by(quizid=quizid).first()
        if result:                
            QuestionResult.delete_questionresults_by_sessionid(result.sessionid, False)
            Historysession.delete_historysession_by_sessionid(result.sessionid, False)                
            db.session.delete(result)
        if not batch:
            db.session.commit()