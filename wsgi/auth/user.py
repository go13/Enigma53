from sqlalchemy import Integer, Unicode, func
from model import db

from flask_login import AnonymousUser, UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column('id', Integer, primary_key=True)
    name = db.Column('username', Unicode)
    email = db.Column('email', Unicode)
    password = db.Column('password', Unicode)
    trained = db.Column('trained', Integer)

    def __init__(self, name, email, password, trained):
        self.name = name
        self.email = email
        self.password = password
        self.trained = trained

    def isTrained(self):
        return (self.trained==1)

    @staticmethod
    def get_user_by_id(uid):
        return User.query.filter_by(id=uid).first()
    
    @staticmethod
    def get_user_by_name(name):
        return User.query.filter_by(name=name).first()
    
    @staticmethod
    def get_users_by_email(email):
        return User.query.filter(User.email == email).all()

    @staticmethod
    def update_user(user):
        db.session.merge(user)
        db.session.commit()

    @staticmethod
    def add_user(name, email, password):
        user = User(name, email, password, 0)
        db.session.add(user)
        db.session.commit()
        return user
    
class Anonymous(AnonymousUser):
    name = u"Anonymous"
    id = -1