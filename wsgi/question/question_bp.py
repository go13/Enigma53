from datetime import datetime
from flask import Blueprint, render_template, request, jsonify, current_app
from modules.jsonschema import validate, Draft4Validator

from model import db
from quiz.quiz import Quiz
from question import Question
from answer.answer import Answer
from question_revision import QuestionRevision
from question_result import QuestionResult
from answer_result import AnswerResult
from results.historysession import Historysession
from flask_login import login_required, current_user

question_bp = Blueprint('question_bp', __name__, template_folder = 'pages')

auth_failure_message = u"You don't have permissions to "

#@question_bp.route('/<int:question_id>/')
def question(question_id):
    question = Question.get_active_question_by_id(question_id)
    if question:
        return render_template('question.html', question = question)
    else:
        return render_template('404.html')

#@question_bp.route('/<int:question_id>/edit/')
#@login_required
def question_edit(question_id):
    question = Question.get_active_question_by_id(question_id)
    if question:
        return render_template('question_edit.html', question = question)
    else:
        return render_template('404.html')

@question_bp.route('/jget/<int:question_id>/')
@login_required
def jget(question_id):
    current_app.logger.debug("jget - " + str(question_id))
    question = Question.get_active_question_by_id(question_id)
    if question:
        if current_user.id == question.user_id:
            result = {'jstaus':'OK'}
            result.update(question.serialize)
            current_app.logger.warning("jget result = " + str(result))
            return jsonify(result)
        else:
            msg = auth_failure_message + u"view this question"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})   
    else:
        msg = u"No such question found!"
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message" : msg})

@question_bp.route('/jget_for_edit/<int:question_id>/')
@login_required
def jget_for_edit(question_id):
    current_app.logger.debug("jget_for_edit - " + str(question_id))
    question = Question.get_active_question_by_id(question_id)
    if question:
        if current_user.id == question.userid:
            result = {'jstaus':'OK'}
            result.update(question.serialize_for_edit)
            
            current_app.logger.debug("jget_for_edit - " + str(result))
            
            return jsonify(result)
        else:
            msg = auth_failure_message + u"edit this question"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})        
    else:
        msg = u"No such question found!"
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message" : msg})

@question_bp.route('/jupd/<int:question_id>/',methods=['POST'])
@login_required
def jupd(question_id):
    current_app.logger.debug("question.jupd. - " + str(question_id))    
    
    question = Question.get_active_question_by_id(question_id)
    
    if question:
        if current_user.id == question.user_id:
            
            current_app.logger.warning(request.json)

            schema = {
                    "type" : "object",
                    "properties" : {            
                        "id" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                        "quizid" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                        "qtext" : {"type" : "string", "maxLength" : 4096, "optional" : False},
                        "answers" : {"type": "array", "items": { "type" : "object", "properties": {"id" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                                                                  "correct" : {"type" : "string", "enum" : ["T", "F"], "optional" : False},
                                                                  "atext" : {"type" : "string", "maxLength" : 128, "optional" : False} 
                                                                  }}, "maxItems" : 25, "optional" : True},
                        "lat" : {"type" : "number", "maxLength" : 12, "optional" : False},
                        "lon" : {"type" : "number", "maxLength" : 12, "optional" : False},
                        }
                    }
                
            v = Draft4Validator(schema)
            errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)

            qid = request.json['id']
            qtext = request.json['qtext']
            answers = request.json['answers']
            latitude = request.json['lat']
            longitude = request.json['lon']

            if len(errors) == 0:
                #TODO - allow displaying unallowed tags as non html tags
                #scrubb = scrubber.Scrubber()                
                #qtext = jinja2.Markup(scrubb.scrub(qtext))
                
                current_app.logger.debug("got a question from DB, id = " + str(question_id))
                current_app.logger.debug("id = " + str(qid))
                current_app.logger.debug("qtext = '" + qtext + "'")
                current_app.logger.debug("answers = " + str(answers))
                current_app.logger.debug("latitude = " + str(latitude))
                current_app.logger.debug("longitude = " + str(longitude))

                results = QuestionResult.get_question_results_by_revision_id(question.revision_id)

                if len(results) > 0:
                    Question.update_question_by_id_and_create_revision(question_id, qtext, latitude, longitude)
                else:
                    Question.update_question_by_id(question_id, qtext, latitude, longitude)

                db.session.commit()

                current_app.logger.debug("Status - OK")
                
                result = {'staus':'OK'}
                return jsonify(result)
            else:
                if len(qtext) > 4096:
                    msg = u"Question text is too long. It must be less than 4096 symbols"
                    current_app.logger.warning(msg)
                    return jsonify({"status" : "ERROR", "message" : msg})
                elif len(answers) > 25:
                    msg = u"Number of answers must not be greater than 25"
                    current_app.logger.warning(msg)
                    return jsonify({"status" : "ERROR", "message" : msg})                    
                else:
                    msg = u"Error : "
                    for e in errors:
                        msg = msg + str(list(e.path)[len(list(e.path))-1]) + " - " + e.message.decode("UTF-8")
    
                    current_app.logger.warning(msg)
                    return jsonify({"status" : "ERROR", "message" : msg})
        else:
            msg = auth_failure_message + u"update this question"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})            
    else:
        msg = u"No such question found!"
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message" : msg})

