from dispositivo import Dispositivo
from typing import List

class Comodo:
    """Classe que representa um cômodo."""
    def __init__(self, nome: str, id: int, dispositivos: List[Dispositivo]):
        self.nome = nome
        self.id = id
        self.dispositivos = dispositivos
    
        