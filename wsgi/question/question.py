import re
from datetime import datetime
from flask import current_app
from sqlalchemy import Integer, Unicode, TIMESTAMP

from model import db
from modules.answer import Answer

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column('id', Integer, primary_key = True)
    parentid = db.Column('parentid', Integer)      
    quizid = db.Column('quizid', Integer)
    userid = db.Column('userid', Integer)
    nextquestionid = db.Column('nextquestionid', Integer)
    qtext = db.Column('qtext', Unicode)
    qtextcache = db.Column('qtextcache', Unicode)
    qtype = db.Column('type', Integer)
    latitude = db.Column('latitude', Unicode)
    longitude = db.Column('longitude', Unicode)
    changetime = db.Column('changetime', TIMESTAMP)
    answers = []    

    def __init__(self, quizid, userid, nextquestionid, qtext, qtype, answers, latitude, longitude, qtextcache, changetime, parentid):
        self.quizid = quizid
        self.userid = userid
        self.nextquestionid = nextquestionid
        self.qtext = qtext
        self.qtextcache = qtextcache
        self.qtype = qtype
        self.latitude = latitude
        self.longitude = longitude
        self.answers = answers
        self.changetime = changetime
        self.parentid = parentid

    def clone_question(self):
        return Question(self.quizid, 
                        self.userid, 
                        self.nextquestionid, 
                        self.qtext, 
                        self.qtype, 
                        None, 
                        self.latitude, 
                        self.longitude, 
                        self.qtextcache, 
                        datetime.now(), 
                        -1)    

    def synchronise_with_question(self, question):
        self.qtext = question.qtext
        self.qtextcache = question.qtextcache
        self.latitude = question.latitude
        self.longitude = question.longitude

    def create_revision(self, batch):
        previousq = self.clone_question()
        previousq.parentid = self.id
        db.session.add(previousq)
        db.session.flush()
        Answer.clone_answers_by_question_id(self.id, previousq.id, True)
        if not batch:
            db.session.commit()

    def syncronise_with_latest_revision(self, batch):
        newest_revision = Question.query.filter_by(parentid = self.id).first()
        newest_revision.synchronise_with_question(self)
        Answer.synchronise_answers_by_question_id(self.id, newest_revision.id, batch)

    @property
    def serialize(self):
        return {
            'quizid' : self.quizid,
            'nextquestionid' : self.nextquestionid,
            'qtext' : self.qtextcache,
            'id' : self.id,
            'lat' : self.latitude,
            'lon' : self.longitude,
            'answers' : [i.serialize for i in self.answers]
           }

    @property
    def serialize_for_edit(self):
        return {
            'quizid' : self.quizid,
            'nextquestionid' : self.nextquestionid,
            'qtext' : self.qtext,
            'id' : self.id,
            'lat' : self.latitude,
            'lon' : self.longitude,
            'answers' : [i.serialize_for_edit for i in self.answers]
           }
        
    @property
    def serialize_for_result(self):
        return {
            'nextquestionid' : self.nextquestionid,
            'qtext' : self.qtextcache,
            'id' : self.id,
            'lat' : self.latitude,
            'lon' : self.longitude
           }
        
    @staticmethod
    def get_next_question(qid):
        q = Question.query.filter_by(id = qid).first()
        q = Question.query.filter_by(id = q.nextquestionid).first()
        if q is not None:
            q.questionList = Answer.get_answers_by_question_id(q.id)
            return q
        return None

    @staticmethod
    def get_question_by_id(qid):
        current_app.logger.debug("get_question_by_id - " + str(qid))
        q = Question.query.filter_by(id = qid).filter(Question.parentid < 0).first()
        if q is not None:
            q.answers = Answer.get_answers_by_question_id(q.id)
            return q
        return None

    @staticmethod
    def get_revision_by_id(qid):
        current_app.logger.debug("get_revision_by_id - " + str(qid))
        result = Question.query.filter_by(id = qid).first()
        if result:
            result.answers = Answer.get_answers_by_question_id(qid)
            for a in result.answers:
                current_app.logger.debug("answ: " + str(a.id))
        return result
    
    @staticmethod
    def get_all_questions_with_variants_by_id(qid):
        current_app.logger.debug("get_question_by_id - " + str(qid))
        results = Question.query.filter_by(parentid = qid).order_by(Question.id.asc()).all()
        for item in results:
            item.answers = Answer.get_answers_by_question_id(item.id)
        return results
    
    @staticmethod
    def get_question_only_by_id(qid):
        current_app.logger.debug("get_question_only_by_id - " + str(qid))
        return Question.query.filter_by(id = qid).filter(Question.parentid < 0).first()

    @staticmethod
    def get_questions_by_quiz_id(quiz_id):
        current_app.logger.debug("get_questions_by_quiz_id - " + str(quiz_id))
        q  = Question.query.filter_by(quizid = quiz_id).filter(Question.parentid < 0).first()
        if q is not None:
            q.answers = Answer.get_answers_by_question_id(id)
        return q

    @staticmethod
    def get_all_questions_by_quiz_id(quiz_id):
        current_app.logger.debug("get_all_questions_by_quiz_id. quiz_id - " + str(quiz_id))
        questions = Question.query.filter_by(quizid = quiz_id).filter(Question.parentid < 0).order_by(Question.id.asc()).all()
        for q in questions:
            q.answers = Answer.get_answers_by_question_id(q.id)
            current_app.logger.debug(q.answers)
        return questions
    
    @staticmethod
    def get_latest_version_by_parent_id(parentid):
        current_app.logger.debug("get_latest_version_by_id(" + str(parentid) +")")
                
        result = Question.query.filter_by(parentid = parentid).order_by(Question.changetime.desc()).first()
        if result:
            result.answers = Answer.get_answers_by_question_id(result.id)
        return result

    #@staticmethod
    #def syncronise_with_latest_revision_by_id(questionid):
    #    q = Question.query.filter_by(id = questionid)
    #    q.syncronise_with_latest_revision(True)

    @staticmethod
    def update_question_by_id(questionid, qtext, latitude, longitude):
        current_app.logger.debug("update_question_by_id")
        
        question = Question.query.filter_by(id = questionid).filter(Question.parentid < 0).first()        

        Answer.delete_answers_by_question_id(questionid, True)

        def repl(m):
            correct = m.group(1)
            if correct == '+':
                Answer.create_answer(questionid, 'todo', 'T', True)
            else:
                Answer.create_answer(questionid, 'todo', 'F', True)
            return '?[-]'
        
        qtextcache = re.sub(r"\?\[([\+-]?)\]", repl, qtext) 
               
        question.qtext = qtext
        question.qtextcache = qtextcache
        question.latitude = latitude
        question.longitude = longitude

        db.session.merge(question)
        db.session.commit()

        return question

    @staticmethod
    def delete_questions_by_quiz_id(quizid, batch):
        current_app.logger.debug("delete_questions_by_quiz_id - " + str(quizid))
        questions = Question.query.filter_by(quizid = quizid).all()
        if questions:
            for item in questions:
                Answer.delete_answers_by_question_id(item.id, True)
                db.session.delete(item)
                
        questions = Question.query.filter_by(parentid = quizid).all()
        if questions:
            for item in questions:
                Answer.delete_answers_by_question_id(item.id, True)
                db.session.delete(item)
                
        if not batch:
            db.session.commit()