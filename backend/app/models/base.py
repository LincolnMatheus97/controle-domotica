# Importa a função `declarative_base` do SQLAlchemy para criar uma base declarativa para os modelos.
from sqlalchemy.ext.declarative import declarative_base

# Cria a base declarativa que será usada por todos os modelos do SQLAlchemy.
Base = declarative_base()
