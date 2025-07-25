from src.models.user import db
from datetime import datetime

class Movement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    material_id = db.Column(db.Integer, db.ForeignKey('material.id'), nullable=False)
    user_email = db.Column(db.String(120), nullable=False)
    movement_type = db.Column(db.String(20), nullable=False)  # 'usage', 'restock', 'adjustment'
    quantity = db.Column(db.Integer, nullable=False)
    previous_stock = db.Column(db.Integer, nullable=False)
    new_stock = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com Material
    material = db.relationship('Material', backref=db.backref('movements', lazy=True))

    def __repr__(self):
        return f'<Movement {self.movement_type} - {self.quantity}>'

    def to_dict(self):
        return {
            'id': self.id,
            'materialId': self.material_id,
            'materialName': self.material.name if self.material else None,
            'userEmail': self.user_email,
            'type': self.movement_type,
            'quantity': self.quantity,
            'previousStock': self.previous_stock,
            'newStock': self.new_stock,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

