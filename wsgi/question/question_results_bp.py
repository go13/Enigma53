from flask import Flask, Blueprint, render_template, request, redirect, url_for

import time, datetime

from model import db
from answer import Answer, Answerhistory

question_results_bp = Blueprint('question_results_bp', __name__, template_folder='pages')

