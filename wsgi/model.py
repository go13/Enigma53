from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

import config

# DB class
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =  config.DB_URI
db = SQLAlchemy(app)

# DB classess
