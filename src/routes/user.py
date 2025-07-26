from flask import Blueprint, jsonify, request
from src.models.user import User, db

user_bp = Blueprint('user', __name__)

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400
    
    # Senha fixa para todos os usuários
    SENHA_FIXA = "G7#p2@kq"
    
    if password != SENHA_FIXA:
        return jsonify({'error': 'Senha incorreta. Use a senha padrão do sistema.'}), 401
    
    # Se a senha estiver correta, busca ou cria o usuário
    user = User.query.filter_by(email=email).first()
    if not user:
        # Cria usuário se não existir
        user = User(username=email.split('@')[0], email=email, role='user')
        user.set_password(SENHA_FIXA)
        db.session.add(user)
        db.session.commit()
    
    return jsonify({
        'message': 'Login realizado com sucesso',
        'user': user.to_dict()
    }), 200

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(username=data['username'], email=data['email'])
    if 'password' in data:
        user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204