#TODO - add adding a quiz revizion
@question_bp.route('/jcreate/',methods=['POST'])
@login_required
def jcreate():
    current_app.logger.debug("jcreate. " + str(request.json))
    
    if current_user.id >= 0:
        
        schema = {
                    "type" : "object",
                    "properties" : {            
                        "id" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                        "quizid" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                        "qtext" : {"type" : "string", "maxLength" : 4096, "optional" : False},                        
                        "lat" : {"type" : "number", "maxLength" : 12, "optional" : False},
                        "lon" : {"type" : "number", "maxLength" : 12, "optional" : False},
                        }
                    }
                
        v = Draft4Validator(schema)
        errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)

        if len(errors) == 0:        
        
            qtext = request.json['qtext']
            quiz_id = request.json['quizid']
            latitude = request.json['lat']
            longitude = request.json['lon']

            new_question = Question.create_question(quiz_id, current_user.id,\
                                                   qtext, qtext, latitude, longitude)

            db.session.commit()
                    
            result = {'jstaus' : 'OK', 'id' : new_question.qid}
            return jsonify(result)
        else:
            msg = "Error in json"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})
    else:
        msg = "You should be logged in to create a question"
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message" : msg})

#TODO - add adding a quiz revizion
@question_bp.route('/jdelete/<int:question_id>/',methods=['POST'])
@login_required
def jdelete(question_id):
    current_app.logger.debug("jdelete. " + str(question_id))

    question = Question.get_question_only_by_id(question_id)

    if question:
        if current_user.id == question.user_id:

            question.delete_question()

            db.session.commit()
    
            result = {'jstaus':'OK'}
            return jsonify(result)
        else:
            msg = auth_failure_message + u"delete this page"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})
    else:
        return jsonify({"status" : "ERROR"})

@question_bp.route('/jsubmit/<int:question_id>/', methods=['POST'])
def jsubmit(question_id):

    hs = Historysession.get_current_history_session_by_user_id_quiz_id(current_user.id)
    session_id = hs.hsid

    current_app.logger.debug("jsubmit - " + str(question_id) + ", session_id - " + str(session_id))
    current_app.logger.debug("json in jsubmit - " + str(request.json))
    
    question = Question.get_active_question_by_id(question_id)

    if question:
        if current_user.id == question.user_id:
            schema = {
                    "type" : "object",
                    "properties" : {            
                        "id" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                        "answers" : {"type": "array", "items": { "type" : "object", "properties": {
                                                                  "id" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                                                                  "value" : {"type" : "string", "enum" : ["T", "F"], "optional" : False} 
                                                                  }}, "maxItems" : 25, "optional" : True}
                        }
                    }

            v = Draft4Validator(schema)
            errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)
            
            if len(errors) > 0:
                msg = u"Error in json format"
                current_app.logger.warning(msg)
                return jsonify({"status" : "ERROR", "message" : msg})
            else:            
                qid = request.json['id']
                received_answers = request.json['answers']

                correct = True
                for i in range(0, len(received_answers)):
                    item = received_answers[i]
                    aid = item['id']
                    value = item['value']

                    AnswerResult.add_answer_result(session_id, aid, question.revision_id, value)
        
                    correct = correct and (value == question.answers[i].correct)                    
                    
                    current_app.logger.debug("a# = " + str(i) + ", value = " + str(value) + ", answer = " + str(question.answers[i].correct) + ", correct = " + str(correct))

                QuestionResult.add_question_result(session_id, question.qid, question.revision_id, correct)
                db.session.commit()
                
                result = {'jstaus':'OK'}
                return jsonify(result)
        else:
            msg = auth_failure_message + u"submit this question"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})
    else:
        return jsonify({"status" : "ERROR"})