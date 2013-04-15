from sqlalchemy import Table, Column, Integer, String, TIMESTAMP
from model import db

from flask_login import AnonymousUser, UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column('id', Integer, primary_key=True)
    name = db.Column('username', String)
    email = db.Column('email', String)
    password = db.Column('password', String)
    #openid = Column(String)

    def __init__(self, name, email, password, id):#, openid):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
     #   self.openid = openid
        
    @staticmethod
    def get_user_by_id(id):
        return User.query.filter_by(id=id).first()
    
    @staticmethod
    def get_user_by_name(name):
        return User.query.filter_by(name=name).first()

    #@staticmethod
    #def get_user_by_openid(openid):
    #    return User.query.filter_by(openid=openid).first()
    
class Anonymous(AnonymousUser):
    name = u"Anonymous"