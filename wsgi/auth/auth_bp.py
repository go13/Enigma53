from flask import Blueprint, render_template, request, flash, redirect, url_for, current_app
from wtforms import Form, TextField, PasswordField, BooleanField, validators

from flask_login import LoginManager, current_user, login_required, \
                             login_user, logout_user, UserMixin, AnonymousUser, \
                             confirm_login, fresh_login_required

from user import User, Anonymous

auth_bp = Blueprint('auth_bp', __name__, template_folder = 'pages')

def get_email_field():
    return TextField('Email', [
        validators.Length(min = 6, max = 25),
        validators.Required(),
        validators.Email(message = u'Invalid email address')        
        ])
    
def get_username_field():
    return TextField('Username', [
        validators.Length(min = 4, max = 25),
        validators.Required(),
        validators.Regexp('^[A-Za-z1-9\ ]+$', message = u'Username should contain only characters or numbers')
        ])

class LoginForm(Form):
    email = get_email_field()
    password = PasswordField('Password', [
        validators.Required(),
        validators.Length(min = 6, max = 25)
    ])
    remember = BooleanField('Remember Me')

class SignupForm(Form):
    username = get_username_field()
    email = get_email_field()
    password = PasswordField('Password', [
        validators.Required(),
        validators.Length(min = 6, max = 25)
    ])

class ProfileForm(Form):
    username = get_username_field()
    email = get_email_field()
    password = PasswordField('Password', [
        validators.Required(),
        validators.Length(min = 6, max = 25)
        #validators.EqualTo('confirm', message = u'Passwords must match')
    ])
    #confirm = PasswordField('Repeat Password')

@auth_bp.route("/login", methods = ["GET", "POST"])
def login():
    if request.method == "POST":
        current_app.logger.debug(request.method + " login ")
        form = LoginForm(request.form)
        if form.validate():
            current_app.logger.debug("login validation successful")
                    
            email = form.email.data
            password = form.password.data            
            remember = form.remember.data
            
            user = User.get_user_by_email(email)
            if user and user.password == password:
                current_app.logger.debug("login and passwords are OK")    
                            
                if login_user(user, True): #remember ??
                    msg = u"Logged in!"                    
                    flash(msg)
                    current_app.logger.debug(msg)
                    current_app.logger.debug(request.args.get("next") or url_for("index"))
                    return redirect(request.args.get("next") or url_for("index"))
                else:
                    msg = u"Sorry, but you could not log in"
            else:
                msg = u"Invalid username or password"
            flash(msg, "error")
            current_app.logger.debug(msg)
            return render_template("login.html", form = form)
    else:
        form = LoginForm()  
        current_app.logger.debug("returnrning the form")  
        return render_template("login.html", form = form)

@auth_bp.route("/signup", methods = ["GET", "POST"])
def signup():
    if request.method == "POST":
        current_app.logger.debug(request.method + " signup ")
        
        form = SignupForm(request.form)
                
        if form.validate():
            current_app.logger.debug("login validation successful")
            
            email = form.email.data
            password = form.password.data            
            username = form.username.data
            
            user = User.get_user_by_email(email)
            
            if not user:
                user = User.add_user(username, email, password)           
                if login_user(user, True):
                    msg = u"Account created"                    
                    flash(msg, "success")
                    current_app.logger.debug(msg)                    
                else:
                    msg = u"Sorry, but you could not log in"
                    flash(msg, "error")
                    current_app.logger.debug(msg)
                return redirect(url_for("index"))
            else:
                msg = u"This email already registered. Please login"
                flash(msg, "error")
                current_app.logger.debug(msg)
                return redirect(url_for("auth_bp.login"))
    else:
        form = SignupForm()
    return render_template("signup.html", form = form)


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
