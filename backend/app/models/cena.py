class Cena:
    """Classe que representa uma cena."""
    def __init__(self, nome: str, idCena: int, Ativo: bool):
        self.nome = nome
        self.id = idCena
        self.ativo = Ativo