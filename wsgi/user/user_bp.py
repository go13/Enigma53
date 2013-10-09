from flask import Blueprint, render_template, jsonify, request, current_app, flash
from model import db
from flask_login import login_required, current_user
from auth.user import User
from auth.auth_bp import ProfileForm

from modules.jsonschema import Draft4Validator


user_bp = Blueprint('user_bp', __name__, template_folder = 'pages')

@user_bp.route('/settings/', methods = ["GET", "POST"])
@login_required
def settings():
    current_app.logger.debug(request.method + " User profile. user_id - " + str(current_user.id))
        
    if request.method == "POST":
        form = ProfileForm(request.form)
        if form.validate():

            if (current_user.email != form.email.data) and (len(User.get_users_by_email(form.email.data)) >= 1):
                flash("this email already registered, please choose another email", "error")
            else:

                current_user.name = form.username.data
                current_user.email = form.email.data
                current_user.setPassword(form.password.data)

                User.update_user(current_user)

                current_app.logger.debug("Updated user settings. user_id -" + str(current_user.id))
                flash("Your user settings were successfully updated", "info")
        else:
            for field, err in form.errors.items():
                for error in err:                    
                    flash(getattr(form, field).label.text + " : " + error, "error")
    else:
        form = ProfileForm()
        form.username.data = current_user.name
        form.email.data = current_user.email
        
    return render_template("profile.html", form=form)

@user_bp.route('/jtrain/', methods=["POST"])
@login_required
def jtrain():
    current_app.logger.debug("jtrain")

    schema = {
        "type" : "object",
        "properties" : {
            "trained" : {"type" : "string", "enum" : ["T", "F"], "optional" : False}
            }
        }

    v = Draft4Validator(schema)
    errors = sorted(v.iter_errors(request.json), key=lambda e: e.path)

    if len(errors) > 0:
        msg = u"Fields are not valid"
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message": msg})
    else:
        trained = request.json['trained']
        if trained == 'T':
            current_user.trained = 1
        else:
            current_user.trained = 0

        User.update_user(current_user)
        current_app.logger.debug("User trained")

        return jsonify({"status": "OK"})

@user_bp.route('/jupdate/', methods=["UPDATE"])
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
        current_user.setPassword(request.json['password'])
        
        User.update_user(current_user)
        
        current_app.logger.debug("User updated")
        
        return jsonify({"status" : "OK"})    