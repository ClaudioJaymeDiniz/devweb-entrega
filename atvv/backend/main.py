from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import titular, acomodacao, hospedagem, telefone, endereco, dependente
from database import engine, Base

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Gerenciamento de Titulares",
    description="API para gerenciamento de titulares e seus dados relacionados",
    version="1.0.0"
)
origins = [
    "http://localhost:5174",  # Porta do seu Vite/React frontend
]

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir as rotas
app.include_router(titular.router)
app.include_router(telefone.router)
app.include_router(endereco.router)
app.include_router(acomodacao.router)
app.include_router(hospedagem.router)
app.include_router(dependente.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao Sistema de Gerenciamento de Clientes, acesse /docs para ver a documentação"}