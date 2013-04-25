from flask import Blueprint, render_template, jsonify, request, current_app, flash
from wtforms import Form, BooleanField, TextField, PasswordField, validators
from model import db
from flask_login import login_required, current_user
from auth.user import User
from modules.jsonschema import Draft4Validator


user_bp = Blueprint('user_bp', __name__, template_folder = 'pages')

class ProfileForm(Form):
    username = TextField('Username', [
        validators.Length(min = 4, max = 25),
        validators.Required(),
        validators.Regexp('^[A-Za-z1-9\ ]+$', message = u'Username should contain only characters or numbers')
        ])
    email = TextField('Email', [
        validators.Length(min = 6, max = 25),
        validators.Email(message = u'Invalid email address')        
        ])
    password = PasswordField('Password', [
        validators.Required(),
        validators.Length(min = 6, max = 25),
        validators.EqualTo('confirm', message = u'Passwords must match')
    ])
    confirm = PasswordField('Repeat Password')

@user_bp.route('/profile/', methods = ["GET", "POST"])
@login_required
def profile():
    current_app.logger.debug(request.method + " User profile. user_id - " + str(current_user.id))
        
    if request.method == "POST":
        form = ProfileForm(request.form)
        if form.validate():                    
            current_user.name = form.username.data
            current_user.email = form.email.data
            current_user.password = form.password.data
            
            User.update_user(current_user)
            
            current_app.logger.debug("Updated user profile. user_id -" + str(current_user.id))    
    
            flash("Success")
    else:
        form = ProfileForm()
        form.username.data = current_user.name
        form.email.data = current_user.email
        
    return render_template("profile.html", form = form)
                
@user_bp.route('/jupdate/', methods = ["UPDATE"])
@login_required
def jupdate():
    current_app.logger.debug("jupdate")
    
    schema = {
        "type" : "object",
        "properties" : {            
            "username" : {"type" : "string", "minLength" : 4, "maxLength" : 25, "pattern" : "^[A-Za-z1-9]+$"} ,
            "email" : {"type" : "string", "optional" : False, "format" : "email", "maxLength" : 25},
            "password" : {"type" : "string", "optional" : False, "minLength" : 6, "maxLength" : 25}
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