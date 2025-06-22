### Guia de uso

No terminal após clonar e identificar a pasta do projeto, utilize os seguintes comandos:

1.
python -m venv .venv
# No Windows:
.\.venv\Scripts\activate
# No macOS/Linux:
source ./.venv/bin/activate

2. pip install -r requirements.txt
3. uvicorn main:app --reload
4. Pode acessar a rota http://localhost:8000/docs para verificar a documentação.
