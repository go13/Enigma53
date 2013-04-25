from flask import Flask, Blueprint, render_template, request, flash, redirect, url_for \
        #g, session, request, redirect, url_for, flash 

from flask_login import LoginManager, current_user, login_required, \
                             login_user, logout_user, UserMixin, AnonymousUser, \
                             confirm_login, fresh_login_required

from user import User, Anonymous

auth_bp = Blueprint('auth_bp', __name__, template_folder='pages')

@auth_bp.route("/login", methods = ["GET", "POST"])
def login():
    if request.method == "POST" and "email" in request.form:
        email = request.form["email"]
        user = User.get_user_by_email(email)
        if user:
            remember = request.form.get("remember", "no") == "yes"
            if login_user(user, remember=remember):
                flash("Logged in!")
                return redirect(request.args.get("next") or url_for("index"))
            else:
                flash("Sorry, but you could not log in.")
        else:
            flash(u"Invalid username.")
    return render_template("login.html")

@auth_bp.route("/signup", methods = ["GET", "POST"])
def signup():
    if request.method == "POST" and "email" in request.form:
        fullname = request.form["fullname"]        
        email = request.form["email"]
        password = request.form["password"]

        user = User.get_user_by_email(email)
        
        if not user:
            user = User.add_user(fullname, email, password)           
            if login_user(user, False):
                print 'account created'
                #flash(u"Account created!", "success")
                return redirect(url_for("index"))
            else:
                flash(u"Sorry, but you could not log in.", "error")
            return redirect(url_for("index"))
        else:
            flash(u"This email already registered. Please login.", "error")
            return redirect(url_for("index"))            
    return render_template("signup.html")


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
