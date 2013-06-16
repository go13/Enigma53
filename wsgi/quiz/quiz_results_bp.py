from flask import Blueprint, render_template, current_app

from model import db
from quiz_result import QuizResult
from modules.results import Historysession
from flask_login import login_required, current_user

quiz_results_bp = Blueprint('quiz_results_bp', __name__, template_folder = 'pages')

@quiz_results_bp.route('/<int:session_id>/')
@login_required
def quiz_results(session_id):
    current_app.logger.debug("quiz_results(" + str(session_id) + ")")
    
    qres = QuizResult.get_quiz_results_by_id(session_id)
    if qres:
        quiz = qres.quiz
        if current_user.id == quiz.userid:
            return render_template('quiz_result.html', quiz_results = qres, quiz = quiz)
        else:
            return render_template('auth_failure.html')
    else:
        current_app.logger.warning("No such session found")        
        return render_template('404.html')