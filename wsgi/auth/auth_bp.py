from flask import Flask, Blueprint, render_template, request, jsonify


auth_bp = Blueprint('auth_bp', __name__, template_folder='pages') 
