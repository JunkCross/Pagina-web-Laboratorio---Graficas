from flask import Flask, jsonify, request
from grafana_api.model import APIModel
from grafana_api.dashboard import Dashboard
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timedelta
#from .models import Ubicacion, Recinto, Concentrador, Sensor

app = Flask(__name__)

# Conexión a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['test']

# Obtener ubicaciones disponibles
@app.route('/api/ubicaciones', methods=['GET'])
def get_ubicaciones():
    ubicaciones = db.ubicaciones.find()
    print(ubicaciones)  # Imprimir los resultados
    return jsonify([{'_id': str(ubicacion['_id']), 'área': ubicacion['área'], 'recinto': ubicacion['recinto']} for ubicacion in ubicaciones])

@app.route('/api/recintos', methods=['GET'])
def get_recintos():
    recintos = db.ubicaciones.find()
    return jsonify([{'_id': str(recinto['_id']), 'recinto': recinto['recinto']} for recinto in recintos])

# Obtener concentradores disponibles
@app.route('/api/concentradores', methods=['GET'])
def get_concentradores():
    concentradores = db.concentradores.find()
    return jsonify([{'_id': str(concentrador['_id']), 'placa': concentrador['placa'], 'ubicación': str(concentrador['ubicación'])} for concentrador in concentradores])

# Obtener sensores disponibles para un concentrador específico
@app.route('/api/sensores/<concentrador_id>', methods=['GET'])
def get_sensores(concentrador_id):
    sensores = db.sensores.find({'concentrador': ObjectId(concentrador_id)})
    print(sensores)
    return jsonify([{'_id': str(sensor['_id']), 'tipo': sensor['tipo'], 'descripción': sensor['descripción']} for sensor in sensores])


# Obtener sensores disponibles
@app.route('/api/sensores/all', methods=['GET'])
def get_all_sensores():
    sensores = db.sensores.find()
    return jsonify([{'_id': str(sensor['_id']), 'tipo': sensor['tipo'], 'descripción': sensor['descripción']} for sensor in sensores])


@app.route('/api/experimentos', methods=['POST'])
def crear_experimento():
    if request.method == 'POST':
        datos = request.get_json()
        print(datos)  # Imprimir los datos recibidos
        experimento = {
            "identificador": datos['titulo'],
            "schema": "1.0.0",
            "fecha_inicio": datetime.utcnow(),
            "fecha_fin": datetime.utcnow() + timedelta(days=30),
            "título": datos['titulo'],
            "objetivos": datos['objetivo'],
            "descripción": datos['descripcion'],
            "sensores": [{"tipo": sensor} for sensor in datos['sensores']],
        }
        print(experimento)
        db.experimentos.insert_one(experimento)
        return jsonify({'mensaje': 'Experimento creado con éxito'})
    #elif request.method == 'GET':
        # Tu código para manejar la petición GET
    #    return jsonify({'mensaje': 'Petición GET recibida'})


# Obtener todos los experimentos
@app.route('/api/experimentos/all', methods=['GET'])
def get_all_experimentos():
    experimentos = db.experimentos.find()
    return jsonify([{
        '_id': str(exp['_id']),
        'título': exp['título'],
        'objetivos': exp['objetivos'],
        'descripción': exp['descripción'],
        'fecha_inicio': exp['fecha_inicio']
    } for exp in experimentos])



if __name__ == '__main__':
    app.run(debug=True)