from flask import Blueprint, render_template, jsonify, request, redirect, current_app
from modules.jsonschema import validate, Draft4Validator

from model import db
from quiz import Quiz
from quiz_result import QuizResult
from flask_login import login_required, current_user

quiz_bp = Blueprint('quiz_bp', __name__, template_folder='pages')
auth_failure_message = u"You don't have permissions to "

@quiz_bp.route('/<int:quiz_id>/')
def quiz(quiz_id):
    current_app.logger.debug("quiz. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    if quiz:            
        if current_user.id == quiz.user_id:
            can_persist = True
            jsdata = {
                      "questions": [i.serialize for i in quiz.questions],
                      "can_persist": can_persist
                      }
            if (len(quiz.questions) > 0):
                QuizResult.start_session(quiz_id, current_user.id)
                db.session.commit()
            return render_template('quiz.html', quiz=quiz, jsdata=jsdata, can_persist=can_persist)

        elif quiz.permission == 'public':
            can_persist = False
            jsdata = {
              "questions": [i.serialize for i in quiz.questions],
              "can_persist": can_persist
            }
            return render_template('quiz.html', quiz=quiz, jsdata=jsdata, can_persist=can_persist)
        else:
            return render_template('auth_failure.html')            
    else:
        current_app.logger.warning("No quiz found")
        return render_template('404.html')

@quiz_bp.route('/<int:quiz_id>/edit/')
@login_required
def quiz_map_edit(quiz_id):
    current_app.logger.debug("quiz_edit. quiz_id - " + str(quiz_id))

    quizes = Quiz.get_quizes_by_user_id(current_user.id)

    for q in quizes:
        q.quiz_results = QuizResult.get_quiz_results_only_by_quiz_id(q.qid)

    quiz = Quiz.get_quiz_by_id(quiz_id)

    quiz_results = QuizResult.get_quiz_results_only_by_quiz_id(quiz_id)

    def serialize_for_left_menu(q):
        return {
            "quiz_results": [qr.serialize_for_statistics for qr in q.quiz_results],
            "quiz": q.serialize_for_result
        }

    jsdata = {
              "quiz_results": [i.serialize_for_statistics for i in quiz_results],
              "quizes": [serialize_for_left_menu(q) for q in quizes]
              }

    if quiz:
        if current_user.id == quiz.user_id:
            return render_template("quiz_map_edit.html", quiz=quiz, quizes=quizes, \
                                   active_page='quiz_edit', jsdata=jsdata, showTour=(not current_user.isTrained()))
        else:
            return render_template("auth_failure.html")
    else:
        current_app.logger.warning("No quiz found")        
        return render_template("404.html")

@quiz_bp.route('/list/')
@login_required
def quiz_list():
    current_app.logger.debug("quiz_list")

    quizes = Quiz.get_quizes_by_user_id(current_user.id)

    for q in quizes:
        q.quiz_results = QuizResult.get_quiz_results_only_by_quiz_id(q.qid)

    lat = 37.4419
    lon = -122.1419

    if len(quizes) > 0:
        lat = quizes[0].latitude
        lon = quizes[0].longitude

    def serialize_for_left_menu(q):
        return {
            "quiz_results": [qr.serialize_for_statistics for qr in q.quiz_results],
            "quiz": q.serialize_for_result
        }

    jsdata = {
              "latitude": lat,
              "longitude": lon,
              "quizes": [serialize_for_left_menu(q) for q in quizes]
              }

    return render_template("quiz_list.html", quizes=quizes, jsdata=jsdata, \
                           active_page="quiz_list", showTour=(not current_user.isTrained()))

@quiz_bp.route('/jupdate/<int:quiz_id>/', methods=["GET", "POST"])
def jupdate(quiz_id):
    current_app.logger.debug("jupdate. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:
        if current_user.id == quiz.user_id:
            schema = {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "minLength": 4, "maxLength": 55, "optional": False},
                    "is_private": {"type": "string", "minLength": 1, "maxLength": 1, "optional": False},
                    }
                }

            v = Draft4Validator(schema)
            errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)
    
            if len(errors) > 0:
                msg = u"Error : "
                if len(request.json['title']) < 4 or len(request.json['title']) > 55:
                    msg = u"Title length should be greater than 3 and less than 55 symbols"
                else:
                    for e in errors:
                        msg = msg + e.message.decode("UTF-8")
                    
                result = {"status": "ERROR", "message": msg}
                current_app.logger.warning(result)
                return jsonify(result)
            else:
                title = request.json['title']
                is_private = request.json['is_private']
                if is_private == 'T':
                    Quiz.update_quiz_by_id(quiz_id, title, None, 'private')
                else:
                    Quiz.update_quiz_by_id(quiz_id, title, None, 'public')
                db.session.commit()
                
                current_app.logger.debug('Quiz updated. quiz.id - ' + str(quiz_id) + ', title - ' + title)
                return jsonify({"status" : "OK", "quizid": quiz_id})
        else:
            msg = auth_failure_message + u"update this quiz(id = " + str(quiz_id).decode("UTF-8")+")"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message": msg})
    else:
        msg = u"No quiz found with such quiz_id" + str(quiz_id).decode("UTF-8")
        current_app.logger.warning(msg)
        return jsonify({"status": "ERROR", "message": msg})

