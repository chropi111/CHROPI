from flask import Blueprint, jsonify, request
from src.models.movement import Movement, db
from src.models.material import Material

movement_bp = Blueprint('movement', __name__)

@movement_bp.route('/movements', methods=['GET'])
def get_movements():
    movements = Movement.query.order_by(Movement.timestamp.desc()).all()
    return jsonify([movement.to_dict() for movement in movements])

@movement_bp.route('/movements/<int:movement_id>', methods=['GET'])
def get_movement(movement_id):
    movement = Movement.query.get_or_404(movement_id)
    return jsonify(movement.to_dict())

@movement_bp.route('/materials/<int:material_id>/movements', methods=['GET'])
def get_material_movements(material_id):
    movements = Movement.query.filter_by(material_id=material_id).order_by(Movement.timestamp.desc()).all()
    return jsonify([movement.to_dict() for movement in movements])

