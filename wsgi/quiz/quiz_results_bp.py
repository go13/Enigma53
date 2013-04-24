from flask import Flask, Blueprint, render_template, jsonify, current_app
from sqlalchemy import Table, Column, Integer, String

from model import db
from quiz_result import QuizResult
from modules.results import Historysession
from flask_login import login_required, current_user

quiz_results_bp = Blueprint('quiz_results_bp', __name__, template_folder = 'pages')

@quiz_results_bp.route('/<int:session_id>/')
@login_required
def quiz_results(session_id):# TODO: add permission verification
    current_app.logger.debug("quiz_results(" + str(session_id) + ")")
    
    qres = QuizResult.get_quiz_results_by_id(session_id)        
    
    if qres:
        return render_template('quiz_result.html', quiz_results = qres, quiz = qres.quiz)
    else:
        current_app.logger.warning("No such session found")        
        return render_template('404.html')