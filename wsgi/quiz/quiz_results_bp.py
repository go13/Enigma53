from flask import Blueprint, render_template, current_app, jsonify

from quiz import Quiz
from model import db
from quiz_result import QuizResult
from results.historysession import Historysession
from flask_login import login_required, current_user

quiz_results_bp = Blueprint('quiz_results_bp', __name__, template_folder = 'pages')

@quiz_results_bp.route('/<int:session_id>/')
@login_required
def quiz_results(session_id):
    current_app.logger.debug("quiz_results(" + str(session_id) + ")")
    
    quiz_result = QuizResult.get_quiz_result_by_id(session_id)
    
    if quiz_result:
        if current_user.id == quiz_result.quiz.user_id:
            jsdata = quiz_result.serialize_for_result
            current_app.logger.debug("jsdata - " + str(jsdata))
            return render_template('quiz_result.html', result=quiz_result, quiz=quiz_result.quiz, jsdata=jsdata)
        else:
            return render_template('auth_failure.html')
    else:
        current_app.logger.warning("No such session found")        
        return render_template('404.html')