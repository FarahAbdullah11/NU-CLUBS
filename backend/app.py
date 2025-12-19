# app.py
# app.py — FULLY WORKING VERSION

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, User, Club, Request, Room
import bcrypt
from datetime import datetime

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

# Flag to ensure db.create_all() runs only once
_first_request = True

@app.before_request
def create_tables_on_first_request():
    global _first_request
    if _first_request:
        db.create_all()
        _first_request = False

# === Routes ===


@app.route('/init-hash', methods=['GET'])
def init_hash_passwords():
    users_to_hash = [
        ('farahghaly@nu.edu.eg', 'nimun123'),
        ('omarsamir@nu.edu.eg', 'rpm123'),
        ('omarkhaled@nu.edu.eg', 'icpc123'),
        ('rofaidaelshobaky@nu.edu.eg', 'ieee123'),
        ('ginamowafy@nu.edu.eg', 'adminSLO'),
        ('janayaman@nu.edu.eg', 'adminSU'),
    ]
    for email, plain in users_to_hash:
        user = User.query.filter_by(email=email).first()
        if user and not user.password_hash.startswith('$2b$'):  # Not hashed
            hashed = bcrypt.hashpw(plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user.password_hash = hashed
            db.session.commit()
    return jsonify({"msg": "Passwords hashed successfully!"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')
    user = User.query.filter(
        (User.email == identifier) | (User.university_id == identifier)
    ).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({
            'user_id': user.user_id,
            'fullname': user.fullname,
            'role': user.role,
            'club_id': user.club_id
        })
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/requests', methods=['POST'])
def create_request():
    data = request.get_json()
    user_id = data.get('user_id')
    user = User.query.get(user_id)
    if not user or user.role != 'CLUB_LEADER':
        return jsonify({'error': 'Only club leaders can submit requests'}), 403
    if user.club_id != data.get('club_id'):
        return jsonify({'error': 'You can only submit requests for your own club'}), 403

    event_date = data.get('event_date')
    start_time = data.get('start_time')
    end_time = data.get('end_time')

    if event_date:
        event_date = datetime.strptime(event_date, '%Y-%m-%d').date()
    if start_time:
        start_time = datetime.strptime(start_time, '%H:%M').time()
    if end_time:
        end_time = datetime.strptime(end_time, '%H:%M').time()

    new_request = Request(
        club_id=data['club_id'],
        title=data['title'],
        description=data.get('description', ''),
        request_type=data['request_type'],
        status='PENDING',
        event_date=event_date,
        start_time=start_time,
        end_time=end_time,
        location=data.get('location'),
        room_id=data.get('room_id'),
        submitted_by=user.user_id
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'Request submitted', 'request_id': new_request.request_id}), 201

@app.route('/api/clubs/<int:club_id>/requests', methods=['GET'])
def get_club_requests(club_id):
    requests = Request.query.filter_by(club_id=club_id).all()
    return jsonify([{
        'request_id': r.request_id,
        'title': r.title,
        'type': r.request_type,
        'status': r.status,
        'event_date': r.event_date.isoformat() if r.event_date else None,
        'created_at': r.created_at.isoformat()
    } for r in requests])

@app.route('/api/admin/requests', methods=['GET'])
def get_all_requests():
    """Get all requests from all clubs - only accessible by SU_ADMIN"""
    # Get user_id from query parameter or header (for now, we'll use query param)
    # In production, you'd want to use proper authentication tokens
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'error': 'User ID required'}), 401
    
    user = User.query.get(user_id)
    if not user or user.role != 'SU_ADMIN':
        return jsonify({'error': 'Only SU_ADMIN can access all requests'}), 403
    
    # Get all requests with club information
    requests = Request.query.join(Club, Request.club_id == Club.club_id).all()
    return jsonify([{
        'request_id': r.request_id,
        'title': r.title,
        'type': r.request_type,
        'status': r.status,
        'event_date': r.event_date.isoformat() if r.event_date else None,
        'created_at': r.created_at.isoformat(),
        'club_id': r.club_id,
        'club_name': r.club.club_name if r.club else 'Unknown Club'
    } for r in requests])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)