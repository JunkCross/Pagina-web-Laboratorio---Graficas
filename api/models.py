from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['test']

class Ubicacion:
    def __init__(self, area, recinto):
        self.area = area
        self.recinto = recinto

class Recinto:
    def __init__(self, nombre):
        self.nombre = nombre

class Concentrador:
    def __init__(self, placa, ubicacion):
        self.placa = placa
        self.ubicacion = ubicacion

class Sensor:
    def __init__(self, tipo, concentrador):
        self.tipo = tipo
        self.concentrador = concentrador