from flask import Flask, Blueprint, render_template, jsonify
from sqlalchemy import Table, Column, Integer, String

from model import db
from quiz_result import QuizResult

quiz_results_bp = Blueprint('quiz_results_bp', __name__, template_folder='pages')

@quiz_results_bp.route('/<int:session_id>/')
def quiz_results(session_id):
    quiz_results = QuizResult.get_quiz_results_by_id(session_id)
    if quiz_results:
        return render_template('quiz_result.html', quiz_results=quiz_results)
    else:
        return render_template('404.html')