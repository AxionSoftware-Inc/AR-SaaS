# AR View Backend

Auth hozircha yo'q. Bu backend serverga chiqishdan oldingi DRF poydevori:

- Postgres database: `3d`
- Postgres user: `postgres`
- Postgres password: `root`
- API prefix: `/api/`
- Media upload: `backend/media/models/`

## Local setup

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

Postgres hali o'rnatilmagan bo'lsa, avval database yarating:

```sql
CREATE DATABASE "3d";
ALTER USER postgres WITH PASSWORD 'root';
```

## Main endpoints

- `GET/POST /api/businesses/`
- `GET/POST /api/models/`
- `GET/POST /api/qr-codes/`
- `GET /api/public/models/{id}/`
- `POST /api/public/models/{id}/scan/`

Frontend dev server default `http://127.0.0.1:3000`, backend esa `http://127.0.0.1:8000`.
