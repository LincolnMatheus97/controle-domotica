class Dispositivo:
    """Classe que representa um dispositivo."""
    def __init__(self, Nome: str, idDispositivo: int, Estado: bool = False, idComodo: int = None):
        self.nome = Nome
        self.id = idDispositivo
        self.estado = Estado
        self.id_comodo = idComodo
    
