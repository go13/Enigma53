from flask import current_app
from question import Question
from answer_result import AnswerResult

from sqlalchemy import Integer
from model import db

class QuestionResult(db.Model):
    __tablename__='questionresults'

    sessionid = db.Column('sessionid', Integer, primary_key = True)
    questionid = db.Column('questionid', Integer, primary_key = True)
    correct = db.Column('correct', Integer)
    
    question = None
    answer_results = []


    def __init__(self, sessionid = sessionid, questionid = questionid, correct = correct):
        self.sessionid = sessionid
        self.questionid = questionid
        self.correct = correct
        
    @property
    def serialize_for_result(self):
        return {
            'questionid' : self.questionid,
            'correct' : self.correct,
            'answer_results' : [i.serialize_for_result for i in self.answer_results],
            'question' : self.question.serialize_for_result
           }

    @staticmethod
    def get_question_results_by_id(sessionid):
        results = QuestionResult.query.filter_by(sessionid = sessionid).all()
        for item in results:
            item.question = Question.get_question_only_by_id(item.questionid)
            item.answer_results = AnswerResult.get_answer_results(sessionid, item.questionid)
        return results
        
    @staticmethod
    def add_question_result(sessionid, questionid, correct, batch):
        result = QuestionResult(sessionid, questionid, correct)
        db.session.merge(result)
        if not batch:
            db.session.commit()

    @staticmethod
    def delete_questionresults_by_sessionid(sessionid, batch):
        current_app.logger.debug("delete_questionresults_by_sessionid(" + str(sessionid) + ")")
        AnswerResult.delete_answerresults_by_session_id(sessionid, False)
        
        results=QuestionResult.query.filter_by(sessionid = sessionid).all()
        if results:
            for item in results:    
                print 'QuestionResult found ', item.sessionid            
                db.session.delete(item)
        if not batch:
            db.session.commit()           