@quiz_bp.route('/jget/<int:quiz_id>/')
def jget(quiz_id):
    current_app.logger.debug("jget. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_by_id(quiz_id)
    
    if quiz:
        if current_user.id == quiz.userid:
            result = {'status': 'OK'}
            result.update(quiz.serialize)
           
            return jsonify(result)
        else:
            msg = auth_failure_message + u"view this quiz(id = " + str(quiz_id).decode("UTF-8")+")"
            current_app.logger.warning(msg)
            return jsonify({"status": "ERROR", "message": msg})
    else:
        msg = u"No quiz found with such quiz_id" + str(quiz_id).decode("UTF-8")
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message": msg})

@quiz_bp.route('/jdelete/<int:quiz_id>/', methods=['DELETE'])
@login_required
def jdelete(quiz_id):
    current_app.logger.debug("jdelete. quiz_id - " + str(quiz_id))
    
    quiz = Quiz.get_quiz_only_by_id(quiz_id)
    
    if quiz:
        if current_user.id == quiz.user_id:

            QuizResult.delete_quiz_results_by_quiz_id(quiz_id)
            Quiz.delete_quiz_by_id(quiz_id)

            db.session.commit()
            current_app.logger.debug("Quiz deleted")

            return jsonify({"status": "OK"})
        else:
            msg = auth_failure_message + u"delete this quiz(id = " + str(quiz_id).decode("UTF-8")+")"
            current_app.logger.warning(msg)
            return jsonify({"status": "ERROR", "message" : msg})
    else:
        msg = u"No quiz found with such quiz_id" + str(quiz_id).decode("UTF-8")
        current_app.logger.warning(msg)        
        return jsonify({"status": "ERROR", "message": msg})
    
@quiz_bp.route('/jcreate/', methods=['POST'])
@login_required
def jcreate():
    current_app.logger.debug("jcreate")

    quiz = Quiz.create_quiz(current_user.id)
    db.session.commit()

    current_app.logger.debug('Quiz created. quiz.id - ' + str(quiz.qid))

    return jsonify({"status": "OK", "quizid": quiz.qid})

@quiz_bp.route('/create/')
@login_required
def create():
    current_app.logger.debug("create")

    quiz = Quiz.create_quiz(current_user.id)
    db.session.commit()

    current_app.logger.debug('Quiz created. quiz.id - ' + str(quiz.qid))

    return redirect("/quiz/" + str(quiz.qid) + "/edit/")

@quiz_bp.route('/<int:quiz_id>/finish/')
@login_required
def finish_session(quiz_id):
    current_app.logger.debug('finish_session')
    qr = QuizResult.get_quiz_result_by_quiz_id_user_id(quiz_id, current_user.id)

    if qr:        
        if current_user.id == qr.quiz.user_id:
            qr.finish_session()
            db.session.commit()
            return redirect("/quiz/results/" + str(qr.session_id))
        else:
            return render_template('auth_failure.html')
    else:
        current_app.logger.warning("No such quiz found")        
        return render_template('404.html')