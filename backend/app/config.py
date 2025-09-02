# app/config.py

# Importa o módulo os para interagir com o sistema operacional
import os
# Importa a função load_dotenv do pacote dotenv para carregar variáveis de ambiente
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Define a URL do banco de dados, obtendo-a das variáveis de ambiente ou usando um valor padrão
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/domotica.db")
