from flask import Flask, Blueprint
from model import db

questionbp = Blueprint('editquestionbp', __name__, template_folder='pages')

