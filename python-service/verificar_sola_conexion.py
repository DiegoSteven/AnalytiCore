# -*- coding: utf-8 -*-
import psycopg2
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

try:
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    print("✅ Conexión directa a PostgreSQL exitosa.")
    conn.close()
except Exception as e:
    print("❌ Error al conectar directamente con psycopg2:", e)