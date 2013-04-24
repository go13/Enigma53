from sqlalchemy import Integer, Unicode

from model import db

class Answer(db.Model):
    __tablename__ = 'answers'

    id = db.Column('id', Integer, primary_key = True)
    questionid = db.Column('questionid', Integer)
    atext = db.Column('atext', Unicode)
    correct = db.Column('correct', String)

    def __init__(self, questionid=questionid, atext=atext, correct=correct):
        self.atext = atext
        self.questionid = questionid
        self.correct = correct

    def __repr__(self):
        return '<Answer %s>' % (self.atext)

    @property
    def serialize(self):
        return {
            'id':self.id,
            'atext':self.atext
           }

    @property
    def serialize_for_edit(self):
        return {
            'id':self.id,
            'questionid':self.questionid, # ???
            'atext':self.atext,
            'correct':self.correct
           }
    @staticmethod
    def get_answer_by_id(id):
        q  = Answer.query.filter_by(id=id).first()
        if q is not None:
            return q
        return None

    @staticmethod
    def get_answer_by_question_id(questionid):
        list  = Answer.query.filter_by(questionid=questionid).all()
        if list is not None:
            return list
        return None
    
    @staticmethod
    def delete_answer_by_id(id):
        return Answer.query.filter_by(id=id).delete()
    
    @staticmethod
    def update_answer_by_id(id, answer, correct):
        result = Answer.query.filter_by(id=id).update({'answer':answer, 'correct':correct})                
        db.session.commit()        
        return result
    
    @staticmethod
    def create_answer(questionid, answer, correct, batch):
        answer = Answer(questionid, answer, correct)
        db.session.add(answer)                
        if batch: 
            db.session.commit()        
        return answer.id
    
    @staticmethod
    def delete_answers_by_question_id(questionid, batch):
        print 'delete_answers_by_question_id ', questionid
        answers = Answer.query.filter_by(questionid=questionid).all()
        if answers:
            for item in answers:       
                print 'Answer found ', item.id         
                db.session.delete(item)
        if not batch:
            db.session.commit()

