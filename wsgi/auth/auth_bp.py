from flask import Blueprint, render_template, request, flash, redirect, url_for, current_app, helpers
from wtforms import Form, TextField, PasswordField, BooleanField, validators

from flask_login import login_required, \
                             login_user, logout_user

from user import User

auth_bp = Blueprint('auth_bp', __name__, template_folder = 'pages')

def get_email_field():
    return TextField('Email', [
        validators.Length(min = 6, max = 25),
        validators.Required(),
        validators.Email(message=u'Invalid email address')
        ])
    
def get_username_field():
    return TextField('Username', [
        validators.Length(min=4, max=25),
        validators.Required(),
        validators.Regexp('[^~@#\^\$&\*\(\)\+=\[\]\{\}\|\\,\?\s]+$', message=u'Username should contain only characters or numbers')
        ])

class LoginForm(Form):
    email = get_email_field()
    password = PasswordField('Password', [
        validators.Required(),
        validators.Length(min=6, max=25)
    ])
    remember = BooleanField('Remember Me')

class SignupForm(Form):
    username = get_username_field()
    email = get_email_field()
    password = PasswordField('Password', [
        validators.Required(),
        validators.Length(min=6, max=25)
    ])

class ProfileForm(Form):
    username = get_username_field()
    email = get_email_field()
    password = PasswordField('Password', [
        validators.Required(),
        validators.Length(min=6, max=25)
        #validators.EqualTo('confirm', message = u'Passwords must match')
    ])
    #confirm = PasswordField('Repeat Password')

@auth_bp.route("/login", methods = ["GET", "POST"])
def login():
    errors = None
    if request.method == "POST":
        current_app.logger.debug(request.method + " login ")
        form = LoginForm(request.form)
        if form.validate():
            current_app.logger.debug("login validation successful")
                    
            email = form.email.data.decode("UTF-8")
            password = form.password.data.decode("UTF-8")
            remember = form.remember.data
            
            users = User.get_users_by_email(email)
            if (len(users) > 0) and users[0].password == password:
                user = users[0]
                current_app.logger.debug("login and passwords are OK for user: " + user.name)    
                            
                if login_user(user, remember):
                    current_app.logger.debug("Logged in!")
                    current_app.logger.debug(request.args.get("next") or url_for("index"))
                    helpers.get_flashed_messages() # to clean the flash cache
                    return redirect(request.args.get("next") or url_for("index"))
                else:
                    error = u"could not log in for some reason"
                    errors = [error]
                    current_app.logger.debug(user.name + " " + error)
            else:
                error = u"Invalid email or password"
                errors = [error]
                current_app.logger.debug(error)
        else:
            error = u"Invalid email or password"
            errors = [error]
            current_app.logger.debug(error)
    else:
        form = LoginForm()
        current_app.logger.debug("Returning the form")  
    return render_template("login.html", errors = errors, form = form)

@auth_bp.route("/signup", methods = ["GET", "POST"])
def signup():
    errors = None
    if request.method == "POST":
        current_app.logger.debug(request.method + " Signup")
        
        form = SignupForm(request.form)

        if form.validate():
            current_app.logger.debug("login validation successful")
            
            email = form.email.data
            password = form.password.data            
            username = form.username.data
            
            users = User.get_users_by_email(email)

            if len(users) <= 0:
                user = User.add_user(username, email, password)           
                if login_user(user, True):
                    msg = u"Account created for " + username                    
                    current_app.logger.debug(msg)
                    helpers.get_flashed_messages() # to clean the flash cache
                    return redirect(url_for("index"))                    
                else:
                    errors = []
                    msg = u"Sorry, but you could not sign up."
                    current_app.logger.debug(msg)
                    errors.append(msg)
            else:
                errors = []
                msg = u"This email already registered. Please login or use another email."
                current_app.logger.debug(msg)
                errors.append(msg)
        elif form.errors:
            current_app.logger.debug("login validation failed")
            errors = []            
            for field, err in form.errors.items():
                for error in err:
                    errors.append(getattr(form, field).label.text + " : " + error)
    else:
        form = SignupForm()
    return render_template("signup.html", form = form, errors = errors)

@auth_bp.route("/reauth", methods = ["GET", "POST"])
@login_required
def reauth():
    if request.method == "POST":
        return redirect(request.args.get("next") or url_for("index"))
    return render_template("reauth.html")


@auth_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logged out.")
    return redirect(url_for("index")) 
