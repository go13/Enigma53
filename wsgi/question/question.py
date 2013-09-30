import re
from flask import current_app
from sqlalchemy import Integer
from question_revision import QuestionRevision

from model import db
from answer.answer import Answer

class Question(db.Model):
    __tablename__ = 'questions'

    qid = db.Column('id', Integer, primary_key=True)
    quiz_id = db.Column('quizid', Integer)
    revision_id = db.Column('revisionid', Integer)
    user_id = db.Column('userid', Integer)
    active = db.Column('active', Integer)

    def __init__(self, quiz_id, revision_id, user_id):
        self.quiz_id = quiz_id
        self.user_id = user_id
        self.revision_id = revision_id
        self.active = 1
        self.question_revision = None
        self.answers = []

    @property
    def serialize(self):
        return {
            'quizid': self.quiz_id,
            'nextquestionid': -1,
            'qtext': self.question_revision.qtextcache,
            'id': self.qid,
            'lat': self.question_revision.latitude,
            'lon': self.question_revision.longitude,
            'answers': [i.serialize for i in self.answers]
           }

    @property
    def serialize_with_answers(self):
        return {
            'quizid': self.quiz_id,
            'nextquestionid': -1,
            'qtextcache': self.question_revision.qtextcache,
            'qtext': self.question_revision.qtext,
            'id': self.qid,
            'lat': self.question_revision.latitude,
            'lon': self.question_revision.longitude,
            'answers': [i.serialize_with_answers for i in self.answers]
           }

    @property
    def serialize_for_edit(self):
        return {
            'quizid': self.quiz_id,
            'nextquestionid': self.question_revision.nextquestionid,
            'qtext': self.question_revision.qtext,
            'id': self.qid,
            'lat': self.question_revision.latitude,
            'lon': self.question_revision.longitude,
            'answers': [i.serialize_for_edit for i in self.answers]
           }

    @property
    def serialize_for_result(self):
        return {
            'qtext': self.question_revision.qtext,
            'id': self.qid,
            'lat': self.question_revision.latitude,
            'lon': self.question_revision.longitude
           }

    def delete_question(self):
        self.active = 0
        db.session.merge(self)

    @staticmethod
    def create_question(quiz_id, user_id, qtext, qtextcache, latitude, longitude):
        q = Question(quiz_id, -1, user_id)
        db.session.add(q)
        db.session.flush()

        qr = QuestionRevision.create_question_revision(q.qid, qtext, qtextcache, latitude, longitude)

        q.question_revision = qr
        q.revision_id = qr.qrid

        db.session.merge(q)
        db.session.flush()

        return q

    @staticmethod
    def get_next_question(qid):
        q = Question.query.filter_by(id=qid).first()
        q = Question.query.filter_by(id=q.nextquestionid).first()
        if q is not None:
            q.questionList = Answer.get_answers_by_question_id(q.id)
            return q
        return None

    @staticmethod
    def get_active_question_by_id(qid):
        current_app.logger.debug("get_active_question_by_id - " + str(qid))
        q = Question.query.filter_by(qid=qid, active=1).first()
        q.question_revision = QuestionRevision.get_question_revision_by_id(q.revision_id)
        if q is not None:
            q.answers = Answer.get_answers_by_question_id_revision_id(q.qid, q.revision_id)
            return q
        return None

    @staticmethod
    def get_question_by_revision_id(revision_id):
        qr = QuestionRevision.get_question_revision_by_id(revision_id)
        if qr:
            q = Question.query.filter_by(qid=qr.question_id).first()
            q.answers = Answer.get_answers_by_question_id_revision_id(q.qid, q.revision_id)
            q.question_revision = qr
        return q

    @staticmethod
    def get_active_questions_with_revisions_by_quiz_id(quiz_id):
        question_lst = Question.query.filter_by(quiz_id=quiz_id, active=1).order_by(Question.qid.asc()).all()
        for q in question_lst:
            q.question_revision = QuestionRevision.get_question_revision_by_id(q.revision_id)
        return question_lst

    @staticmethod
    def get_question_only_by_id(qid):
        current_app.logger.debug("get_question_only_by_id - " + str(qid))
        return Question.query.filter_by(qid=qid).first()

    @staticmethod
    def get_all_active_questions_by_quiz_id(quiz_id):
        questions = Question.query.filter_by(quiz_id=quiz_id, active=1).order_by(Question.qid.asc()).all()
        for q in questions:
            q.answers = Answer.get_answers_by_question_id_revision_id(q.qid, q.revision_id)
            q.question_revision = QuestionRevision.get_question_revision_by_id(q.revision_id)
            current_app.logger.debug(q.answers)
        return questions

    @staticmethod
    def update_question_by_id_and_create_revision(question_id, qtext, latitude, longitude):
        current_app.logger.debug("update_question_by_id_and_create_revision")

        question = Question.get_active_question_by_id(question_id)

        qr = QuestionRevision.create_question_revision(question.qid, qtext, 'TODO', latitude, longitude)

        def repl(m):
            correct = m.group(1)
            if correct == '+':
                Answer.create_answer(question_id, qr.qrid, 'T')
            else:
                Answer.create_answer(question_id, qr.qrid, 'F')
            return '?[-]'

        qtextcache = re.sub(r"\?\[([\+-]?)\]", repl, qtext)

        def repl_explanation(m):
            return ''

        qr.qtextcache = re.sub(r"\%\[((.|\n)*?)\]\%", repl_explanation, qtextcache)
        db.session.merge(qr)

        question.revision_id = qr.qrid
        question.question_revision = qr

        db.session.merge(question)
        db.session.flush()

        return question

    @staticmethod
    def update_question_by_id(question_id, qtext, latitude, longitude):
        current_app.logger.debug("update_question_by_id")

        question = Question.get_active_question_by_id(question_id)

        def repl_answers(m):
            correct = m.group(1)
            if correct == '+':
                Answer.create_answer(question_id, question.revision_id, 'T')
            else:
                Answer.create_answer(question_id, question.revision_id, 'F')
            return '?[-]'

        Answer.delete_answers_by_question_id_revision_id(question_id, question.revision_id)

        qtextcache = re.sub(r"\?\[([\+-]?)\]", repl_answers, qtext)

        def repl_explanation(m):
            return ''

        qtextcache = re.sub(r"\%\[((.|\n)*?)\]\%", repl_explanation, qtextcache)

        QuestionRevision.update_question_revision_by_id(question.revision_id, qtext, qtextcache, latitude, longitude)

        db.session.merge(question)
        db.session.flush()

        return question

    @staticmethod
    def full_delete_questions_by_quiz_id(quiz_id):
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        for q in questions:
            Answer.delete_answers_by_question_id(q.qid)
            QuestionRevision.delete_question_revisions_by_question_id(q.qid)
            db.session.delete(q)


