from flask import Blueprint, render_template, jsonify, request
from model import db
from flask_login import login_required, current_user
from auth.user import User

user_bp = Blueprint('user_bp', __name__, template_folder='pages')

@user_bp.route('/profile/', methods=["GET", "POST"])
@login_required
def profile():
    print 'profile'
    if current_user:#???        
        if request.method == "POST":# and "email" in request.form:
            print 'POST'
            username=request.form["username"]        
            email=request.form["email"]
            password=request.form["password"]
            
            current_user.name=username
            current_user.email=email
            current_user.password=password
            
            User.update_user(current_user)
            
        return render_template('profile.html', user=current_user)
    else:
        render_template('404.html')
                