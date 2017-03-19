import flask
import flask_sqlalchemy
import flask_restless

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:mysecretpassword@postgres/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = flask_sqlalchemy.SQLAlchemy(app)

# Models
class Lunch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    registrations = db.relationship("Registration")
    title = db.Column(db.Unicode, nullable=False)
    text = db.Column(db.Unicode, default='')
    date = db.Column(db.DateTime, nullable=False)
    chef = db.Column(db.Unicode, nullable=False)
    is_vegetarian = db.Column(db.Boolean, default=False)
    is_vegan = db.Column(db.Boolean, default=False)
    is_meat = db.Column(db.Boolean, default=False)

class Registration(db.Model):
    __tablename__ = 'registration'
    __table_args__ = (db.UniqueConstraint('lunch_id', 'username', name='uix_1'), )
    id = db.Column(db.Integer, primary_key=True)
    lunch_id = db.Column(db.Integer, db.ForeignKey('lunch.id'))
    username = db.Column(db.Unicode, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    

# Create the database tables.
db.create_all()

# Create the Flask-Restless API manager.
manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

# Create API endpoints, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well.
manager.create_api(Lunch, methods=['GET', 'POST'])
manager.create_api(Registration, methods=['GET', 'POST', 'DELETE'])

# start the flask loop
app.run(host='0.0.0.0')
