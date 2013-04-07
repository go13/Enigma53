from flask import Flask, Blueprint
from model import db

question_results_bp = Blueprint('question_results_bp', __name__, template_folder='pages')



