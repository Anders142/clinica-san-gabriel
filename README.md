# Evaluación 03-A — Clínica San Gabriel (Django REST + React)

Contenido:
- `clinica-backend/`  Django + DRF (proyecto `clinica`, app `citas`) — Pregunta 1
- `clinica-frontend/` React + Vite — Preguntas 2, 3 y 4
- `Informe_Evaluacion_03A.docx` Respuestas, explicaciones, código, diagrama y comentarios finales (Pregunta 5)
- `capturas/` Imágenes usadas en el informe

## 1. Backend (terminal 1)
```bash
cd clinica-backend
python -m venv .venv
.venv\Scripts\activate          # Windows  (Linux/Mac: source .venv/bin/activate)
pip install -r requirements.txt
python manage.py migrate
python manage.py cargar_datos   # (opcional) ya viene cargado en db.sqlite3
python manage.py runserver      # http://localhost:8000/api/
```
Administrador: http://localhost:8000/admin  (usuario `admin`, clave `admin12345`).
Pruebas: `python manage.py test`

Endpoints: /api/especialidades/ · /api/medicos/?especialidad=<id> · /api/pacientes/ · /api/citas/?fecha=aaaa-mm-dd · /api/estados/ · /api/historias/

## 2. Frontend (terminal 2)
```bash
cd clinica-frontend
npm install
npm run dev                     # http://localhost:5173
```
Primero debe estar encendido el backend (CORS permite http://localhost:5173).

## Reglas de negocio
- Un médico no puede tener dos citas en la misma fecha y hora (UniqueConstraint + validate() -> 400).
- No se aceptan citas con fecha pasada (400).
- Estados finales (atendida, cancelada) bloquean los botones de cambio de estado.
