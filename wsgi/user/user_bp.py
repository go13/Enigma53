from flask import Blueprint, render_template, jsonify, request
from model import db
from flask_login import login_required, current_user
from auth.user import User
from modules.jsonschema import Draft4Validator

user_bp = Blueprint('user_bp', __name__, template_folder = 'pages')

@user_bp.route('/profile/') #, methods = ["GET", "POST"])
@login_required
def profile():
    current_app.logger.debug(request.method + "User profile. user_id - " + str(current_user.id))
    
    #if request.method == "POST":# and "email" in request.form:

    #    username=request.form["username"]        
    #    email=request.form["email"]
    #    password=request.form["password"]
        
    #    current_user.name = username
    #    current_user.email = email
    #    current_user.password = password
        
    #    User.update_user(current_user)
        
    #    current_app.logger.debug("Updated user profile. user_id -" + str(current_user.id))    
        
    #    return render_template('profile.html', user = current_user)
    #else:
    render_template('profile.html', user = current_user)
                
@user_bp.route('/jupdate/', methods = ["UPDATE"])
@login_required
def jupdate():
    current_app.logger.debug("jupdate")
    
    schema = {
        "type" : "object",
        "properties" : {            
            "username" : {"type" : "string", "minLength" : 4, "maxLength" : 18, "pattern" : "^[A-Za-z1-9\ ]*$"} ,
            "email" : {"type" : "string", "optional" : False, "format" : "email"},
            "password" : {"type" : "string", "optional" : False, "minLength" : 6, "maxLength" : 12}
            }
        }
        
    v = Draft4Validator(schema)
    errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)
        
    if len(errors) > 0:
        msg = u"Fields are not valid" # TODO
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message" : msg})
        # change to flask.abort(code)
    else:
        current_user.name = request.json['username']
        current_user.email = request.json['email']
        current_user.password = request.json['password']
        
        User.update_user(current_user)
        
        current_app.logger.debug("User updated")
        
        return jsonify({"status" : "OK"})    