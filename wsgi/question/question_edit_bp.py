from flask import Flask, Blueprint, render_template, request, redirect, url_for
from sqlalchemy import Table, Column, Integer, String
from flask.ext.wtf import Form, SelectMultipleField , SubmitField, RadioField, SelectField, BooleanField, HiddenField
from wtforms import widgets
import time, datetime

from model import db
from answer import Answer, Answerhistory, Answer_Submit_Form

questionbp = Blueprint('editquestionbp', __name__, template_folder='pages')

