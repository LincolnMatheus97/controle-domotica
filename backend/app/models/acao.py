from cena import Cena
from dispositivo import Dispositivo

class Acao:
    """Classe que representa uma ação."""
    def __init__(self, acao: str, idAcao: int, idCena: int, idDispositivo: int, ordem: int, intervaloSegundos: int):
        self.acao = acao
        self.id = idAcao
        self.id_cena = idCena
        self.id_dispositivo = idDispositivo
        self.ordem = ordem
        self.intervalo_segundos = intervaloSegundos
    