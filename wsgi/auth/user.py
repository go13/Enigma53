from sqlalchemy import Table, Column, Integer, String, TIMESTAMP
from model import db

from flask_login import AnonymousUser, UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column('id', Integer, primary_key=True)
    name = db.Column('username', String)
    email = db.Column('email', String)
    password = db.Column('password', String)

    def __init__(self, name, email, password):#, openid):
        #self.id = id
        self.name = name
        self.email = email
        self.password = password
        
    @staticmethod
    def get_user_by_id(id=id):
        return User.query.filter_by(id=id).first()
    
    @staticmethod
    def get_user_by_name(name):
        return User.query.filter_by(name=name).first()
    
    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def update_user(user):
        db.session.merge(user)
        db.session.commit()                
    
    @staticmethod
    def add_user(name, email, password):
        user = User(name, email, password)
        db.session.add(user)
        db.session.commit()
        return user
    
class Anonymous(AnonymousUser):
    name = u"Anonymous"