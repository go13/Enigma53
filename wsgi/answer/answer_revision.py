__author__ = 'dmitriy'

from datetime import datetime
from sqlalchemy import Integer, TIMESTAMP, String

from model import db

class AnswerRevision(db.Model):
    __tablename__ = 'answerrevisions'

    arid = db.Column('id', Integer, primary_key=True)
    atext = db.Column('atext', String)
    correct = db.Column('correct', String)
    change_time = db.Column('changetime', TIMESTAMP)

    def __init__(self, atext, correct, change_time):
        self.atext = atext
        self.correct = correct
        self.change_time = change_time

    @staticmethod
    def create_answer_revision(atext, correct):
        ar = AnswerRevision(atext, correct, datetime.now())
        db.session.add(ar)
        db.session.flush()
        return ar