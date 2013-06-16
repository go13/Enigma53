from flask import Blueprint, render_template, request, jsonify, current_app
from modules.jsonschema import validate, Draft4Validator

from model import db
from question import Question
from modules.answer import Answer
from quiz.quiz_result import QuizResult
from question_result import QuestionResult
from answer_result import AnswerResult
from modules.results import Historysession
from flask_login import login_required, current_user

question_bp = Blueprint('question_bp', __name__, template_folder = 'pages')

auth_failure_message = u"You don't have permissions to "

#@question_bp.route('/<int:question_id>/')
def question(question_id):
    question = Question.get_question_by_id(question_id)
    if question:
        return render_template('question.html', question=question)
    else:
        return render_template('404.html')

#@question_bp.route('/<int:question_id>/edit/')
#@login_required
def question_edit(question_id):
    question = Question.get_question_by_id(question_id)
    if question:
        return render_template('question_edit.html', question=question)
    else:
        return render_template('404.html')

@question_bp.route('/jget/<int:question_id>/')
@login_required
def jget(question_id):
    current_app.logger.debug("jget - " + str(question_id))
    question = Question.get_question_by_id(question_id)
    if question:
        if current_user.id == question.userid:
            result = {'jstaus':'OK'}
            result.update(question.serialize)
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
    question = Question.get_question_by_id(question_id)
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
    
    question = Question.get_question_by_id(question_id)
    
    if question:
        if current_user.id == question.userid:
            
            current_app.logger.warning(request.json)

            schema = {
                    "type" : "object",
                    "properties" : {            
                        "qid" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                        "quizid" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                        "qtext" : {"type" : "string", "maxLength" : 4096, "optional" : False},
                        "answers" : {"type": "array", "items": { "type" : "object", "properties": {"id" : {"type" : "integer", "maxLength" : 8, "optional" : False},
                                                                  "correct" : {"type" : "string", "enum" : ["T", "F"], "optional" : False},
                                                                  "atext" : {"type" : "string", "maxLength" : 128, "optional" : False} 
                                                                  }}, "maxItems" : 7, "optional" : True},
                        "lat" : {"type" : "number", "maxLength" : 12, "optional" : False},
                        "lon" : {"type" : "number", "maxLength" : 12, "optional" : False},
                        }
                    }
                
            v = Draft4Validator(schema)
            errors = sorted(v.iter_errors(request.json), key = lambda e: e.path)

            qid = request.json['qid']
            qtext = request.json['qtext']
            answers = request.json['answers']
            latitude = request.json['lat']
            longitude = request.json['lon']
            
            if len(errors) == 0:
                current_app.logger.debug("got a question from DB, id = " + str(question_id))
                current_app.logger.debug("qid = " + str(qid))
                current_app.logger.debug("qtext = '" + str(qtext) + "'")
                current_app.logger.debug("answers = " + str(answers))
                current_app.logger.debug("latitude = " + str(latitude))
                current_app.logger.debug("longitude = " + str(longitude))                
                
                Question.update_question_by_id(question_id, {'qtext' : qtext, 'latitude' : latitude, 'longitude' : longitude}, False)
                Answer.delete_answers_by_question_id(question_id, True)
        
                for answer in answers:
                    atext = answer['atext']
                    correct = 'F'
                    if answer['correct']=='T':
                        correct = 'T'
                    Answer.create_answer(question_id, atext, correct, True)
                db.session.commit()
                
                current_app.logger.debug("Status - OK")
                
                result = {'jstaus':'OK'}
                return jsonify(result)
            else:
                if len(qtext) > 4096:
                    msg = u"Question text is too long. It must be less than 4096 symbols"
                    current_app.logger.warning(msg)
                    return jsonify({"status" : "ERROR", "message" : msg})
                elif len(answers) > 7:
                    msg = u"Number of answers must not be greater than 7"
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

@question_bp.route('/jcreate/',methods=['POST'])
@login_required
def jcreate():
    # TODO: validate!
    
    if current_user.id >= 0:

        print 'got a question to create'
        print 'qtext ', request.json['qtext']
        print 'quizid ', request.json['quizid']
        print 'answers ', request.json['answers']
        print 'lat ', request.json['lat']
        print 'lon ', request.json['lon']
    
        qtext = request.json['qtext']
        quizid = request.json['quizid']
        answers = request.json['answers']
        latitude = request.json['lat']
        longitude = request.json['lon']
    
        newQuestion = Question(quizid = quizid, userid = current_user.id, nextquestionid = 2, qtext = qtext, type = 1, answers = answers, latitude = latitude, longitude = longitude)
        db.session.add(newQuestion)
        db.session.commit()
    
        for answer in answers:
            atext = answer['atext']
            id = answer['id']
            correct = 'F'
            if answer['correct'] == 1:
                correct = 'T'
    
            newAnswer = Answer(newQuestion.id, atext, correct)
            db.session.add(newAnswer)
    
        db.session.commit()
    
        result = {'jstaus':'OK', 'qid':newQuestion.id}
        return jsonify(result)
    else:
        msg = "You should be logged in to create a question"
        current_app.logger.warning(msg)
        return jsonify({"status" : "ERROR", "message" : msg})


@question_bp.route('/jdelete/<int:question_id>/',methods=['POST'])
@login_required
def jdelete(question_id):
    print 'deleting a question ', question_id

    question = Question.get_question_by_id(question_id)

    if question:
        if current_user.id == question.userid:
            for answer in question.answers:
                db.session.delete(answer)
    
            db.session.delete(question)
            db.session.commit()
    
            result = {'jstaus':'OK'}
            return jsonify(result)        
        else:
            msg = auth_failure_message + u"delete this page"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})
    else:
        return jsonify({"status":"ERROR"})

@question_bp.route('/jsubmit/<int:question_id>/', methods=['POST'])
def jsubmit(question_id):
    # TODO: validate!
    print 'jsubmit', question_id
    
    hs = Historysession.get_current_historysession_by_userid(current_user.id)
    
    sessionid = hs.id
    
    print sessionid
    
    question = Question.get_question_by_id(question_id)

    if question:
        if current_user.id == question.userid:
            qid = request.json['qid']
            receivedanswers = request.json['answers']
            correct = True
    
            for i in range(0, len(receivedanswers)):
                item = receivedanswers[i]
                aid = item['id']
    
                value = 'F'
                if item['value'] == 'T':
                    value = 'T'
                
                print '------------------------', sessionid, ' value - ', value,' aid - ', aid 
                AnswerResult.add_answer_result(sessionid, aid, value, False)
    
                correct = correct and (value == question.answers[i].correct)
                
                print i, ' - ', question.answers[i].correct
                print 'value - ', value, ' answer = ', question.answers[i].correct, ', correct - ', correct
    
            QuestionResult.add_question_result(sessionid, qid, correct, False)
            db.session.commit()
            
            result = {'jstaus':'OK'}
            return jsonify(result)
        else:
            msg = auth_failure_message + u"submit this question"
            current_app.logger.warning(msg)
            return jsonify({"status" : "ERROR", "message" : msg})
    else:
        return jsonify({"status":"ERROR"})

