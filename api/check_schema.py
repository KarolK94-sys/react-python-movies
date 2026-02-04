import sqlite3

db = sqlite3.connect('movies.db')
cursor = db.cursor()

# Sprawdź tabele
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]
print(f"Tabele: {tables}")

# Sprawdź kolumny w każdej tabeli
for table in tables:
    cursor.execute(f"PRAGMA table_info({table})")
    columns = cursor.fetchall()
    print(f"\nKolumny w '{table}':")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")

db.close()
