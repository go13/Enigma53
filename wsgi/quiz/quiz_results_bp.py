from flask import Flask, Blueprint, render_template, jsonify
from sqlalchemy import Table, Column, Integer, String

from model import db

quiz_results_bp = Blueprint('quiz_results_bp', __name__, template_folder='pages')

@quiz_results_bp.route('/<int:session_id>/')
def quiz_results(session_id):
    #quiz=Quiz.get_quiz_by_id(quiz_id)
    #if quiz:
    return render_template('quiz_results.html')
    #else:
    #    return render_template('404.html')