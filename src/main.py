import os
import sys
# DON\'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.material import Material
from src.models.movement import Movement
from src.routes.user import user_bp
from src.routes.material import material_bp
from src.routes.movement import movement_bp
from src.routes.report import report_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), \'static\'))
app.config[\'SECRET_KEY\'] = \'asdf#FGSgvasgf$5$WGT\'

# Habilitar CORS para todas as rotas
CORS(app)

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix=\'/api\')
app.register_blueprint(material_bp, url_prefix=\'/api\')
app.register_blueprint(movement_bp, url_prefix=\'/api\')
app.register_blueprint(report_bp, url_prefix=\'/api\')

# Configuração do banco de dados para Heroku
app.config[\'SQLALCHEMY_DATABASE_URI\'] = os.environ.get(\'DATABASE_URL\') or \
    f"sqlite:///{os.path.join(os.path.dirname(__file__), \'database\', \'app.db\')}"
app.config[\'SQLALCHEMY_TRACK_MODIFICATIONS\'] = False
db.init_app(app)

def init_database():
    """Inicializa o banco de dados com dados padrão"""
    with app.app_context():
        db.create_all()
        
        # Verificar se já existem materiais
        if Material.query.count() == 0:
            # Criar materiais padrão
            materials_data = [
                {\'name\': \'Pincel Chato Nº 2\', \'description\': \'Pincel chato para detalhes\', \'stock_quantity\': 15},
                {\'name\': \'Pincel Chato Nº 4\', \'description\': \'Pincel chato médio\', \'stock_quantity\': 12},
                {\'name\': \'Pincel Chato Nº 6\', \'description\': \'Pincel chato grande\', \'stock_quantity\': 8},
                {\'name\': \'Pincel Chato Nº 8\', \'description\': \'Pincel chato extra grande\', \'stock_quantity\': 6},
                {\'name\': \'Pincel Redondo Nº 2\', \'description\': \'Pincel redondo pequeno\', \'stock_quantity\': 20},
                {\'name\': \'Pincel Redondo Nº 4\', \'description\': \'Pincel redondo médio\', \'stock_quantity\': 18},
                {\'name\': \'Pincel Redondo Nº 6\', \'description\': \'Pincel redondo grande\', \'stock_quantity\': 14},
                {\'name\': \'Pincel Redondo Nº 8\', \'description\': \'Pincel redondo extra grande\', \'stock_quantity\': 10},
                {\'name\': \'Pincel Angular Nº 2\', \'description\': \'Pincel angular pequeno\', \'stock_quantity\': 7},
                {\'name\': \'Pincel Angular Nº 4\', \'description\': \'Pincel angular médio\', \'stock_quantity\': 5},
                {\'name\': \'Pincel Leque Pequeno\', \'description\': \'Pincel leque para texturas\', \'stock_quantity\': 4},
                {\'name\': \'Pincel Leque Médio\', \'description\': \'Pincel leque médio\', \'stock_quantity\': 3},
                {\'name\': \'Pincel Detalhes Nº 0\', \'description\': \'Pincel para detalhes finos\', \'stock_quantity\': 25},
                {\'name\': \'Pincel Detalhes Nº 1\', \'description\': \'Pincel para detalhes\', \'stock_quantity\': 22},
                {\'name\': \'Pincel Esfumado\', \'description\': \'Pincel para esfumar\', \'stock_quantity\': 9}
            ]
            
            for material_data in materials_data:
                material = Material(**material_data)
                db.session.add(material)
            
            db.session.commit()
            print("Materiais padrão criados com sucesso!")

@app.route(\'/\', defaults={\'path\': \'\'}) 
@app.route(\'/<path:path>\')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, \'index.html\')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, \'index.html\')
        else:
            return "index.html not found", 404


if __name__ == \'__main__\':
    # init_database() # Removido para Heroku, será executado na release phase
    port = int(os.environ.get(\'PORT\', 5000))
    app.run(host='0.0.0.0', port=port)


