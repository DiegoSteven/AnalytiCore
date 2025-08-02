# -*- coding: utf-8 -*-
from sqlalchemy import text
from database import SessionLocal

try:
    db = SessionLocal()
    result = db.execute(text("SELECT 1")).scalar()
    print("✅ Conexión exitosa a la base de datos. Resultado:", result)
except Exception as e:
    print("❌ Error al conectar a la base de datos:", e)
finally:
    db.close()
