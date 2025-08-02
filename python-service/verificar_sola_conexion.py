import psycopg2

try:
    conn = psycopg2.connect(
        dbname="analyti_core_db",
        user="postgres",
        password="postgres",
        host="localhost",
        port=5432
    )
    print("✅ Conexión directa a PostgreSQL exitosa.")
    conn.close()
except Exception as e:
    print("❌ Error al conectar directamente con psycopg2:", e)
