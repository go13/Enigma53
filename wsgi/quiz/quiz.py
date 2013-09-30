from sqlalchemy import Integer, String, func

from model import db
from question.question import Question
from auth.user import User


class Quiz(db.Model):
    __tablename__ = 'quizes'

    qid = db.Column('id', Integer, primary_key=True)
    user_id = db.Column('userid', Integer)
    title = db.Column('title', String)
    description = db.Column('description', String)
    permission = db.Column('permission', String)

    latitude = None
    longitude = None
    questions = []
    user = None

    def __init__(self, user_id, title, description, permission):
        self.user_id = user_id
        self.title = title
        self.description = description
        self.permission = permission

    @property
    def serialize(self):
        return {
            'id': self.qid,
            'title': self.title,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'questions': [i.serialize for i in self.questions]
        }

    @property
    def serialize_for_result(self):
        if self.user:
            return {
                'author':self.user.name,
                'id': self.qid,
                'title': self.title,
                'latitude': self.latitude,
                'longitude': self.longitude
            }
        else:
            return {
                'id': self.qid,
                'title': self.title,
                'latitude': self.latitude,
                'longitude': self.longitude
            }

    @staticmethod
    def create_quiz(user_id):
        quiz = Quiz(user_id, 'New Quiz', '', 'private')
        db.session.add(quiz)
        db.session.flush()

        return quiz

    @staticmethod
    def get_number_of_active_questions_by_id(qid):
        return Question.query.filter_by(quiz_id=qid, active=1).count()

    @staticmethod
    def get_quiz_by_id(qid):
        q = Quiz.query.filter_by(qid=qid).first()
        if q:
            q.questions = Question.get_all_active_questions_by_quiz_id(q.qid)
            q.user = User.get_user_by_id(q.user_id)
        return q

    @staticmethod
    def get_quiz_only_by_id(qid):
        return Quiz.query.filter_by(qid=qid).first()

    @staticmethod
    def get_quizes_by_user_id(user_id):
        quiz_list = Quiz.query.filter_by(user_id=user_id).all()
        for quiz in quiz_list:
            questions = Question.get_active_questions_with_revisions_by_quiz_id(quiz.qid)
            if questions and len(questions) > 0:
                quiz.latitude = questions[0].question_revision.latitude
                quiz.longitude = questions[0].question_revision.longitude
            else:
                quiz.latitude = 37.4419
                quiz.longitude = -122.1419
            quiz.questions = questions
            quiz.user = User.get_user_by_id(quiz.user_id)
        return quiz_list

    @staticmethod
    def get_random_public_quizzes(quizzes_number):
        quizzes = Quiz.query.filter_by(permission='public').order_by(func.rand()).limit(quizzes_number).all()
        for quiz in quizzes:
            questions = Question.get_active_questions_with_revisions_by_quiz_id(quiz.qid)
            if questions and len(questions) > 0:
                quiz.latitude = questions[0].question_revision.latitude
                quiz.longitude = questions[0].question_revision.longitude
            else:
                quiz.latitude = 37.4419
                quiz.longitude = -122.1419
            quiz.questions = questions
            quiz.user = User.get_user_by_id(quiz.user_id)
        return quizzes

    @staticmethod
    def update_quiz_by_id(quiz_id, title, description, permission):
        qdict = {}
        if title:
            qdict.update({'title':title})
        if description:
            qdict.update({'description':description})
        if permission:
            qdict.update({'permission':permission})

        Quiz.query.filter_by(qid=quiz_id).update(qdict)

    @staticmethod
    def delete_quiz_by_id(qid):
        quiz = Quiz.query.filter_by(qid=qid).first()
        if quiz:
            Question.full_delete_questions_by_quiz_id(qid)
            db.session.delete(quiz)