from flask import Blueprint, jsonify, request
from src.models.material import Material, db
from src.models.movement import Movement

material_bp = Blueprint('material', __name__)

@material_bp.route('/materials', methods=['GET'])
def get_materials():
    materials = Material.query.all()
    return jsonify([material.to_dict() for material in materials])

@material_bp.route('/materials', methods=['POST'])
def create_material():
    data = request.json
    material = Material(
        name=data['name'],
        description=data.get('description', ''),
        presentation=data.get('presentation', 'Unidade'),
        stock_quantity=data.get('stock_quantity', 0)
    )
    db.session.add(material)
    db.session.commit()
    return jsonify(material.to_dict()), 201

@material_bp.route('/materials/<int:material_id>', methods=['GET'])
def get_material(material_id):
    material = Material.query.get_or_404(material_id)
    return jsonify(material.to_dict())

@material_bp.route('/materials/<int:material_id>/usage', methods=['PUT'])
def register_usage(material_id):
    material = Material.query.get_or_404(material_id)
    data = request.json
    
    quantity = data.get('quantity', 0)
    user_email = data.get('user_email', '')
    
    if quantity <= 0:
        return jsonify({'error': 'Quantidade deve ser maior que zero'}), 400
    
    if material.stock_quantity < quantity:
        return jsonify({'error': 'Estoque insuficiente'}), 400
    
    # Registrar movimento
    previous_stock = material.stock_quantity
    new_stock = previous_stock - quantity
    
    movement = Movement(
        material_id=material_id,
        user_email=user_email,
        movement_type='usage',
        quantity=quantity,
        previous_stock=previous_stock,
        new_stock=new_stock
    )
    
    # Atualizar estoque
    material.stock_quantity = new_stock
    
    db.session.add(movement)
    db.session.commit()
    
    return jsonify({
        'message': 'Uso registrado com sucesso',
        'material': material.to_dict(),
        'movement': movement.to_dict()
    }), 200

@material_bp.route('/materials/<int:material_id>/stock', methods=['PUT'])
def update_stock(material_id):
    material = Material.query.get_or_404(material_id)
    data = request.json
    
    new_stock = data.get('stock_quantity')
    user_email = data.get('user_email', '')
    
    if new_stock is None or new_stock < 0:
        return jsonify({'error': 'Quantidade de estoque inválida'}), 400
    
    # Registrar movimento
    previous_stock = material.stock_quantity
    quantity = abs(new_stock - previous_stock)
    movement_type = 'restock' if new_stock > previous_stock else 'adjustment'
    
    movement = Movement(
        material_id=material_id,
        user_email=user_email,
        movement_type=movement_type,
        quantity=quantity,
        previous_stock=previous_stock,
        new_stock=new_stock
    )
    
    # Atualizar estoque
    material.stock_quantity = new_stock
    
    db.session.add(movement)
    db.session.commit()
    
    return jsonify({
        'message': 'Estoque atualizado com sucesso',
        'material': material.to_dict(),
        'movement': movement.to_dict()
    }), 200

@material_bp.route('/materials/<int:material_id>', methods=['PUT'])
def update_material(material_id):
    material = Material.query.get_or_404(material_id)
    data = request.json
    
    material.name = data.get('name', material.name)
    material.description = data.get('description', material.description)
    material.presentation = data.get('presentation', material.presentation)
    
    db.session.commit()
    return jsonify(material.to_dict())

@material_bp.route('/materials/<int:material_id>', methods=['DELETE'])
def delete_material(material_id):
    material = Material.query.get_or_404(material_id)
    db.session.delete(material)
    db.session.commit()
    return '', 204

