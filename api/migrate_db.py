import sqlite3
import os

db_path = 'movies.db'

# Backup starej bazy
if os.path.exists(db_path):
    os.rename(db_path, 'movies.db.backup')
    print("✅ Backup created: movies.db.backup")

# Tworz nową bazę z pełnym schematem
db = sqlite3.connect(db_path)
cursor = db.cursor()

# Stwórz nową tabelę z pełnym schematem
cursor.execute('''
    CREATE TABLE movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER,
        director TEXT,
        description TEXT,
        actors TEXT
    )
''')

# Wstaw przykładowe dane
cursor.execute('''
    INSERT INTO movies (title, year, director, description, actors)
    VALUES (?, ?, ?, ?, ?)
''', (
    'The Matrix',
    1999,
    'Lana Wachowski',
    'A computer hacker learns the truth about reality and his role in the war against its controllers.',
    'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss'
))

cursor.execute('''
    INSERT INTO movies (title, year, director, description, actors)
    VALUES (?, ?, ?, ?, ?)
''', (
    'Inception',
    2010,
    'Christopher Nolan',
    'A skilled thief who steals corporate secrets through dream-sharing technology.',
    'Leonardo DiCaprio, Ellen Page, Joseph Gordon-Levitt'
))

db.commit()
db.close()

print("✅ Database migrated successfully!")
print("✅ Example movies added")
