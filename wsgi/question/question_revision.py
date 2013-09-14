__author__ = 'dmitriy'

from model import db
from sqlalchemy import Integer, String

class QuestionRevision(db.Model):
    __tablename__ = 'questionrevisions'

    qrid = db.Column('id', Integer, primary_key=True)
    question_id = db.Column('questionid', Integer)
    qtext = db.Column('qtext', String)
    qtextcache = db.Column('qtextcache', String)
    latitude = db.Column('latitude', String)
    longitude = db.Column('longitude', String)
    answers = []

    def __init__(self, question_id, qtext, qtextcache, latitude, longitude):
        self.question_id = question_id
        self.qtext = qtext
        self.qtextcache = qtextcache
        self.latitude = latitude
        self.longitude = longitude

    @staticmethod
    def get_question_revision_by_id(qrid):
        return QuestionRevision.query.filter_by(qrid = qrid).first()

    @staticmethod
    def create_question_revision(questionid, qtext, qtextcache, latitude, longitude):
        qr = QuestionRevision(questionid, qtext, qtextcache, latitude, longitude)
        db.session.add(qr)
        db.session.flush()
        return qr

    @staticmethod
    def update_question_revision_by_id(qrid, qtext, qtextcache, latitude, longitude):
        qr = QuestionRevision.query.filter_by(qrid=qrid).first()
        qr.qtext = qtext
        qr.qtextcache = qtextcache
        qr.latitude = latitude
        qr.longitude = longitude
        db.session.merge(qr)
        return qr

    @staticmethod
    def delete_question_revisions_by_question_id(question_id):
        QuestionRevision.query.filter_by(question_id=question_id).delete()




